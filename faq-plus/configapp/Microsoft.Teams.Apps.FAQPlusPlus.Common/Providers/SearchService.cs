// <copyright file="SearchService.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Providers
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.ApplicationInsights.DataContracts;
    using Microsoft.Azure.Search;
    using Microsoft.Azure.Search.Models;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Teams.Apps.FAQPlusPlus.Common.Models;
    using Microsoft.Teams.Apps.FAQPlusPlus.Common.Models.Configuration;

    /// <summary>
    /// SearchService which will help in creating index, indexer and datasource if it doesn't exist
    /// for indexing table which will be used for search by message extension.
    /// </summary>
    public class SearchService : ISearchService
    {
        private const string TicketsIndexName = "tickets-index";
        private const string TicketsIndexerName = "tickets-indexer";
        private const string TicketsDataSourceName = "tickets-storage";

        // Default to 25 results, same as page size of a messaging extension query
        private const int DefaultSearchResultCount = 25;

        private readonly Lazy<Task> initializeTask;
        private readonly SearchServiceClient searchServiceClient;
        private readonly SearchIndexClient searchIndexClient;
        private readonly ITicketsProvider ticketProvider;
        private readonly int searchIndexingIntervalInMinutes;
        private readonly ILogger<SearchService> logger;

        /// <summary>
        /// Represents a set of key/value application configuration properties.
        /// </summary>
        private readonly KnowledgeBaseSettings options;

        /// <summary>
        /// Initializes a new instance of the <see cref="SearchService"/> class.
        /// </summary>
        /// <param name="optionsAccessor">A set of key/value application configuration properties.</param>
        /// <param name="ticketProvider"> TicketsProvider provided by dependency injection.</param>
        /// <param name="logger">Instance to send logs to the Application Insights service.</param>
        public SearchService(
            IOptionsMonitor<KnowledgeBaseSettings> optionsAccessor,
            ITicketsProvider ticketProvider,
            ILogger<SearchService> logger)
        {
            this.options = optionsAccessor.CurrentValue;
            string searchServiceValue = this.options.SearchServiceName;
            this.searchServiceClient = new SearchServiceClient(
                searchServiceValue,
                new SearchCredentials(this.options.SearchServiceAdminApiKey));
            this.searchIndexClient = new SearchIndexClient(
                searchServiceValue,
                TicketsIndexName,
                new SearchCredentials(this.options.SearchServiceQueryApiKey));
            this.searchIndexingIntervalInMinutes = Convert.ToInt32(this.options.SearchIndexingIntervalInMinutes);

            this.initializeTask = new Lazy<Task>(() => this.InitializeAsync(this.options.StorageConnectionString));
            this.ticketProvider = ticketProvider;
            this.logger = logger;
        }

        /// <summary>
        /// Provide search result for table to be used by SME based on Azure search service.
        /// </summary>
        /// <param name="searchScope">Scope of the search.</param>
        /// <param name="searchQuery">searchQuery to be provided by message extension.</param>
        /// <param name="count">Number of search results to return.</param>
        /// <param name="skip">Number of search results to skip.</param>
        /// <returns>List of search results.</returns>
        public async Task<IList<TicketEntity>> SearchTicketsAsync(TicketSearchScope searchScope, string searchQuery, int? count = null, int? skip = null)
        {
            await this.EnsureInitializedAsync().ConfigureAwait(false);

            IList<TicketEntity> tickets = new List<TicketEntity>();

            SearchParameters searchParameters = new SearchParameters();
            switch (searchScope)
            {
                case TicketSearchScope.RecentTickets:
                    searchParameters.OrderBy = new[] { "Timestamp desc" };
                    break;

                case TicketSearchScope.OpenTickets:
                    searchParameters.Filter = "Status eq " + (int)TicketState.Open + " and AssignedToName eq null";
                    searchParameters.OrderBy = new[] { "Timestamp desc" };
                    break;

                case TicketSearchScope.AssignedTickets:
                    searchParameters.Filter = "Status eq " + (int)TicketState.Open + " and AssignedToName ne null";
                    searchParameters.OrderBy = new[] { "Timestamp desc" };
                    break;
            }

            searchParameters.Top = count ?? DefaultSearchResultCount;
            searchParameters.Skip = skip ?? 0;
            searchParameters.IncludeTotalResultCount = false;
            searchParameters.Select = new[] { "Timestamp", "Title", "Status", "AssignedToName", "AssignedToObjectId", "DateCreated", "RequesterName", "RequesterUserPrincipalName", "Description", "RequesterGivenName", "SmeThreadConversationId", "DateAssigned", "DateClosed", "LastModifiedByName", "UserQuestion", "KnowledgeBaseAnswer" };

            var docs = await this.searchIndexClient.Documents.SearchAsync<TicketEntity>(searchQuery, searchParameters).ConfigureAwait(false);
            if (docs != null)
            {
                foreach (SearchResult<TicketEntity> doc in docs.Results)
                {
                    tickets.Add(doc.Document);
                }
            }

            return tickets;
        }

        /// <summary>
        /// Create index, indexer and data source it doesn't exist.
        /// </summary>
        /// <param name="storageConnectionString">Connection string to the data store.</param>
        /// <returns>Tracking task.</returns>
        private async Task InitializeAsync(string storageConnectionString)
        {
            try
            {
                await this.ticketProvider.GetTicketAsync(string.Empty); // When there is no ticket created by end user and messaging extension is open by SME, table initialization is required here before creating search index or datasource or indexer.
                await this.CreateIndexAsync().ConfigureAwait(false);
                await this.CreateDataSourceAsync(storageConnectionString).ConfigureAwait(false);
                await this.CreateIndexerAsync().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"Failed to initialize Azure Search Service: {ex.Message}", SeverityLevel.Error);
                throw;
            }
        }

        /// <summary>
        /// Create index in Azure search service if it doesn't exist.
        /// </summary>
        /// <returns><see cref="Task"/> That represents index is created if it is not created.</returns>
        private async Task CreateIndexAsync()
        {
            if (!this.searchServiceClient.Indexes.Exists(TicketsIndexName))
            {
                var tableIndex = new Index()
                {
                    Name = TicketsIndexName,
                    Fields = FieldBuilder.BuildForType<TicketEntity>(),
                };
                await this.searchServiceClient.Indexes.CreateAsync(tableIndex).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Add data source if it doesn't exist in Azure search service.
        /// </summary>
        /// <param name="connectionString">Connection string to the data store.</param>
        /// <returns><see cref="Task"/> That represents data source is added to Azure search service.</returns>
        private async Task CreateDataSourceAsync(string connectionString)
        {
            if (!this.searchServiceClient.DataSources.Exists(TicketsDataSourceName))
            {
                var dataSource = DataSource.AzureTableStorage(
                                  name: TicketsDataSourceName,
                                  storageConnectionString: connectionString,
                                  tableName: Constants.TicketTableName);

                await this.searchServiceClient.DataSources.CreateAsync(dataSource).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Create indexer if it doesn't exist in Azure search service.
        /// </summary>
        /// <returns><see cref="Task"/> That represents indexer is created if not available in Azure search service.</returns>
        private async Task CreateIndexerAsync()
        {
            if (!this.searchServiceClient.Indexers.Exists(TicketsIndexerName))
            {
                var indexer = new Indexer()
                {
                    Name = TicketsIndexerName,
                    DataSourceName = TicketsDataSourceName,
                    TargetIndexName = TicketsIndexName,
                    Schedule = new IndexingSchedule(TimeSpan.FromMinutes(this.searchIndexingIntervalInMinutes)),
                };

                await this.searchServiceClient.Indexers.CreateAsync(indexer).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Initialization of InitializeAsync method which will help in indexing.
        /// </summary>
        /// <returns>Task with initialized data.</returns>
        private Task EnsureInitializedAsync()
        {
            return this.initializeTask.Value;
        }
    }
}

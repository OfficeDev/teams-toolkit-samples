// <copyright file="KnowledgeBaseSearchService.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Providers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Azure.Search;
    using Microsoft.Azure.Search.Models;
    using Microsoft.Teams.Apps.FAQPlusPlus.Common.Models;

    /// <summary>
    /// Azure blob search service class for question and answer pairs.
    /// </summary>
    public class KnowledgeBaseSearchService : IKnowledgeBaseSearchService
    {
        /// <summary>
        /// Search index name for knowledge base search service.
        /// </summary>
        private const string KnowledgeBaseSearchIndexName = "teams-faqplus-index";

        /// <summary>
        /// Data source name for knowledge base search service.
        /// </summary>
        private const string KnowledgeBaseDataSourceName = "faqplus-datasource";

        private const int TopCount = 50;
        private readonly string indexName;
        private readonly string dataSourceName;
        private readonly string searchServiceName;
        private readonly string searchServiceQueryApiKey;
        private readonly string searchServiceAdminApiKey;
        private readonly string storageConnectionString;
        private ISearchServiceClient searchServiceClient;
        private SearchIndexClient searchIndexClient;

        /// <summary>
        /// Initializes a new instance of the <see cref="KnowledgeBaseSearchService"/> class.
        /// </summary>
        /// <param name="searchServiceName">Search service name.</param>
        /// <param name="searchServiceQueryApiKey">Search service query api key.</param>
        /// <param name="searchServiceAdminApiKey">Search service admin api key.</param>
        /// <param name="storageConnectionString">Storage connection string.</param>
        public KnowledgeBaseSearchService(string searchServiceName, string searchServiceQueryApiKey, string searchServiceAdminApiKey, string storageConnectionString)
        {
            this.indexName = KnowledgeBaseSearchIndexName;
            this.dataSourceName = KnowledgeBaseDataSourceName;
            this.searchServiceName = searchServiceName;
            this.searchServiceQueryApiKey = searchServiceQueryApiKey;
            this.searchServiceAdminApiKey = searchServiceAdminApiKey;
            this.storageConnectionString = storageConnectionString;
            this.InitializeSearchService();
        }

        /// <summary>
        /// This method gives search result(Knowledgebase QnA pairs) based on search query for messaging extension.
        /// </summary>
        /// <param name="searchQuery">Search query for question and answer pair.</param>
        /// <returns>Search result list.</returns>
        public async Task<IList<AzureSearchEntity>> GetAzureSearchEntitiesAsync(string searchQuery)
        {
            IList<AzureSearchEntity> qnaPairs = new List<AzureSearchEntity>();
            SearchParameters searchParameters = default(SearchParameters);
            string searchFilter = string.Empty;
            if (string.IsNullOrWhiteSpace(searchQuery))
            {
                searchParameters = new SearchParameters()
                {
                    OrderBy = new[] { "createddate desc" },
                    Top = TopCount,
                };
            }
            else
            {
                searchParameters = new SearchParameters()
                {
                    OrderBy = new[] { "search.score() desc" },
                    Top = TopCount,
                };
                searchFilter = searchQuery;
            }

            if (this.searchServiceClient.Indexes.Exists(this.indexName))
            {
                var documents = await this.searchIndexClient.Documents.SearchAsync<AzureSearchEntity>(searchFilter + "*", searchParameters).ConfigureAwait(false);
                if (documents != null)
                {
                    foreach (SearchResult<AzureSearchEntity> searchResult in documents.Results)
                    {
                        qnaPairs.Add(searchResult.Document);
                    }
                }
            }

            return qnaPairs;
        }

        /// <summary>
        /// Creates Index, Data Source and Indexer for search service.
        /// </summary>
        /// <returns>A task that represents the work queued to execute.</returns>
        public async Task InitializeSearchServiceDependencyAsync()
        {
            await this.CreateSearchIndexAsync(this.searchServiceClient).ConfigureAwait(false);
            await this.CreateDataSourceAsync(this.searchServiceClient).ConfigureAwait(false);
            await this.CreateIndexerAsync(this.searchServiceClient).ConfigureAwait(false);
        }

        /// <summary>
        /// Creates new SearchIndex with INDEX_NAME provided, if already exists then delete the index and create again.
        /// </summary>
        /// <param name="searchClient">Search client.</param>
        private async Task CreateSearchIndexAsync(ISearchServiceClient searchClient)
        {
            if (await searchClient.Indexes.ExistsAsync(this.indexName).ConfigureAwait(false))
            {
                await searchClient.Indexes.DeleteAsync(this.indexName);
            }

            var definition = new Index()
            {
                Name = this.indexName,
                Fields = FieldBuilder.BuildForType<AzureSearchEntity>(),
            };
            await searchClient.Indexes.CreateAsync(definition).ConfigureAwait(false);
        }

        /// <summary>
        /// Creates new DataSource with DATASOURCE_NAME provided, if already exist no change happen.
        /// </summary>
        /// <param name="searchClient">Search client.</param>
        private async Task CreateDataSourceAsync(ISearchServiceClient searchClient)
        {
            if (await searchClient.DataSources.ExistsAsync(this.dataSourceName).ConfigureAwait(false))
            {
                return;
            }

            var dataSourceConfig = new DataSource()
            {
                Name = this.dataSourceName,
                Container = new DataContainer(Constants.StorageContainer, Constants.BlobFolderName),
                Credentials = new DataSourceCredentials(this.storageConnectionString),
                Type = DataSourceType.AzureBlob,
            };

            await searchClient.DataSources.CreateAsync(dataSourceConfig).ConfigureAwait(false);
        }

        /// <summary>
        /// Creates new Indexer with INDEXER_NAME provided, if already exist no change happen.
        /// </summary>
        /// <param name="searchClient">Search client.</param>
        private async Task CreateIndexerAsync(ISearchServiceClient searchClient)
        {
            if (await searchClient.Indexers.ExistsAsync(this.indexName).ConfigureAwait(false))
            {
                await searchClient.Indexers.RunAsync(this.indexName);
                return;
            }

            var parseConfig = new Dictionary<string, object>();
            parseConfig.Add("parsingMode", "jsonArray");

            var indexerConfig = new Indexer()
            {
                Name = this.indexName,
                DataSourceName = this.dataSourceName,
                TargetIndexName = this.indexName,
                Parameters = new IndexingParameters()
                {
                    Configuration = parseConfig,
                },
            };
            await searchClient.Indexers.CreateAsync(indexerConfig).ConfigureAwait(false);
        }

        /// <summary>
        /// Initialize the search service client.
        /// </summary>
        private void InitializeSearchService()
        {
            this.searchServiceClient = new SearchServiceClient(
                this.searchServiceName,
                new SearchCredentials(this.searchServiceAdminApiKey));

            this.searchIndexClient = new SearchIndexClient(
                this.searchServiceName,
                this.indexName,
                new SearchCredentials(this.searchServiceQueryApiKey));
        }
    }
}
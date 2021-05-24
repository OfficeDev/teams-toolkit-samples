// <copyright file="ConfigurationDataProvider.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>
namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Providers
{
    using System;
    using System.Net;
    using System.Threading.Tasks;
    using Microsoft.Teams.Apps.FAQPlusPlus.Common.Models;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Table;

    /// <summary>
    /// ConfigurationProvider used to store and fetch configuration values stored in azure table storage.
    /// </summary>
    public class ConfigurationDataProvider : IConfigurationDataProvider
    {
        /// <summary>
        /// Configuration info table name.
        /// </summary>
        private const string ConfigurationTableName = "ConfigurationInfo";

        /// <summary>
        /// Partition key of Confiugration info table.
        /// </summary>
        private const string ConfigurationPartitionKey = "ConfigurationInfo";

        private readonly Lazy<Task> initializeTask;
        private CloudTable configurationCloudTable;

        /// <summary>
        /// Initializes a new instance of the <see cref="ConfigurationDataProvider"/> class.
        /// </summary>
        /// <param name="connectionString">Connection string of storage provided by dependency injection.</param>
        public ConfigurationDataProvider(string connectionString)
        {
            this.initializeTask = new Lazy<Task>(() => this.InitializeAsync(connectionString));
        }

        /// <summary>
        /// Save or update entity based on entity type.
        /// </summary>
        /// <param name="updatedData">Updated data received from view page.</param>
        /// <param name="entityType">EntityType received from view based on which appropriate row will replaced or inserted in table storage.</param>
        /// <returns>A <see cref="Task"/> of type bool where true represents updated data is saved or updated successfully while false indicates failure in saving or updating the updated data.</returns>
        public async Task<bool> UpsertEntityAsync(string updatedData, string entityType)
        {
            var configurationEntity = new ConfigurationEntity()
            {
                PartitionKey = ConfigurationPartitionKey,
                RowKey = entityType,
                Data = updatedData,
            };
            var tableResult = await this.StoreOrUpdateEntityAsync(configurationEntity).ConfigureAwait(false);
            return tableResult.HttpStatusCode == (int)HttpStatusCode.NoContent;
        }

        /// <summary>
        /// Get already saved entity detail from storage table.
        /// </summary>
        /// <param name="entityType">EntityType received from view based on which appropriate row data will be fetched.</param>
        /// <returns><see cref="Task"/>Already saved entity detail.</returns>
        public async Task<string> GetSavedEntityDetailAsync(string entityType)
        {
            await this.EnsureInitializedAsync().ConfigureAwait(false);
            var searchOperation = TableOperation.Retrieve<ConfigurationEntity>(ConfigurationPartitionKey, entityType);
            TableResult searchResult = await this.configurationCloudTable.ExecuteAsync(searchOperation).ConfigureAwait(false);
            var result = (ConfigurationEntity)searchResult.Result;
            return result?.Data ?? string.Empty;
        }

        /// <summary>
        /// Store or update configuration entity in table storage.
        /// </summary>
        /// <param name="entity">Configuration entity object.</param>
        /// <returns><see cref="Task"/> That represents configuration entity is saved or updated.</returns>
        private async Task<TableResult> StoreOrUpdateEntityAsync(ConfigurationEntity entity)
        {
            await this.EnsureInitializedAsync().ConfigureAwait(false);
            TableOperation addOrUpdateOperation = TableOperation.InsertOrReplace(entity);
            return await this.configurationCloudTable.ExecuteAsync(addOrUpdateOperation).ConfigureAwait(false);
        }

        /// <summary>
        /// Create teams table if it doesn't exist.
        /// </summary>
        /// <param name="connectionString">Storage account connection string.</param>
        /// <returns><see cref="Task"/> Representing the asynchronous operation task which represents table is created if its not existing.</returns>
        private async Task InitializeAsync(string connectionString)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            CloudTableClient cloudTableClient = storageAccount.CreateCloudTableClient();
            this.configurationCloudTable = cloudTableClient.GetTableReference(ConfigurationTableName);
            await this.configurationCloudTable.CreateIfNotExistsAsync().ConfigureAwait(false);
        }

        /// <summary>
        /// Initialization of InitializeAsync method which will help in creating table.
        /// </summary>
        /// <returns>Initialized task with values.</returns>
        private async Task EnsureInitializedAsync()
        {
            await this.initializeTask.Value.ConfigureAwait(false);
        }
    }
}

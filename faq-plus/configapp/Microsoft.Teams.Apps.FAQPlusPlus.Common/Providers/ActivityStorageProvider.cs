// <copyright file="ActivityStorageProvider.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Providers
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Options;
    using Microsoft.Teams.Apps.FAQPlusPlus.Common.Models;
    using Microsoft.Teams.Apps.FAQPlusPlus.Common.Models.Configuration;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Table;

    /// <summary>
    /// Storage provider for Activities table.
    /// </summary>
    public class ActivityStorageProvider : IActivityStorageProvider
    {
        /// <summary>
        /// Table name which stores activity id of responded card.
        /// </summary>
        public const string ActivityTableName = "ActivityEntity";

        /// <summary>
        /// Partition key value of activity entity table storage.
        /// </summary>
        public const string ActivityParitionKey = "ActivityEntity";

        /// <summary>
        /// Task for initialization.
        /// </summary>
        private readonly Lazy<Task> initializeTask;

        /// <summary>
        /// CloudTableClient object provides a service client for accessing the azure Table service.
        /// </summary>
        private CloudTableClient cloudTableClient;

        /// <summary>
        /// CloudTable object that represents a table.
        /// </summary>
        private CloudTable cloudTable;

        /// <summary>
        /// Initializes a new instance of the <see cref="ActivityStorageProvider"/> class.
        /// </summary>
        /// <param name="optionsAccessor">A set of key/value application configuration properties.</param>
        public ActivityStorageProvider(IOptionsMonitor<KnowledgeBaseSettings> optionsAccessor)
        {
            this.initializeTask = new Lazy<Task>(() => this.InitializeAsync(connectionString: optionsAccessor?.CurrentValue?.StorageConnectionString));
        }

        /// <summary>
        /// Get activity ids.
        /// </summary>
        /// <param name="activityReferenceId">Unique GUID referencing to activity id.</param>
        /// <returns>Activity entity object.</returns>
        public async Task<IList<ActivityEntity>> GetAsync(string activityReferenceId)
        {
            await this.EnsureInitializedAsync().ConfigureAwait(false);
            string partitionKeyCondition = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, ActivityParitionKey);
            string rowKeyCondition = TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, activityReferenceId);
            string condition = TableQuery.CombineFilters(partitionKeyCondition, TableOperators.And, rowKeyCondition);
            TableQuery<ActivityEntity> query = new TableQuery<ActivityEntity>().Where(condition);

            TableContinuationToken continuationToken = null;
            List<ActivityEntity> activities = new List<ActivityEntity>();
            do
            {
                var queryResult = await this.cloudTable.ExecuteQuerySegmentedAsync(query, continuationToken).ConfigureAwait(false);
                activities.AddRange(queryResult.Results);
                continuationToken = queryResult.ContinuationToken;
            }
            while (continuationToken != null);

            return activities;
        }

        /// <summary>
        /// Add the activity entity object in table storage.
        /// </summary>
        /// <param name="activityEntity">Activity table entity.</param>
        /// <returns>A <see cref="Task"/> of type bool where true represents activity entity object is added in table storage successfully while false indicates failure in saving data.</returns>
        public async Task<bool> AddActivityEntityAsync(ActivityEntity activityEntity)
        {
            await this.EnsureInitializedAsync().ConfigureAwait(false);
            TableOperation insertOrMergeOperation = TableOperation.InsertOrReplace(activityEntity);
            TableResult result = await this.cloudTable.ExecuteAsync(insertOrMergeOperation).ConfigureAwait(false);
            return result.HttpStatusCode == (int)HttpStatusCode.NoContent;
        }

        /// <summary>
        /// Get all activity ids.
        /// </summary>
        /// <returns>List of activity ids.</returns>
        public async Task<IEnumerable<ActivityEntity>> GetActivityEntitiesAsync()
        {
            await this.EnsureInitializedAsync().ConfigureAwait(false);
            var activityEntities = new List<ActivityEntity>();
            var query = new TableQuery<ActivityEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, ActivityParitionKey));
            TableContinuationToken tableContinuationToken = null;

            do
            {
                var queryResponse = await this.cloudTable.ExecuteQuerySegmentedAsync(query, tableContinuationToken).ConfigureAwait(false);
                tableContinuationToken = queryResponse.ContinuationToken;
                activityEntities.AddRange(queryResponse.Results);
            }
            while (tableContinuationToken != null);

            return activityEntities;
        }

        /// <summary>
        /// This method delete the activity record from table.
        /// </summary>
        /// <param name="activityEntity">Activity table entity.</param>
        /// <returns>A <see cref="Task"/> of type bool where true represents activity record is successfully deleted from table while false indicates failure in deleting data.</returns>
        public async Task<bool> DeleteActivityEntityAsync(ActivityEntity activityEntity)
        {
            await this.EnsureInitializedAsync().ConfigureAwait(false);
            if (activityEntity != null)
            {
                // An ETag property is used for optimistic concurrency during updates.
                activityEntity.ETag = "*";
            }

            TableOperation insertOrMergeOperation = TableOperation.Delete(activityEntity);
            TableResult result = await this.cloudTable.ExecuteAsync(insertOrMergeOperation).ConfigureAwait(false);
            return result.HttpStatusCode == (int)HttpStatusCode.NoContent;
        }

        /// <summary>
        /// Ensure table storage connection is initialized.
        /// </summary>
        /// <returns>Initialized task.</returns>
        private async Task EnsureInitializedAsync()
        {
            await this.initializeTask.Value.ConfigureAwait(false);
        }

        /// <summary>
        /// Create tables if it doesn't exist.
        /// </summary>
        /// <param name="connectionString">Storage account connection string.</param>
        /// <returns><see cref="Task"/> Representing the asynchronous operation task which represents table is created if its not existing.</returns>
        private async Task<CloudTable> InitializeAsync(string connectionString)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            this.cloudTableClient = storageAccount.CreateCloudTableClient();
            this.cloudTable = this.cloudTableClient.GetTableReference(ActivityTableName);
            if (!await this.cloudTable.ExistsAsync().ConfigureAwait(false))
            {
                await this.cloudTable.CreateIfNotExistsAsync().ConfigureAwait(false);
            }

            return this.cloudTable;
        }
    }
}

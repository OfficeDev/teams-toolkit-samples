// <copyright file="KnowledgeBaseSettings.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Models.Configuration
{
    /// <summary>
    /// Provides  settings related to KnowledgeBaseSearchService.
    /// </summary>
    public class KnowledgeBaseSettings
    {
        /// <summary>
        /// Gets or sets storage connection string.
        /// </summary>
        public string StorageConnectionString { get; set; }

        /// <summary>
        /// Gets or sets search service name.
        /// </summary>
        public string SearchServiceName { get; set; }

        /// <summary>
        /// Gets or sets search service query api key.
        /// </summary>
        public string SearchServiceQueryApiKey { get; set; }

        /// <summary>
        /// Gets or sets search service admin api key.
        /// </summary>
        public string SearchServiceAdminApiKey { get; set; }

        /// <summary>
        /// Gets or sets search indexing interval in minutes.
        /// </summary>
        public string SearchIndexingIntervalInMinutes { get; set; }
    }
}

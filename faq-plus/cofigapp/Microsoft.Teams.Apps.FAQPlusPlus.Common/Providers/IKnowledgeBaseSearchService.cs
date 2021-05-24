// <copyright file="IKnowledgeBaseSearchService.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Providers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Teams.Apps.FAQPlusPlus.Common.Models;

    /// <summary>
    /// Azure blob search service interface.
    /// </summary>
    public interface IKnowledgeBaseSearchService
    {
        /// <summary>
        /// This method gives search result(Knowledgebase QnA pairs) based on search query for messaging extension.
        /// </summary>
        /// <param name="searchQuery">Search query for question and answer pair.</param>
        /// <returns>Search result list.</returns>
        Task<IList<AzureSearchEntity>> GetAzureSearchEntitiesAsync(string searchQuery);

        /// <summary>
        /// Creates Index, Data Source and Indexer for search service.
        /// </summary>
        /// <returns>A task that represents the work queued to execute.</returns>
        Task InitializeSearchServiceDependencyAsync();
    }
}

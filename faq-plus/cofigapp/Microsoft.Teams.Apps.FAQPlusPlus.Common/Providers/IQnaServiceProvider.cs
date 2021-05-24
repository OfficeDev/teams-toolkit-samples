// <copyright file="IQnaServiceProvider.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Providers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker.Models;
    using Microsoft.Teams.Apps.FAQPlusPlus.Common.Models;

    /// <summary>
    /// Qna maker service provider interface.
    /// </summary>
    public interface IQnaServiceProvider
    {
        /// <summary>
        /// This method is used to add QnA pair in Kb.
        /// </summary>
        /// <param name="question">Question text.</param>
        /// <param name="combinedDescription">Answer text.</param>
        /// <param name="createdBy">Created by user name.</param>
        /// <param name="conversationId">Conversation id.</param>
        /// <param name="activityReferenceId">Activity reference id.</param>
        /// <returns>Operation status of performed action.</returns>
        Task<Operation> AddQnaAsync(string question, string combinedDescription, string createdBy, string conversationId, string activityReferenceId);

        /// <summary>
        /// This method is used to delete Qna pair from KB.
        /// </summary>
        /// <param name="questionId">Question id.</param>
        /// <returns>Delete response.</returns>
        Task DeleteQnaAsync(int questionId);

        /// <summary>
        /// This method returns the downloaded knowledgebase documents.
        /// </summary>
        /// <param name="knowledgeBaseId">Knowledgebase Id.</param>
        /// <returns>Json string.</returns>
        Task<IEnumerable<QnADTO>> DownloadKnowledgebaseAsync(string knowledgeBaseId);

        /// <summary>
        /// Get answer from knowledgebase for a given question.
        /// </summary>
        /// <param name="question">Question text.</param>
        /// <param name="isTestKnowledgeBase">Prod or test.</param>
        /// <param name="previousQnAId">Id of previous question.</param>
        /// <param name="previousUserQuery">Previous question information.</param>
        /// <returns>QnaSearchResult object as response.</returns>
        Task<QnASearchResultList> GenerateAnswerAsync(string question, bool isTestKnowledgeBase, string previousQnAId = null, string previousUserQuery = null);

        /// <summary>
        /// This method is used to update Qna pair in Kb.
        /// </summary>
        /// <param name="questionId">Question id.</param>
        /// <param name="answer">Answer text.</param>
        /// <param name="updatedBy">Updated by user.</param>
        /// <param name="updatedQuestion">Updated question text.</param>
        /// <param name="question">Original question text.</param>
        /// <returns>Task of updated action.</returns>
        Task UpdateQnaAsync(int questionId, string answer, string updatedBy, string updatedQuestion, string question);

        /// <summary>
        /// Checks whether knowledgebase need to be published.
        /// </summary>
        /// <param name="knowledgeBaseId">Knowledgebase id.</param>
        /// <returns>A <see cref="Task"/> of type bool where true represents knowledgebase need to be published while false indicates knowledgebase not need to be published.</returns>
        Task<bool> GetPublishStatusAsync(string knowledgeBaseId);

        /// <summary>
        /// Method is used to publish knowledgebase.
        /// </summary>
        /// <param name="knowledgeBaseId">Knowledgebase Id.</param>
        /// <returns>Task for published data.</returns>
        Task PublishKnowledgebaseAsync(string knowledgeBaseId);

        /// <summary>
        /// Get knowledgebase published information.
        /// </summary>
        /// <param name="knowledgeBaseId">Knowledgebase id.</param>
        /// <returns>A <see cref="Task"/> of type bool where true represents knowledgebase has published atleast once while false indicates that knowledgebase has not published yet.</returns>
        Task<bool> GetInitialPublishedStatusAsync(string knowledgeBaseId);
    }
}

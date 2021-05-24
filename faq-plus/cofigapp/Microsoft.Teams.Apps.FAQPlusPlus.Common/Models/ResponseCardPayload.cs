// <copyright file="ResponseCardPayload.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Models
{
    using System.Collections.Generic;
    using Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker.Models;

    /// <summary>
    /// Represents the payload of a response card.
    /// </summary>
    public class ResponseCardPayload : TeamsAdaptiveSubmitActionData
    {
        /// <summary>
        /// Gets or sets the question that was asked originally asked by the user.
        /// </summary>
        public string UserQuestion { get; set; }

        /// <summary>
        /// Gets or sets the response given by the bot to the user.
        /// </summary>
        public string KnowledgeBaseAnswer { get; set; }

        /// <summary>
        /// Gets or sets list of previous questions when a follow up prompt is selected.
        /// </summary>
        public List<QnADTO> PreviousQuestions { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether question is from prompt.
        /// </summary>
        public bool IsPrompt { get; set; }
    }
}

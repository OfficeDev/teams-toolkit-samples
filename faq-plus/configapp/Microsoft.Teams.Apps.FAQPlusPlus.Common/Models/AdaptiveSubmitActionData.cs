// <copyright file="AdaptiveSubmitActionData.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Models
{
    using Newtonsoft.Json;

    /// <summary>
    /// Adaptive Card Action class to post question data.
    /// </summary>
    public class AdaptiveSubmitActionData : TeamsAdaptiveSubmitActionData
    {
        /// <summary>
        /// Gets or sets Updated question.
        /// </summary>
        [JsonProperty("updatedquestion")]
        public string UpdatedQuestion { get; set; }

        /// <summary>
        /// Gets or sets Title.
        /// </summary>
        [JsonProperty("title")]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets Subtitle.
        /// </summary>
        [JsonProperty("subtitle")]
        public string Subtitle { get; set; }

        /// <summary>
        /// Gets or sets Description.
        /// </summary>
        [JsonProperty("description")]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets ImageUrl.
        /// </summary>
        [JsonProperty("imageurl")]
        public string ImageUrl { get; set; }

        /// <summary>
        /// Gets or sets RedirectionUrl.
        /// </summary>
        [JsonProperty("redirectionurl")]
        public string RedirectionUrl { get; set; }

        /// <summary>
        /// Gets or sets Answer.
        /// </summary>
        [JsonProperty("answer")]
        public string Answer { get; set; }

        /// <summary>
        /// Gets or sets activity id.
        /// </summary>
        [JsonProperty("activityid")]
        public string ActivityId { get; set; }

        /// <summary>
        /// Gets or sets preview button command text to identify the performed action while adding/editing the QnA pair.
        /// </summary>
        [JsonProperty("previewbuttoncommandtext")]
        public string PreviewButtonCommandText { get; set; }

        /// <summary>
        /// Gets or sets back button command text to identify the performed action while previewing the QnA pair.
        /// </summary>
        [JsonProperty("backbuttoncommandtext")]
        public string BackButtonCommandText { get; set; }

        /// <summary>
        /// Gets or sets back button to identify it.
        /// </summary>
        [JsonProperty("updatehistorydata")]
        public string UpdateHistoryData { get; set; }

        /// <summary>
        /// Gets or sets original question.
        /// </summary>
        public string OriginalQuestion { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the qna pair is null or empty.
        /// </summary>
        public bool IsQnaNullOrEmpty { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the html is present in input field.
        /// </summary>
        public bool IsHTMLPresent { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the image redirect url is invalid.
        /// </summary>
        public bool IsInvalidImageUrl { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the image redirect url is invalid.
        /// </summary>
        public bool IsInvalidRedirectUrl { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the question is already present in knowledgebase.
        /// </summary>
        public bool IsQuestionAlreadyExists { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the query is for test or production knowledgebase.
        /// </summary>
        public bool IsTestKnowledgeBase { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the card is with image and title or normal card.
        /// </summary>
        public bool IsRichCard { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the card is displaying as preview.
        /// </summary>
        public bool IsPreviewCard { get; set; }
    }
}

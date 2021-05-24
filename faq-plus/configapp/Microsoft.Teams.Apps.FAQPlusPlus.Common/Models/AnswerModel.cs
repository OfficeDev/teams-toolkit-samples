// <copyright file="AnswerModel.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Models
{
    using Newtonsoft.Json;

    /// <summary>
    /// Represents the FAQPlus QnA Maker answer response model.
    /// </summary>
    public class AnswerModel
    {
        /// <summary>
        /// Gets or sets Description.
        /// </summary>
        [JsonProperty("Description")]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets Title.
        /// </summary>
        [JsonProperty("Title")]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets Subtitle.
        /// </summary>
        [JsonProperty("Subtitle")]
        public string Subtitle { get; set; }

        /// <summary>
        /// Gets or sets ImageUrl.
        /// </summary>
        [JsonProperty("ImageUrl")]
        public string ImageUrl { get; set; }

        /// <summary>
        /// Gets or sets RedirectionUrl.
        /// </summary>
        [JsonProperty("RedirectionUrl")]
        public string RedirectionUrl { get; set; }
    }
}

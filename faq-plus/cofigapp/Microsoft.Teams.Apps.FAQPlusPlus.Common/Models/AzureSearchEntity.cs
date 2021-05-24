// <copyright file="AzureSearchEntity.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Models
{
    using System;
    using System.Collections.Generic;
    using Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker.Models;
    using Microsoft.Azure.Search;
    using Microsoft.Azure.Search.Models;
    using Newtonsoft.Json;

    /// <summary>
    /// This entity is used for azure search.
    /// </summary>
    public class AzureSearchEntity
    {
        /// <summary>
        /// Gets or sets Question Id.
        /// </summary>
        [System.ComponentModel.DataAnnotations.Key]
        [IsFilterable]
        [JsonProperty("id")]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets Answer text.
        /// </summary>
        [IsSearchable]
        [IsFilterable]
        [Analyzer(AnalyzerName.AsString.ElMicrosoft)]
        [JsonProperty("answer")]
        public string Answer { get; set; }

        /// <summary>
        /// Gets or sets Source.
        /// </summary>
        [IsSearchable]
        [Analyzer(AnalyzerName.AsString.ElMicrosoft)]
        [JsonProperty("source")]
        public string Source { get; set; }

        /// <summary>
        /// Gets or sets list of Questions.
        /// </summary>
        [IsSearchable]
        [IsFilterable]
        [Analyzer(AnalyzerName.AsString.ElMicrosoft)]
        [JsonProperty("questions")]
        public IList<string> Questions { get; set; }

        /// <summary>
        /// Gets or sets Metadata.
        /// </summary>
        [JsonProperty("metadata")]
        public IList<MetadataDTO> Metadata { get; set; }

        /// <summary>
        /// Gets or sets CreatedDate.
        /// </summary>
        [IsSortable]
        [IsFilterable]
        [JsonProperty("createddate")]
        public DateTimeOffset? CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets UpdatedDate.
        /// </summary>
        [IsSortable]
        [IsFilterable]
        [JsonProperty("updateddate")]
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}

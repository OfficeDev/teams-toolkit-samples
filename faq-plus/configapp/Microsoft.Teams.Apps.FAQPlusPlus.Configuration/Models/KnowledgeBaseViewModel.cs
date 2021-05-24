// <copyright file="KnowledgeBaseViewModel.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>
namespace Microsoft.Teams.Apps.FAQPlusPlus.Configuration.Models
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// KnowledgeBase View Model.
    /// </summary>
    public class KnowledgeBaseViewModel
    {
        /// <summary>
        /// Gets or sets knowledge base id text box to be used in View.
        /// </summary>
        [Required(ErrorMessage = "Enter knowledge base id.")]
        [MinLength(1)]
        [DataType(DataType.Text)]
        [Display(Name = "Knowledge base ID")]
        [RegularExpression(@"(\S)+", ErrorMessage = "Enter knowledge base ID which should not contain any whitespace.")]
        public string KnowledgeBaseId { get; set; }
    }
}
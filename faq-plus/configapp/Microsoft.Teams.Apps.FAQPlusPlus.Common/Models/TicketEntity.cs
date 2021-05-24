// <copyright file="TicketEntity.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>
namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using Microsoft.Azure.Search;
    using Microsoft.WindowsAzure.Storage.Table;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents Ticket entity used for storage and retrieval.
    /// </summary>
    public class TicketEntity : TableEntity
    {
        /// <summary>
        /// Gets or sets the unique ticket id.
        /// </summary>
        [Key]
        [JsonProperty("TicketId")]
        public string TicketId { get; set; }

        /// <summary>
        /// Gets or sets status of the ticket.
        /// </summary>
        [IsSortable]
        [IsFilterable]
        [JsonProperty("Status")]
        public int Status { get; set; }

        /// <summary>
        /// Gets or sets the ticket title.
        /// </summary>
        [IsSearchable]
        [JsonProperty("Title")]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the ticket description.
        /// </summary>
        [JsonProperty("Description")]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the created date of ticket.
        /// </summary>
        [IsSortable]
        [JsonProperty("DateCreated")]
        public DateTime DateCreated { get; set; }

        /// <summary>
        /// Gets or sets the display name of the user that created the ticket.
        /// </summary>
        [IsSearchable]
        [JsonProperty("RequesterName")]
        public string RequesterName { get; set; }

        /// <summary>
        /// Gets or sets the user principal name (UPN) of the user that created the ticket.
        /// </summary>
        [JsonProperty("RequesterUserPrincipalName")]
        public string RequesterUserPrincipalName { get; set; }

        /// <summary>
        /// Gets or sets the given name of the user that created the ticket.
        /// </summary>
        [JsonProperty("RequesterGivenName")]
        public string RequesterGivenName { get; set; }

        /// <summary>
        /// Gets or sets the conversation id of the 1:1 chat with the user that created the ticket.
        /// </summary>
        [JsonProperty("RequesterConversationId")]
        public string RequesterConversationId { get; set; }

        /// <summary>
        /// Gets or sets the activity id of the root card in the SME channel.
        /// </summary>
        [JsonProperty("SmeCardActivityId")]
        public string SmeCardActivityId { get; set; }

        /// <summary>
        /// Gets or sets the conversation id of the thread pertaining to this ticket in the SME channel.
        /// </summary>
        [JsonProperty("SmeThreadConversationId")]
        public string SmeThreadConversationId { get; set; }

        /// <summary>
        /// Gets or sets the UTC date and time the ticket was last assigned.
        /// </summary>
        [IsSortable]
        [JsonProperty("DateAssigned")]
        public DateTime? DateAssigned { get; set; }

        /// <summary>
        /// Gets or sets the display name of the assigned SME currently working on the ticket.
        /// </summary>
        [IsSearchable]
        [IsFilterable]
        [JsonProperty("AssignedToName")]
        public string AssignedToName { get; set; }

        /// <summary>
        /// Gets or sets the AAD object id of the assigned SME currently working on the ticket.
        /// </summary>
        [JsonProperty("AssignedToObjectId")]
        public string AssignedToObjectId { get; set; }

        /// <summary>
        /// Gets or sets the UTC date and time the ticket was closed.
        /// </summary>
        [IsSortable]
        [JsonProperty("DateClosed")]
        public DateTime? DateClosed { get; set; }

        /// <summary>
        /// Gets or sets the display name of the user that last modified the ticket.
        /// </summary>
        [JsonProperty("LastModifiedByName")]
        public string LastModifiedByName { get; set; }

        /// <summary>
        /// Gets or sets the AAD object id of the user that last modified the ticket.
        /// </summary>
        [JsonProperty("LastModifiedByObjectId")]
        public string LastModifiedByObjectId { get; set; }

        /// <summary>
        /// Gets or sets the question that the user typed.
        /// </summary>
        [JsonProperty("UserQuestion")]
        public string UserQuestion { get; set; }

        /// <summary>
        /// Gets or sets the answer returned to the user from the knowledgebase.
        /// </summary>
        [JsonProperty("KnowledgeBaseAnswer")]
        public string KnowledgeBaseAnswer { get; set; }

        /// <summary>
        /// Gets timestamp from storage table.
        /// </summary>
        [IsSortable]
        [JsonProperty("Timestamp")]
        public new DateTimeOffset Timestamp => base.Timestamp;

        /// <summary>
        /// Checks whether a ticket is assigned or not.
        /// </summary>
        /// <returns>Boolean value where true represent ticket is assigned while false represent ticket is not assigned.</returns>
        public bool IsAssigned()
        {
            return !string.IsNullOrEmpty(this.AssignedToObjectId) && this.Status == (int)TicketState.Open;
        }
    }
}
// <copyright file="ChangeTicketStatusPayload.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Models
{
    using Newtonsoft.Json;

    /// <summary>
    /// Represents the data payload of Action.Submit to change the status of a ticket.
    /// </summary>
    public class ChangeTicketStatusPayload
    {
        /// <summary>
        /// Action that reopens a closed ticket.
        /// </summary>
        public const string ReopenAction = "Reopen";

        /// <summary>
        /// Action that closes a ticket.
        /// </summary>
        public const string CloseAction = "Close";

        /// <summary>
        /// Action that assigns a ticket to the person that performed the action.
        /// </summary>
        public const string AssignToSelfAction = "AssignToSelf";

        /// <summary>
        /// Gets or sets the ticket id.
        /// </summary>
        [JsonProperty("ticketId")]
        public string TicketId { get; set; }

        /// <summary>
        /// Gets or sets the action to perform on the ticket.
        /// </summary>
        [JsonProperty("action")]
        public string Action { get; set; }
    }
}
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Models
{
    /// <summary>
    /// Represents the current status of a ticket.
    /// </summary>
    public enum TicketState
    {
        /// <summary>
        /// Represents an active ticket.
        /// </summary>
        Open = 0,

        /// <summary>
        /// Represents a ticket that requires no further action.
        /// </summary>
        Closed = 1,

        /// <summary>
        /// Sentinel value.
        /// </summary>
        MaxValue = Closed,
    }
}

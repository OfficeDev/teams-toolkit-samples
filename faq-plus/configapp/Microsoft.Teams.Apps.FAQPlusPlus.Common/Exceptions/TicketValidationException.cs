// <copyright file="TicketValidationException.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Exceptions
{
    using System;

    /// <summary>
    /// Represents an error in ticket validation.
    /// </summary>
    public class TicketValidationException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="TicketValidationException"/> class.
        /// </summary>
        public TicketValidationException()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="TicketValidationException"/> class.
        /// </summary>
        /// <param name="message">The message to capture.</param>
        public TicketValidationException(string message)
            : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="TicketValidationException"/> class.
        /// </summary>
        /// <param name="message">The message to capture/throw.</param>
        /// <param name="inner">The inner exception.</param>
        public TicketValidationException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
// <copyright file="ActivityEntity.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Models
{
    using Microsoft.WindowsAzure.Storage.Table;

    /// <summary>
    /// Activity entity to store activity id and guid for mapping purpose.
    /// </summary>
    public class ActivityEntity : TableEntity
    {
        /// <summary>
        /// Activity table store partition key name.
        /// </summary>
        public const string ActivityPartitionKey = "ActivityEntity";

        /// <summary>
        /// Initializes a new instance of the <see cref="ActivityEntity"/> class.
        /// </summary>
        public ActivityEntity()
        {
            this.PartitionKey = ActivityPartitionKey;
        }

        /// <summary>
        /// Gets or sets activity id.
        /// </summary>
        public string ActivityId { get; set; }

        /// <summary>
        /// Gets or sets the activity reference id.
        /// </summary>
        public string ActivityReferenceId
        {
            get { return this.RowKey; }
            set { this.RowKey = value; }
        }
    }
}

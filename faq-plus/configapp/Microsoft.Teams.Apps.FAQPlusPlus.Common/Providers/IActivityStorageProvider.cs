// <copyright file="IActivityStorageProvider.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Common.Providers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Teams.Apps.FAQPlusPlus.Common.Models;

    /// <summary>
    /// IActivityStorageProvider interface.
    /// </summary>
    public interface IActivityStorageProvider
    {
        /// <summary>
        /// Add the activity entity object in table storage.
        /// </summary>
        /// <param name="activity">Activity table entity.</param>
        /// <returns>A <see cref="Task"/> of type bool where true represents activity entity object is added in table storage successfully while false indicates failure in saving data.</returns>
        Task<bool> AddActivityEntityAsync(ActivityEntity activity);

        /// <summary>
        /// Get activity ids.
        /// </summary>
        /// <param name="activityReferenceId">Unique GUID referencing to activity id.</param>
        /// <returns>Activity data.</returns>
        Task<IList<ActivityEntity>> GetAsync(string activityReferenceId);

        /// <summary>
        /// Get all activity ids.
        /// </summary>
        /// <returns>List of activity ids.</returns>
        Task<IEnumerable<ActivityEntity>> GetActivityEntitiesAsync();

        /// <summary>
        /// This method delete the activity record from table.
        /// </summary>
        /// <param name="activity">Activity table entity.</param>
        /// <returns>A <see cref="Task"/> of type bool where true represents activity record is successfully deleted from table while false indicates failure in deleting data.</returns>
        Task<bool> DeleteActivityEntityAsync(ActivityEntity activity);
    }
}

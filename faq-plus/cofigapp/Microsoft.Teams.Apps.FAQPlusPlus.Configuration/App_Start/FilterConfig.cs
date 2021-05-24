// <copyright file="FilterConfig.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Configuration
{
    using System.Web.Mvc;

    /// <summary>
    /// Filter config for Task Module app.
    /// </summary>
    public static class FilterConfig
    {
        /// <summary>
        /// Register Global Filters.
        /// </summary>
        /// <param name="filters">Collection of global filters.</param>
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters?.Add(new ErrorHandler.AiHandleErrorAttribute());
        }
    }
}

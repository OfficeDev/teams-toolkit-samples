// <copyright file="BundleConfig.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Configuration
{
    using System.Web.Optimization;

    /// <summary>
    /// Bundle config for Task Module app.
    /// </summary>
    public static class BundleConfig
    {
        /// <summary>
        /// Register the bundles.
        /// </summary>
        /// <param name="bundles">Collection of bundles.</param>
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/lib/jquery/jquery.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/lib/jquery-validate/jquery.validate.min.js",
                        "~/lib/jquery-validation-unobtrusive/jquery.validate.unobtrusive.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryajaxunobtrusive").Include(
                        "~/lib/jquery-ajax-unobtrusive/dist/jquery.unobtrusive-ajax.min.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/lib/modernizr/modernizr.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/lib/bootstrap/dist/js/bootstrap.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/lib/bootstrap/dist/css/bootstrap.min.css",
                      "~/Content/customizableStyle.css",
                      "~/Content/spinner.css"));
        }
    }
}

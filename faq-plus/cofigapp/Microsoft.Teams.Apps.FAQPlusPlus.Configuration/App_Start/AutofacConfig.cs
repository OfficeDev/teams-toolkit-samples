// <copyright file="AutofacConfig.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Configuration
{
    using System.Configuration;
    using System.Reflection;
    using System.Web.Mvc;
    using Autofac;
    using Autofac.Integration.Mvc;
    using Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker;
    using Microsoft.Teams.Apps.FAQPlusPlus.Common.Providers;

    /// <summary>
    /// Autofac configuration.
    /// </summary>
    public static class AutofacConfig
    {
        /// <summary>
        /// Register Autofac dependencies.
        /// </summary>
        /// <returns>Autofac container.</returns>
        public static IContainer RegisterDependencies()
        {
            var builder = new ContainerBuilder();
            builder.RegisterControllers(Assembly.GetExecutingAssembly());

            builder.Register(c => new ConfigurationDataProvider(
                 ConfigurationManager.AppSettings["StorageConnectionString"]))
                .As<IConfigurationDataProvider>()
                .SingleInstance();

            var qnaMakerClient = new QnAMakerClient(
                new ApiKeyServiceClientCredentials(
                ConfigurationManager.AppSettings["QnAMakerSubscriptionKey"]))
                { Endpoint = StripRouteFromQnAMakerEndpoint(ConfigurationManager.AppSettings["QnAMakerApiEndpointUrl"]) };

            builder.Register(c => qnaMakerClient)
                .As<IQnAMakerClient>()
                .SingleInstance();

            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            return container;
        }

        // Strip the route suffix from the endpoint
        private static string StripRouteFromQnAMakerEndpoint(string endpoint)
        {
            const string apiRoute = "/qnamaker/v4.0";

            if (endpoint.EndsWith(apiRoute, System.StringComparison.OrdinalIgnoreCase))
            {
                endpoint = endpoint.Substring(0, endpoint.Length - apiRoute.Length);
            }

            return endpoint;
        }
    }
}
// <copyright file="Startup.Auth.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.FAQPlusPlus.Configuration
{
    using System;
    using System.Configuration;
    using System.IdentityModel.Claims;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Helpers;
    using global::Owin;
    using Microsoft.IdentityModel.Protocols.OpenIdConnect;
    using Microsoft.Owin.Security;
    using Microsoft.Owin.Security.Cookies;
    using Microsoft.Owin.Security.OpenIdConnect;

    /// <summary>
    /// Startup file.
    /// </summary>
    public partial class Startup
    {
        /// <summary>
        /// Client id of the application.
        /// </summary>
        private static string clientId = ConfigurationManager.AppSettings["ida:ClientId"];

        /// <summary>
        /// Aad instance.
        /// </summary>
        private static string aadInstance = EnsureTrailingSlash(ConfigurationManager.AppSettings["ida:AADInstance"]);

        /// <summary>
        /// Tenant id of the application.
        /// </summary>
        private static string tenantId = ConfigurationManager.AppSettings["ida:TenantId"];

        /// <summary>
        /// Post logout redirect url.
        /// </summary>
        private static string postLogoutRedirectUri = ConfigurationManager.AppSettings["ida:PostLogoutRedirectUri"];

        /// <summary>
        /// Authority for the aad validation.
        /// </summary>
        private static string authority = aadInstance + tenantId;

        /// <summary>
        /// Configure Authentication to authenticate the user.
        /// </summary>
        /// <param name="app">Initializes a new instance of the type app builder.</param>
        /// <param name="container">dependency injection container.</param>
        public void ConfigureAuth(IAppBuilder app, Autofac.IContainer container)
        {
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
            app.UseCookieAuthentication(new CookieAuthenticationOptions());

            var validUpns = ConfigurationManager.AppSettings["ValidUpns"]
              ?.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries)
              ?.Select(s => s.Trim())
              ?? Array.Empty<string>();

            app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions("AppLogin")
            {
                ClientId = clientId,
                Authority = authority,
                PostLogoutRedirectUri = postLogoutRedirectUri,
                Notifications = new OpenIdConnectAuthenticationNotifications()
                {
                    SecurityTokenValidated = (context) =>
                    {
                        var upnClaim = context?.AuthenticationTicket?.Identity?.Claims?
                            .FirstOrDefault(c => c.Type == ClaimTypes.Upn);
                        var upn = upnClaim?.Value;

                        if (string.IsNullOrWhiteSpace(upn)
                            || !validUpns.Contains(upn, StringComparer.OrdinalIgnoreCase))
                        {
                            context.OwinContext.Response.Redirect("/Account/InvalidUser");
                            context.HandleResponse();
                        }

                        return Task.CompletedTask;
                    },
                    RedirectToIdentityProvider = (context) =>
                    {
                        if (context.ProtocolMessage.RequestType == OpenIdConnectRequestType.Authentication)
                        {
                            context.ProtocolMessage.Prompt = OpenIdConnectPrompt.Login;
                        }

                        return Task.CompletedTask;
                    },
                },
            });
            AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.Upn;
        }

        /// <summary>
        /// Verify the trailing slash.
        /// </summary>
        /// <param name="value">AAD instance value.</param>
        /// <returns>AAD instance value with slash if not exist.</returns>
        private static string EnsureTrailingSlash(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                value = string.Empty;
            }

            if (!value.EndsWith("/", StringComparison.Ordinal))
            {
                return value + "/";
            }

            return value;
        }
    }
}
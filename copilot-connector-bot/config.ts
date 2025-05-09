const config = {
  MicrosoftAppId: process.env.BOT_ID,
  MicrosoftAppType: process.env.BOT_TYPE,
  MicrosoftAppTenantId: process.env.BOT_TENANT_ID,
  MicrosoftAppPassword: process.env.BOT_PASSWORD,
  botDomain: process.env.BOT_DOMAIN,
  authorityHost: process.env.AAD_APP_OAUTH_AUTHORITY_HOST,
  clientId: process.env.AAD_APP_CLIENT_ID,
  tenantId: process.env.AAD_APP_TENANT_ID,
  clientSecret: process.env.AAD_APP_CLIENT_SECRET,
};

export default config;

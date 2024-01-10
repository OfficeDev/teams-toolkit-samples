const config = {
  teamsAppId: process.env.TEAMS_APP_ID,
  authorityHost: process.env.M365_AUTHORITY_HOST,
  tenantId: process.env.M365_TENANT_ID,
  clientId: process.env.M365_CLIENT_ID,
  clientSecret: process.env.M365_CLIENT_SECRET,
  oaiEndpoint: process.env.OAI_ENDPOINT,
  oaiDeploymentName: process.env.OAI_DEPLOYMENT_NAME,
  oaiApiKey: process.env.OAI_API_KEY,
  chatCompletionUrl: process.env.OAI_CHAT_COMPLETION_URL,
  sqlUser: process.env.SQL_USER,
  sqlPassword: process.env.SQL_PASSWORD,
  sqlServer: process.env.SQL_SERVER,
  sqlDatabase: process.env.SQL_DATABASE,
};

export default config;

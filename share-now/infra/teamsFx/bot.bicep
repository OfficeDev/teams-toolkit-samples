// Auto generated content, please customize files under provision folder

@secure()
param provisionParameters object
param provisionOutputs object
@secure()
param currentAppSettings object

var botWebAppName = split(provisionOutputs.botOutput.value.botWebAppResourceId, '/')[8]
var m365ClientId = provisionParameters['m365ClientId']
var m365ClientSecret = provisionParameters['m365ClientSecret']
var m365TenantId = provisionParameters['m365TenantId']
var m365OauthAuthorityHost = provisionParameters['m365OauthAuthorityHost']
var administratorLogin = contains(provisionParameters, 'azureSqlAdmin') ? provisionParameters['azureSqlAdmin'] : ''
var administratorLoginPassword = contains(provisionParameters, 'azureSqlAdminPassword') ? provisionParameters['azureSqlAdminPassword'] : ''
var botAadAppClientId = provisionParameters['botAadAppClientId']
var botAadAppClientSecret = provisionParameters['botAadAppClientSecret']

var botId = provisionParameters['botAadAppClientId']

var m365ApplicationIdUri = 'api://${provisionOutputs.frontendHostingOutput.value.domain}/${m365ClientId}'

resource botWebAppSettings 'Microsoft.Web/sites/config@2021-02-01' = {
  name: '${botWebAppName}/appsettings'
  properties: union({
    INITIATE_LOGIN_ENDPOINT: uri(provisionOutputs.botOutput.value.siteEndpoint, 'auth-start.html')
    M365_AUTHORITY_HOST: m365OauthAuthorityHost
    M365_CLIENT_ID: m365ClientId
    M365_CLIENT_SECRET: m365ClientSecret
    M365_TENANT_ID: m365TenantId
    M365_APPLICATION_ID_URI: m365ApplicationIdUri
    BOT_ID: botAadAppClientId
    BOT_PASSWORD: botAadAppClientSecret
    API_ENDPOINT: provisionOutputs.functionOutput.value.functionEndpoint
    SQL_DATABASE_NAME: provisionOutputs.azureSqlOutput.value.databaseName
    SQL_ENDPOINT: provisionOutputs.azureSqlOutput.value.sqlEndpoint
    SQL_USER_NAME: administratorLogin
    SQL_PASSWORD: administratorLoginPassword
    IDENTITY_ID: provisionOutputs.identityOutput.value.identityClientId
  }, currentAppSettings)
}

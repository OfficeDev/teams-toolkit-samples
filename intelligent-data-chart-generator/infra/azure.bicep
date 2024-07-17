@maxLength(20)
@minLength(4)
param resourceBaseName string
param staticWebAppSku string
param functionAppSKU string
param aadAppClientId string
param aadAppTenantId string
param aadAppOauthAuthorityHost string
param staticWebAppName string = resourceBaseName
param location string = resourceGroup().location
param serverfarmsName string = resourceBaseName
param functionAppName string = resourceBaseName
param teamsAppId string
param openAIChatCompletionUrl string
param sqlUser string
param sqlServer string
param sqlDatabase string

@secure()
param aadAppClientSecret string
@secure()
param openAIEndpoint string
@secure()
param openAIDeploymentName string
@secure()
param openAIApiKey string
@secure()
param sqlPassword string


var oauthAuthority = uri(aadAppOauthAuthorityHost, aadAppTenantId)

var teamsMobileOrDesktopAppClientId = '1fec8e78-bce4-4aaf-ab1b-5451cc387264'
var teamsWebAppClientId = '5e3ce6c0-2b1f-4285-8d4b-75ee78787346'
var officeWebAppClientId1 = '4345a7b9-9a63-4910-a426-35363201d503'
var officeWebAppClientId2 = '4765445b-32c6-49b0-83e6-1d93765276ca'
var outlookDesktopAppClientId = 'd3590ed6-52b3-4102-aeff-aad2292ab01c'
var outlookWebAppClientId = '00000002-0000-0ff1-ce00-000000000000'
var authorizedClientApplicationIds = '${teamsMobileOrDesktopAppClientId};${teamsWebAppClientId};${officeWebAppClientId1};${officeWebAppClientId2};${outlookDesktopAppClientId};${outlookWebAppClientId}'
var allowedClientApplications = '"${teamsMobileOrDesktopAppClientId}","${teamsWebAppClientId}","${officeWebAppClientId1}","${officeWebAppClientId2}","${outlookDesktopAppClientId}","${outlookWebAppClientId}"'

// Azure Static Web Apps that hosts your static web site
resource swa 'Microsoft.Web/staticSites@2022-09-01' = {
  name: staticWebAppName
  // SWA do not need location setting
  location: 'centralus'
  sku: {
    name: staticWebAppSku
    tier: staticWebAppSku
  }
  properties: {}
}

var siteDomain = swa.properties.defaultHostname
var tabEndpoint = 'https://${siteDomain}'
var aadApplicationIdUri = 'api://${siteDomain}/${aadAppClientId}'

// Compute resources for Azure Functions
resource serverfarms 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: serverfarmsName
  location: location
  sku: {
    name: functionAppSKU // You can follow https://aka.ms/teamsfx-bicep-add-param-tutorial to add functionServerfarmsSku property to provisionParameters to override the default value "Y1".
  }
  properties: {}
}

// Azure Functions that hosts your function code
resource functionApp 'Microsoft.Web/sites@2021-02-01' = {
  name: functionAppName
  kind: 'functionapp'
  location: location
  properties: {
    serverFarmId: serverfarms.id
    httpsOnly: true
    siteConfig: {
      alwaysOn: true
      cors: {
        allowedOrigins: [ tabEndpoint ]
      }
      appSettings: [
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4' // Use Azure Functions runtime v4
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node' // Set runtime to NodeJS
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1' // Run Azure Functions from a package file
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~18' // Set NodeJS version to 18.x
        }
        {
          name: 'ALLOWED_APP_IDS'
          value: authorizedClientApplicationIds
        }
        {
          name: 'M365_CLIENT_ID'
          value: aadAppClientId
        }
        {
          name: 'M365_CLIENT_SECRET'
          value: aadAppClientSecret
        }
        {
          name: 'M365_TENANT_ID'
          value: aadAppTenantId
        }
        {
          name: 'M365_AUTHORITY_HOST'
          value: aadAppOauthAuthorityHost
        }
        {
          name: 'M365_APPLICATION_ID_URI'
          value: aadApplicationIdUri
        }
        {
          name: 'TEAMS_APP_ID'
          value: teamsAppId
        }
        {
          name: 'WEBSITE_AUTH_AAD_ACL'
          value: '{"allowed_client_applications": [${allowedClientApplications}]}'
        }
        {
          name: 'OPENAI_ENDPOINT'
          value: openAIEndpoint
        }
        {
          name: 'OPENAI_DEPLOYMENT_NAME'
          value: openAIDeploymentName
        }
        {
          name: 'OPENAI_API_KEY'
          value: openAIApiKey
        }
        {
          name: 'OPENAI_CHAT_COMPLETION_URL'
          value: openAIChatCompletionUrl
        }
        {
          name: 'SQL_USER'
          value: sqlUser
        }
        {
          name: 'SQL_PASSWORD'
          value: sqlPassword
        }
        {
          name: 'SQL_SERVER'
          value: sqlServer
        }
        {
          name: 'SQL_DATABASE'
          value: sqlDatabase
        }
      ]
      ftpsState: 'FtpsOnly'
    }
  }
}
var apiEndpoint = 'https://${functionApp.properties.defaultHostName}'

resource authSettings 'Microsoft.Web/sites/config@2021-02-01' = {
  name: '${functionApp.name}/authsettings'
  properties: {
    enabled: true
    defaultProvider: 'AzureActiveDirectory'
    clientId: aadAppClientId
    issuer: '${oauthAuthority}/v2.0'
    allowedAudiences: [
      aadAppClientId
      aadApplicationIdUri
    ]
  }
}

// The output will be persisted in .env.{envName}. Visit https://aka.ms/teamsfx-actions/arm-deploy for more details.
output AZURE_STATIC_WEB_APPS_RESOURCE_ID string = swa.id
output TAB_DOMAIN string = siteDomain
output TAB_ENDPOINT string = tabEndpoint
output API_FUNCTION_ENDPOINT string = apiEndpoint
output API_FUNCTION_RESOURCE_ID string = functionApp.id

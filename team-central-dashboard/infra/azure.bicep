@maxLength(20)
@minLength(4)
param resourceBaseName string
param storageSku string
param functionStorageSKU string
param functionAppSKU string

param aadAppClientId string
param aadAppTenantId string
param aadAppOauthAuthorityHost string
@secure()
param aadAppClientSecret string

param storageName string = resourceBaseName
param location string = resourceGroup().location
param serverfarmsName string = resourceBaseName
param functionAppName string = resourceBaseName
param functionStorageName string = '${resourceBaseName}api'
param teamsAppId string
param allowedAppIds string
var oauthAuthority = uri(aadAppOauthAuthorityHost, aadAppTenantId)

// Azure Storage that hosts your static web site
resource storage 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  kind: 'StorageV2'
  location: location
  name: storageName
  properties: {
    supportsHttpsTrafficOnly: true
  }
  sku: {
    name: storageSku
  }
}

var siteDomain = replace(replace(storage.properties.primaryEndpoints.web, 'https://', ''), '/', '')
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
          name: ' AzureWebJobsDashboard'
          value: 'DefaultEndpointsProtocol=https;AccountName=${functionStorage.name};AccountKey=${listKeys(functionStorage.id, functionStorage.apiVersion).keys[0].value};EndpointSuffix=${environment().suffixes.storage}' // Azure Functions internal setting
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${functionStorage.name};AccountKey=${listKeys(functionStorage.id, functionStorage.apiVersion).keys[0].value};EndpointSuffix=${environment().suffixes.storage}' // Azure Functions internal setting
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4' // Use Azure Functions runtime v4
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node' // Set runtime to NodeJS
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storage.name};AccountKey=${listKeys(storage.id, storage.apiVersion).keys[0].value};EndpointSuffix=${environment().suffixes.storage}' // Azure Functions internal setting
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1' // Run Azure Functions from a package file
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~16' // Set NodeJS version to 16.x
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
          name: 'ALLOWED_APP_IDS'
          value: allowedAppIds
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

// Azure Storage is required when creating Azure Functions instance
resource functionStorage 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: functionStorageName
  kind: 'StorageV2'
  location: location
  sku: {
    name: functionStorageSKU// You can follow https://aka.ms/teamsfx-bicep-add-param-tutorial to add functionStorageSKUproperty to provisionParameters to override the default value "Standard_LRS".
  }
}

// The output will be persisted in .env.{envName}. Visit https://aka.ms/teamsfx-actions/arm-deploy for more details.
output TAB_AZURE_STORAGE_RESOURCE_ID string = storage.id // used in deploy stage
output TAB_DOMAIN string = siteDomain
output TAB_ENDPOINT string = tabEndpoint
output API_FUNCTION_ENDPOINT string = apiEndpoint
output API_FUNCTION_RESOURCE_ID string = functionApp.id

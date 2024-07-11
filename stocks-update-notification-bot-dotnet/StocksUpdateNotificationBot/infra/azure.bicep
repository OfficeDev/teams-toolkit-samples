@maxLength(20)
@minLength(4)
@description('Used to generate names for all resources in this file')
param resourceBaseName string

@description('Required when create Azure Bot service')
param botAadAppClientId string

@secure()
@description('Required by Bot Framework package in your bot project')
param botAadAppClientSecret string

param functionAppSKU string

@maxLength(42)
param botDisplayName string

param serverfarmsName string = resourceBaseName
param functionAppName string = resourceBaseName
param location string = resourceGroup().location

// Compute resources for your Web App
resource serverfarm 'Microsoft.Web/serverfarms@2021-02-01' = {
  kind: 'functionapp'
  location: location
  name: serverfarmsName
  sku: {
    name: functionAppSKU
  }
  properties: {}
}

// Azure Function that host your app
resource functionApp 'Microsoft.Web/sites@2021-02-01' = {
  kind: 'functionapp'
  location: location
  name: functionAppName
  properties: {
    serverFarmId: serverfarm.id
    httpsOnly: true
    siteConfig: {
      alwaysOn: true
      appSettings: [
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4' // Use Azure Function runtime v4
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet' // Set runtime to .NET
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1' // Run Azure Function from a package file
        }
        {
          name: 'RUNNING_ON_AZURE'
          value: '1'
        }
        {
          name: 'SCM_ZIPDEPLOY_DONOT_PRESERVE_FILETIME'
          value: '1' // Zipdeploy files will always be updated. Detail: https://aka.ms/teamsfx-zipdeploy-donot-preserve-filetime
        }
        {
          name: 'BOT_ID'
          value: botAadAppClientId
        }
        {
          name: 'BOT_PASSWORD'
          value: botAadAppClientSecret
        }
      ]
      ftpsState: 'FtpsOnly'
    }
  }
}

// Register your web service as a bot with the Bot Framework
module azureBotRegistration './botRegistration/azurebot.bicep' = {
  name: 'Azure-Bot-registration'
  params: {
    resourceBaseName: resourceBaseName
    botAadAppClientId: botAadAppClientId
    botAppDomain: functionApp.properties.defaultHostName
    botDisplayName: botDisplayName
  }
}

output BOT_DOMAIN string = functionApp.properties.defaultHostName
output BOT_AZURE_FUNCTION_APP_RESOURCE_ID string = functionApp.id
output BOT_FUNCTION_ENDPOINT string = 'https://${functionApp.properties.defaultHostName}'


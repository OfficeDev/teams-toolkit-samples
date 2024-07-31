@maxLength(20)
@minLength(4)
@description('Used to generate names for all resources in this file')
param resourceBaseName string

param functionAppSKU string
param functionAppSKUTier string
param storageSKU string
param serviceBusQueueName string
param storageTableName string

@maxLength(42)
param botDisplayName string

param serverfarmsName string = resourceBaseName
param functionAppName string = resourceBaseName
param location string = resourceGroup().location
param storageName string = resourceBaseName
param serviceBusNamespaceName string = resourceBaseName
param identityName string = resourceBaseName

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  location: location
  name: identityName
}

// Compute resources for your Web App
resource serverfarm 'Microsoft.Web/serverfarms@2021-02-01' = {
  kind: 'functionapp'
  location: location
  name: serverfarmsName
  sku: {
    name: functionAppSKU
    tier: functionAppSKUTier
  }
  properties: {}
}

resource storage 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: storageName
  kind: 'StorageV2'
  location: location
  sku: {
    name: storageSKU // You can follow https://aka.ms/teamsfx-bicep-add-param-tutorial to add functionStorageSku property to provisionParameters to override the default value "Standard_LRS".
  }
}

// Table storage or installation reference
resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2021-06-01' = {
  name: 'default'
  parent: storage
}

resource storageInstallationTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2021-06-01' = {
  name: storageTableName
  parent: tableService
}

resource storageInstallationMockTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2021-06-01' = {
  name: '${storageTableName}mock'
  parent: tableService
}

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2022-01-01-preview' = {
  name: serviceBusNamespaceName
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {}
}

// Service Bus queue for message sending
resource serviceBusQueue 'Microsoft.ServiceBus/namespaces/queues@2022-01-01-preview' = {
  parent: serviceBusNamespace
  name: serviceBusQueueName
  properties: {
    lockDuration: 'PT1M'
    maxSizeInMegabytes: 1024
    requiresDuplicateDetection: false
    requiresSession: false
    defaultMessageTimeToLive: 'P10675199DT2H48M5.4775807S'
    deadLetteringOnMessageExpiration: false
    duplicateDetectionHistoryTimeWindow: 'PT10M'
    maxDeliveryCount: 1
    autoDeleteOnIdle: 'P10675199DT2H48M5.4775807S'
    enablePartitioning: false
    enableExpress: false
  }
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
      alwaysOn: false
      appSettings: [
        {
          name: 'AzureWebJobsDashboard'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storage.name};AccountKey=${listKeys(storage.id, storage.apiVersion).keys[0].value};EndpointSuffix=${environment().suffixes.storage}' // Azure Functions internal setting
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storage.name};AccountKey=${listKeys(storage.id, storage.apiVersion).keys[0].value};EndpointSuffix=${environment().suffixes.storage}' // Azure Functions internal setting
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
          value: '~18' // Set NodeJS version to 18.x
        }
        {
          name: 'BOT_ID'
          value: identity.properties.clientId
        }
        {
          name: 'BOT_TENANT_ID'
          value: identity.properties.tenantId
        }
        {
          name: 'BOT_TYPE'
          value: 'UserAssignedMsi'
        }
        {
          name: 'SERVICE_BUS_CONNECTION_STRING'
          value: 'Endpoint=sb://${serviceBusNamespaceName}.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=${listKeys('${serviceBusNamespace.id}/AuthorizationRules/RootManageSharedAccessKey', serviceBusNamespace.apiVersion).primaryKey}'
        }
        {
          name: 'SERVICE_BUS_QUEUE_NAME'
          value: serviceBusQueue.name
        }
        {
          name: 'INSTALLATION_TABLE_NAME'
          value: storageTableName
        }
        {
          name: 'INSTALLATION_MOCK_TABLE_NAME'
          value: '${storageTableName}mock'
        }
        {
          name: 'STORAGE_ACCOUNT_NAME'
          value: storage.name
        }
        {
          name: 'STORAGE_ACCOUNT_URL'
          value: 'https://${storage.name}.table.core.windows.net'
        }
        {
          name: 'STORAGE_ACCOUNT_KEY'
          value: listKeys(storage.id, storage.apiVersion).keys[0].value
        }
        {
          name: 'RUNNING_ON_AZURE'
          value: '1'
        }
        {
          name: 'SCM_ZIPDEPLOY_DONOT_PRESERVE_FILETIME'
          value: '1' // Zipdeploy files will always be updated. Detail: https://aka.ms/teamsfx-zipdeploy-donot-preserve-filetime
        }
      ]
      ftpsState: 'FtpsOnly'
    }
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identity.id}': {}
    }
  }
}

// Register your web service as a bot with the Bot Framework
module azureBotRegistration './botRegistration/azurebot.bicep' = {
  name: 'Azure-Bot-registration'
  params: {
    resourceBaseName: resourceBaseName
    identityClientId: identity.properties.clientId
    identityResourceId: identity.id
    identityTenantId: identity.properties.tenantId
    botAppDomain: functionApp.properties.defaultHostName
    botDisplayName: botDisplayName
  }
}

output BOT_DOMAIN string = functionApp.properties.defaultHostName
output BOT_AZURE_FUNCTION_APP_RESOURCE_ID string = functionApp.id
output BOT_FUNCTION_ENDPOINT string = 'https://${functionApp.properties.defaultHostName}'
output SERVICE_BUS_ENDPOINT string = 'Endpoint=sb://${serviceBusNamespaceName}.servicebus.windows.net/'
output SECRET_SERVICE_BUS_ACCESS_KEY string = listKeys('${serviceBusNamespace.id}/AuthorizationRules/RootManageSharedAccessKey', serviceBusNamespace.apiVersion).primaryKey
output SERVICE_BUS_QUEUE_NAME string = serviceBusQueue.name
output STORAGE_ACCOUNT_NAME string = storage.name
output STORAGE_ACCOUNT_URL string = 'https://${storage.name}.table.core.windows.net'
output SECRET_STORAGE_ACCOUNT_KEY string = listKeys(storage.id, storage.apiVersion).keys[0].value
output INSTALLATION_TABLE_NAME string = storageTableName
output INSTALLATION_MOCK_TABLE_NAME string = '${storageTableName}mock'
output BOT_ID string = identity.properties.clientId
output BOT_TENANT_ID string = identity.properties.tenantId

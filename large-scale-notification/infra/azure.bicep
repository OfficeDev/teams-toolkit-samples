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

// https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles
var StorageBlobDataOwner = 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b'
var StorageQueueDataContributor = '974c5e8b-45b9-4653-ba55-5f855dd0fb88'
var StorageTableDataContributor = '0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3'
var AzureServiceBusDataOwner = '090c5cfd-751d-490a-894a-3ce6f1109419'

resource storageBlobRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid('${resourceBaseName}-${uniqueString('StorageBlobRoleAssignment')}')
  scope: storage
  properties: {
    principalId: functionApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', StorageBlobDataOwner)
  }
}

resource storageQueueRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid('${resourceBaseName}-${uniqueString('StorageQueueRoleAssignment')}')
  scope: storage
  properties: {
    principalId: functionApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', StorageQueueDataContributor)
  }
}

resource storageTableRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid('${resourceBaseName}-${uniqueString('StorageTableRoleAssignment')}')
  scope: storage
  properties: {
    principalId: functionApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', StorageTableDataContributor)
  }
}

resource storageTableUserRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid('${resourceBaseName}-${uniqueString('StorageTableUserRoleAssignment')}')
  scope: storage
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', StorageTableDataContributor)
  }
}

resource azureServiceBusRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid('${resourceBaseName}-${uniqueString('AzureServiceBusRoleAssignment')}')
  scope: serviceBusNamespace
  properties: {
    principalId: functionApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', AzureServiceBusDataOwner)
  }
}

resource azureServiceBusUserRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid('${resourceBaseName}-${uniqueString('AzureServiceBusUserRoleAssignment')}')
  scope: serviceBusNamespace
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', AzureServiceBusDataOwner)
  }
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
  properties: {
    allowSharedKeyAccess: false // Disable Shared Key Access
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
  properties: {
    disableLocalAuth: true
  }
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
          name: 'AzureWebJobsStorage__accountName'
          value: storageName
        }
        {
          name: 'ServiceBusConnection__fullyQualifiedNamespace'
          value: '${serviceBusNamespaceName}.servicebus.windows.net'
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
          name: 'SERVICE_BUS_NAMESPACE'
          value: serviceBusNamespaceName
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
          name: 'RUNNING_ON_AZURE'
          value: '1'
        }
        {
          name: 'SCM_ZIPDEPLOY_DONOT_PRESERVE_FILETIME'
          value: '1' // Zipdeploy files will always be updated. Detail: https://aka.ms/teamsfx-zipdeploy-donot-preserve-filetime
        }
        {
          name: 'MANAGED_IDENTITY_ID'
          value: identity.properties.clientId
        }
      ]
      ftpsState: 'FtpsOnly'
    }
  }
  identity: {
    type: 'SystemAssigned, UserAssigned'
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
output SERVICE_BUS_NAMESPACE string = serviceBusNamespaceName
output SERVICE_BUS_QUEUE_NAME string = serviceBusQueue.name
output STORAGE_ACCOUNT_NAME string = storage.name
output INSTALLATION_TABLE_NAME string = storageTableName
output INSTALLATION_MOCK_TABLE_NAME string = '${storageTableName}mock'
output MANAGED_IDENTITY_ID string = identity.properties.clientId
output BOT_ID string = identity.properties.clientId
output BOT_TENANT_ID string = identity.properties.tenantId

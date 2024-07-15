@secure()
param provisionParameters object
param userAssignedIdentityId string

var resourceBaseName = provisionParameters.resourceBaseName
var serverfarmsName = contains(provisionParameters, 'functionServerfarmsName') ? provisionParameters['functionServerfarmsName'] : '${resourceBaseName}api' // Try to read name for App Service Plan from parameters
var serverfarmsSku = contains(provisionParameters, 'functionServerfarmsSku') ? provisionParameters['functionServerfarmsSku'] : 'Y1' // Try to read SKU for App Service Plan from parameters
var functionAppName = contains(provisionParameters, 'functionWebappName') ? provisionParameters['functionWebappName'] : '${resourceBaseName}api' // Try to read name for Azure Functions from parameters

// Compute resources for Azure Functions
resource serverfarms 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: serverfarmsName
  kind: 'functionapp'
  location: resourceGroup().location
  sku: {
    name: serverfarmsSku // You can follow https://aka.ms/teamsfx-bicep-add-param-tutorial to add functionServerfarmsSku property to provisionParameters to override the default value "Y1".
  }
  properties: {}
}

// Azure Functions that hosts your function code
resource functionApp 'Microsoft.Web/sites@2021-02-01' = {
  name: functionAppName
  kind: 'functionapp'
  location: resourceGroup().location
  properties: {
    serverFarmId: serverfarms.id
    keyVaultReferenceIdentity: userAssignedIdentityId // Use given user assigned identity to access Key Vault
    httpsOnly: true
    siteConfig: {
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
      ]
      ftpsState: 'FtpsOnly'
    }
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentityId}': {} // The identity is used to access other Azure resources
    }
  }
}

output functionEndpoint string = 'https://${functionApp.properties.defaultHostName}'
output functionAppResourceId string = functionApp.id

@maxLength(20)
@minLength(4)
@description('Used to generate names for all resources in this file')
param resourceBaseName string

param location string = resourceGroup().location

@description('SKU for the Content Safety service')
@allowed([
  'F0'  // Free tier
  'S0'  // Standard tier
])
param contentSafetySku string = 'S0'

@description('Tags to apply to the resource')
param tags object = {}

// Content Safety service
resource contentSafety 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: 'cs-${resourceBaseName}'
  location: location
  kind: 'ContentSafety'
  tags: union(tags, {
    'azd-service-name': 'content-safety'
  })
  
  identity: {
    type: 'SystemAssigned'
  }
  
  sku: {
    name: contentSafetySku
  }
  
  properties: {
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: false
  }
}

// Get the existing APIM service to configure backend
resource apimService 'Microsoft.ApiManagement/service@2024-05-01' existing = {
  name: 'apim-${resourceBaseName}'
}

// Create Content Safety backend in APIM
resource contentSafetyBackend 'Microsoft.ApiManagement/service/backends@2024-05-01' = {
  name: 'content-safety-backend'
  parent: apimService
  properties: {
    description: 'Azure Content Safety backend for content moderation'
    url: contentSafety.properties.endpoint
    protocol: 'http'
    credentials: {
      header: {
        'Ocp-Apim-Subscription-Key': [
          contentSafety.listKeys().key1
        ]
      }
    }
  }
}

// // Example of what's missing - role assignment for managed identity
// resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
//   name: guid(apimService.id, contentSafety.id, 'Cognitive Services User')
//   scope: contentSafety
//   properties: {
//     roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'a97b65f3-24c7-4388-baec-2e87135dc908') // Cognitive Services User
//     principalId: apimService.identity.principalId
//     principalType: 'ServicePrincipal'
//   }
// }

// Output the details needed for integration
@description('The resource ID of the Content Safety service')
output contentSafetyId string = contentSafety.id

@description('The name of the Content Safety service')
output contentSafetyName string = contentSafety.name

@description('The endpoint URL of the Content Safety service')
output contentSafetyEndpoint string = contentSafety.properties.endpoint

@description('The backend ID for APIM integration')
output contentSafetyBackendId string = contentSafetyBackend.name

@description('The principal ID of the managed identity')
output contentSafetyPrincipalId string = contentSafety.identity.principalId

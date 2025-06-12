@maxLength(20)
@minLength(4)
@description('Used to generate names for all resources in this file')
param resourceBaseName string

param location string = resourceGroup().location

param aiServicesSku string = 'S0'

param aiServicesSkuTier string = 'Standard'

@description('Tags to apply to the resource')
param tags object = {}

// AIServices cognitive service
resource aiService 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: 'ai-${resourceBaseName}-${location}'
  location: location
  sku: {
    name: aiServicesSku
    tier: aiServicesSkuTier
  }
  kind: 'AIServices'
  tags: union(tags, {
    'azd-service-name': 'ai-services'
  })
  
  identity: {
    type: 'SystemAssigned'
  }
  
  properties: {
    publicNetworkAccess: 'Enabled'
    customSubDomainName: toLower('ai-${resourceBaseName}-${location}')
    disableLocalAuth: false
  }
}

// Deploy OpenAI models within the AIServices account
resource openaiDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  name: 'gpt-4o-deployment'
  parent: aiService
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4o'
      version: '2024-11-20'
    }
  }
  sku: {
    name: 'Standard'
    capacity: 10
  }
}

resource embeddingModelDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  name: 'text-embedding-ada-002'
  parent: aiService
  properties: {
    model: {
      format: 'OpenAI'
      name: 'text-embedding-ada-002'
      version: '2'
    } 
  }
  sku: {
    name: 'Standard'
    capacity: 10
  }
  dependsOn: [
    openaiDeployment  // Ensure GPT deployment completes first
  ]
}

// Outputs
@description('The resource ID of the AIServices account')
output aiServiceId string = aiService.id

@description('The name of the AIServices account')
output aiServiceName string = aiService.name

#disable-next-line outputs-should-not-contain-secrets
@description('The API key for the AIServices account')
#disable-next-line outputs-should-not-contain-secrets
output aiServiceApiKey string = aiService.listKeys().key1

@description('The endpoint URL of the AIServices account')
output aiServiceEndpoint string = aiService.properties.endpoint

@description('The primary deployment name for OpenAI models')
output aiServiceDeploymentName string = openaiDeployment.name

@description('The embedding deployment name')
output embeddingDeploymentName string = embeddingModelDeployment.name

@description('The principal ID of the managed identity')
output aiServicePrincipalId string = aiService.identity.principalId

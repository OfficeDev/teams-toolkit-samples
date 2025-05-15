@maxLength(20)
@minLength(4)
@description('Used to generate names for all resources in this file')
param resourceBaseName string

param location string = resourceGroup().location

param openAISku string = 'S0'

param openAISkuTier string = 'Standard'

resource cognitiveService 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: 'cog-${resourceBaseName}-${location}'
  location: location
  sku: {
    name: openAISku
    tier: openAISkuTier
  }
  kind: 'OpenAI'  
  properties: {
    apiProperties: {
      statisticsEnabled: false
    }
    publicNetworkAccess: 'Enabled'
    customSubDomainName: toLower('cog-${resourceBaseName}-${location}')
  }
}

resource openaiDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01'  =  {
  name: 'openaideploy'
  parent: cognitiveService
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
  dependsOn: [
    cognitiveService
  ]
}

resource embeddingModelDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01'  =  {
  name: 'text-embedding-ada-002'
  parent: cognitiveService
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
    cognitiveService
    openaiDeployment
  ]
}

#disable-next-line outputs-should-not-contain-secrets
output azureOpenAIApiKey string = listKeys(cognitiveService.id, '2022-10-01').key1
#disable-next-line outputs-should-not-contain-secrets
output azureOpenAIEndpoint string = cognitiveService.properties.endpoint
output azureDeploymentName string = openaiDeployment.name

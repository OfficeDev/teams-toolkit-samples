@maxLength(20)
@minLength(4)
@description('Used to generate names for all resources in this file')
param resourceBaseName string

param location string = resourceGroup().location

param openAISku string = 'S0'

param openAISkuTier string = 'Standard'

resource cognitiveService 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
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

resource openaideployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01'  =  {
  name: 'openaideploy'
  parent: cognitiveService
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-35-turbo'
      version: '0613'
    }
  }
  sku: {
      name: 'GlobalStandard'
      capacity: 10
  }
}

#disable-next-line outputs-should-not-contain-secrets
output azureOpenAIApiKey string = listKeys(cognitiveService.id, '2022-10-01').key1
#disable-next-line outputs-should-not-contain-secrets
output azureOpenAIEndpoint string = listKeys(cognitiveService.id, '2022-10-01').endpoint

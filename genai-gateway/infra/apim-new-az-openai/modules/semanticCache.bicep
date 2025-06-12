// semantic-caching: additions BEGIN
param resourceBaseName string
param location string

@secure()
param azureOpenAIKey string

param azureOpenAIEndpoint string

param embeddingsDeploymentName string

var redisPort = 10000

resource redisEnterprise 'Microsoft.Cache/redisEnterprise@2022-01-01' = {
  name: 'redis-${resourceBaseName}'
  location: location
  sku: {
    name: 'Enterprise_E5'
    capacity: 2
  }
}

resource redisCache 'Microsoft.Cache/redisEnterprise/databases@2022-01-01' = {
  name: 'default'
  parent: redisEnterprise
  properties: {
    evictionPolicy: 'NoEviction'
    clusteringPolicy: 'EnterpriseCluster'
    modules: [
      {
        name: 'RediSearch'
      }
    ]
    port: redisPort
  }
}

resource apimService 'Microsoft.ApiManagement/service@2024-05-01' existing = {
  name: 'apim-${resourceBaseName}'
}

resource apimCache 'Microsoft.ApiManagement/service/caches@2021-12-01-preview' = {
  name: 'Default'
  parent: apimService
  properties: {
    connectionString: '${redisEnterprise.properties.hostName}:${redisPort},password=${redisCache.listKeys().primaryKey},ssl=True,abortConnect=False'
    useFromLocation: 'Default'
    description: redisEnterprise.properties.hostName
  }
}

resource backendEmbeddings 'Microsoft.ApiManagement/service/backends@2023-05-01-preview' = {
  name: 'embeddings-backend'
  parent: apimService
  properties: {
    credentials: {
      header: {
        'api-key': [azureOpenAIKey]
      }
    }
    description: 'Embeddings Backend'
    url: '${azureOpenAIEndpoint}/openai/deployments/${embeddingsDeploymentName}/embeddings'
    protocol: 'http'
  }
}

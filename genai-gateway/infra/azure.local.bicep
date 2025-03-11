@maxLength(20)
@minLength(4)
@description('Used to generate names for all resources in this file')
param resourceBaseName string

param location string = resourceGroup().location

@description('The pricing tier of this API Management service')
@allowed([
  'Developer'
  'Basic'
  'Basicv2'
  'Standard'
  'Standardv2'
  'Premium'
])
param apimSku string = 'Developer'

@description('The email address of the owner of the service')
param apimPublisherEmail string = 'noreply@microsoft.com'

@description('The name of the owner of the service')
param apimPublisherName string = 'Microsoft'

param azureOpenAIEndpoint string

@secure()
param azureOpenAIKey string

param embeddingsDeploymentName string

var redisPort = 10000

resource apimService 'Microsoft.ApiManagement/service@2024-05-01' = {
  name: 'apim-${resourceBaseName}'
  location: location
  sku: {
    name: apimSku
    capacity: 1
  }
  properties: {
    publisherEmail: apimPublisherEmail
    publisherName: apimPublisherName
  }
}

// semantic-caching: additions BEGIN

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

resource api 'Microsoft.ApiManagement/service/apis@2023-05-01-preview' = {
    name: 'AzureOpenAI'
    parent: apimService
    properties: {
      apiType: 'http'
      description: 'Azure OpenAI API inferencing API'
      displayName: 'AzureOpenAI'
      format: 'openapi-link'
      path: 'openai'
      protocols: [
        'https'
      ]
      subscriptionKeyParameterNames: {
        header: 'api-key'
        query: 'api-key'
      }
      subscriptionRequired: true
      type: 'http'
      value: 'https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-02-01/inference.json'
    }
  }

resource apiPolicy 'Microsoft.ApiManagement/service/apis/policies@2021-12-01-preview' = {
  name: 'policy'
  parent: api
  properties: {
    format: 'rawxml'
    value: loadTextContent('policy.xml')
  }
}

resource backendOpenAI 'Microsoft.ApiManagement/service/backends@2023-05-01-preview' = {
  name: 'AzureOpenAI'
  parent: apimService
  properties: {
    description: 'backend description'
    url: '${azureOpenAIEndpoint}/openai'
    protocol: 'http'
    credentials: {
      header: {
        'api-key': [azureOpenAIKey]
      }
    }
    circuitBreaker: {
      rules: [
        {
          failureCondition: {
            count: 3
            errorReasons: [
              'Server errors'
            ]
            interval: 'PT5M'
            statusCodeRanges: [
              {
                min: 429
                max: 429
              }
            ]
          }
          name: 'openAIBreakerRule'
          tripDuration: 'PT1M'
        }
      ]
    }
  }
}

resource backendPoolOpenAI 'Microsoft.ApiManagement/service/backends@2023-05-01-preview' = {
  name: 'openai-backend-pool'
  parent: apimService
  dependsOn: [backendOpenAI]
  properties: {
    description: 'Load balancer for multiple OpenAI endpoints'
    type: 'Pool'
//    protocol: 'http'  // the protocol is not needed in the Pool type
//    url: '${cognitiveServices[0].properties.endpoint}/openai'   // the url is not needed in the Pool type
    pool: {
      services: [
        {
          id: '/backends/AzureOpenAI'
        }
      ]
    }
  }
}

resource apimSubscription 'Microsoft.ApiManagement/service/subscriptions@2023-05-01-preview' = {
  name: 'openai-subscription'
  parent: apimService
  properties: {
    allowTracing: true
    displayName: 'OpenAI Subscription'
    scope: '/apis/${api.id}'
    state: 'active'
  }
}

// emit-token-metrics start
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: resourceBaseName
  location: location
  properties: {
    retentionInDays: 30
    features: {
      searchVersion: 1
    }
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: resourceBaseName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    CustomMetricsOptedInType: 'WithDimensions' // required to emit token metrics
  }
}

resource apimLogger 'Microsoft.ApiManagement/service/loggers@2021-12-01-preview' = {
  name: 'apim-logger'
  parent: apimService
  properties: {
    credentials: {
      instrumentationKey: applicationInsights.properties.InstrumentationKey
    }
    description:  'APIM Logger for OpenAI API'
    isBuffered: false
    loggerType: 'applicationInsights'
    resourceId: applicationInsights.id
  }
}

var logSettings = {
  headers: [ 'Content-type', 'User-agent', 'x-ms-region', 'x-ratelimit-remaining-tokens' , 'x-ratelimit-remaining-requests' ]
  body: { bytes: 8192 }
}

resource apiDiagnostics 'Microsoft.ApiManagement/service/apis/diagnostics@2022-08-01' = if (!empty(apimLogger.name)) {
  name: 'applicationinsights'
  parent: api
  properties: {
    alwaysLog: 'allErrors'
    httpCorrelationProtocol: 'W3C'
    logClientIp: true
    loggerId: apimLogger.id
    metrics: true // required to emit token metrics
    verbosity: 'verbose'
    sampling: {
      samplingType: 'fixed'
      percentage: 100
    }
    frontend: {
      request: logSettings
      response: logSettings
    }
    backend: {
      request: logSettings
      response: logSettings
    }
  }
}
// emit token metrics end

output AZURE_OPENAI_ENDPOINT string = apimService.properties.gatewayUrl

#disable-next-line outputs-should-not-contain-secrets
output SECRET_AZURE_OPENAI_API_KEY string = apimSubscription.listSecrets().primaryKey

param resourceBaseName string

param aiServiceEndpoint string

@secure()
param aiServiceKey string

resource apimService 'Microsoft.ApiManagement/service@2023-05-01-preview' existing = {
  name: 'apim-${resourceBaseName}'
}

// Create API for AIServices (supports OpenAI compatible endpoints)
resource api 'Microsoft.ApiManagement/service/apis@2023-05-01-preview' = {
  name: 'AIServices'
  parent: apimService
  properties: {
    apiType: 'http'
    description: 'Azure AI Services API with OpenAI compatibility'
    displayName: 'AIServices'
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
    value: loadTextContent('../policy.xml')
  }
}

// Create backend for AIServices
resource backendAIServices 'Microsoft.ApiManagement/service/backends@2023-05-01-preview' = {
  name: 'AIServices'
  parent: apimService
  properties: {
    description: 'Azure AI Services backend'
    url: '${aiServiceEndpoint}/openai'
    protocol: 'http'
    credentials: {
      header: {
        'api-key': [aiServiceKey]
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
          name: 'aiServicesBreakerRule'
          tripDuration: 'PT1M'
        }
      ]
    }
  }
}

// Create backend pool for load balancing (can add multiple AIServices endpoints here)
resource backendPoolAIServices 'Microsoft.ApiManagement/service/backends@2023-05-01-preview' = {
  name: 'aiservices-backend-pool'
  parent: apimService
  dependsOn: [backendAIServices]
  properties: {
    description: 'Load balancer for multiple AI Services endpoints'
    type: 'Pool'
    pool: {
      services: [
        {
          id: '/backends/AIServices'
        }
      ]
    }
  }
}

// Create subscription for the AI Services API
resource apimSubscription 'Microsoft.ApiManagement/service/subscriptions@2023-05-01-preview' = {
  name: 'aiservices-subscription'
  parent: apimService
  properties: {
    allowTracing: true
    displayName: 'AI Services Subscription'
    scope: '/apis/${api.id}'
    state: 'active'
  }
}

#disable-next-line outputs-should-not-contain-secrets
output subscriptionPrimaryKey string = apimSubscription.listSecrets().primaryKey

param resourceBaseName string

param azureOpenAIEndpoint string

@secure()
param azureOpenAIKey string

resource apimService 'Microsoft.ApiManagement/service@2023-05-01-preview' existing = {
  name: 'apim-${resourceBaseName}'
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
    value: loadTextContent('../policy.xml')
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

#disable-next-line outputs-should-not-contain-secrets
output subscriptionPrimaryKey string = apimSubscription.listSecrets().primaryKey

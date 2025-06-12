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

@description('SKU for the Content Safety service')
@allowed([
  'F0'  // Free tier
  'S0'  // Standard tier
])
param contentSafetySku string = 'S0'

@description('SKU for the AI Services')
@allowed([
  'F0'  // Free tier
  'S0'  // Standard tier
])
param aiServicesSku string = 'S0'

@description('Whether to enable Content Safety integration')
param enableContentSafety bool = true

@description('The email address of the owner of the service')
param apimPublisherEmail string = 'noreply@microsoft.com'

@description('The name of the owner of the service')
param apimPublisherName string = 'Microsoft'

param embeddingsDeploymentName string = 'text-embedding-ada-002'

module apimService './modules/apimService.bicep' = {
  name: 'Apim-Service-deployment'
  params: {
    resourceBaseName: resourceBaseName
    location: location
    apimSku: apimSku
    apimPublisherEmail: apimPublisherEmail
    apimPublisherName: apimPublisherName
  }
}

module contentSafety './modules/contentSafety.bicep' = if (enableContentSafety) {
  name: 'Content-Safety-deployment'
  params: {
    resourceBaseName: resourceBaseName
    location: location
    contentSafetySku: contentSafetySku
  }
  dependsOn: [
    apimService // Ensure APIM service exists first since contentSafety references it
  ]
}

module aiService './modules/aiService.bicep' = {
  name: 'AI-Service-deployment'
  params: {
    resourceBaseName: resourceBaseName
    location: location
    aiServicesSku: aiServicesSku
  }
}

module semanticCache './modules/semanticCache.bicep' = {
 name: 'Semantic-Cache-deployment'
 params: {
   resourceBaseName: resourceBaseName
   location: location
   azureOpenAIKey: aiService.outputs.aiServiceApiKey
   azureOpenAIEndpoint: aiService.outputs.aiServiceEndpoint
   embeddingsDeploymentName: embeddingsDeploymentName
 }
 dependsOn: [
   apimService // Ensure APIM service exists first since semanticCache references it
 ]
}

module apiBackends './modules/apiBackends.bicep' = {
  name: 'AI-Service-Backends-deployment'
  params: {
    resourceBaseName: resourceBaseName
    aiServiceKey: aiService.outputs.aiServiceApiKey
    aiServiceEndpoint: aiService.outputs.aiServiceEndpoint
  }
  dependsOn: [
    apimService // Ensure APIM service exists first since aiServiceBackends references it
  ]
}

module emitTokenMetrics './modules/emitTokenMetrics.bicep' = {
  name: 'Emit-Token-Metrics-deployment'
  params: {
    resourceBaseName: resourceBaseName
    location: location
  }
  dependsOn: [
    apimService // Ensure APIM service exists first since emitTokenMetrics references it
    apiBackends // Ensure the AIServices API is created before trying to reference it
  ]
}

output AZURE_OPENAI_ENDPOINT string = apimService.outputs.gatewayUrl

#disable-next-line outputs-should-not-contain-secrets
output SECRET_AZURE_OPENAI_API_KEY string = apiBackends.outputs.subscriptionPrimaryKey

output AZURE_OPENAI_DEPLOYMENT_NAME string = aiService.outputs.aiServiceDeploymentName

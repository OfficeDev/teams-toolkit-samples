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
/*
// module semanticCache './modules/semanticCache.bicep' = {
//  name: 'Semantic-Cache-deployment'
//  params: {
//    resourceBaseName: resourceBaseName
//    location: location
//    azureOpenAIKey: azureOpenAIKey
//    azureOpenAIEndpoint: azureOpenAIEndpoint
//    embeddingsDeploymentName: embeddingsDeploymentName
//  }
//  dependsOn: [
//    apimService // Ensure APIM service exists first since semanticCache references it
//  ]
// }
*/
module apiBackends './modules/apiBackends.bicep' = {
  name: 'Api-Backends-deployment'
  params: {
    resourceBaseName: resourceBaseName
    azureOpenAIKey: azureOpenAIKey
    azureOpenAIEndpoint: azureOpenAIEndpoint
  }
  dependsOn: [
    apimService // Ensure APIM service exists first since apiBackends references it
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
  ]
}

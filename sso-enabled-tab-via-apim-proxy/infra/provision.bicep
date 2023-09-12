param resourceBaseName string
param storageSku string
param apimServiceSku string
param publisherEmail string
param publisherName string
param aadAppClientId string
param aadAppTenantId string
param aadAppScope string
@secure()
param aadAppClientSecret string

module storage './storage.bicep' = {
  name: 'provisionStorage'
  params: {
    resourceBaseName: resourceBaseName
    storageSku: storageSku
  }
}

module apim './apim.bicep' = {
  name: 'provisionApim'
  params: {
    resourceBaseName: resourceBaseName
    apimServiceSku: apimServiceSku
    publisherEmail:publisherEmail
    publisherName: publisherName
    aadAppClientId: aadAppClientId
    aadAppTenantId: aadAppTenantId
    aadAppScope: aadAppScope
    aadAppClientSecret: aadAppClientSecret
  }
}

output TAB_AZURE_STORAGE_RESOURCE_ID string = storage.outputs.TAB_AZURE_STORAGE_RESOURCE_ID
output TAB_DOMAIN string = storage.outputs.TAB_DOMAIN
output TAB_ENDPOINT string = storage.outputs.TAB_ENDPOINT
output APIM_ENDPOINT string = apim.outputs.APIM_ENDPOINT
output APIM_GRAPH_PROXY string = apim.outputs.APIM_GRAPH_PROXY
output APIM_CHECK_CONSNET string = apim.outputs.APIM_CHECK_CONSNET

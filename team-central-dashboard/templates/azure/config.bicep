@secure()
param provisionParameters object
param provisionOutputs object

// Get existing app settings for merge
var functionApiCurrentConfigs = reference('${ provisionOutputs.azureFunctionApiOutput.value.functionAppResourceId }/config/web', '2021-02-01')
var functionApiCurrentAppSettings = list('${ provisionOutputs.azureFunctionApiOutput.value.functionAppResourceId }/config/appsettings', '2021-02-01').properties

// Merge TeamsFx configurations to Azure Function App
module teamsFxAzureFunctionApiConfig './teamsFx/azureFunctionApiConfig.bicep' = {
  name: 'teamsFxAzureFunctionApiConfig'
  params: {
    provisionParameters: provisionParameters
    provisionOutputs: provisionOutputs
    currentConfigs: functionApiCurrentConfigs
    currentAppSettings: functionApiCurrentAppSettings
  }
}
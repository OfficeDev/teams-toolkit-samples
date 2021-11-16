@secure()
param provisionParameters object
param configAdminUPNList string
param configAppClientId string

module provision './provision.bicep' = {
  name: 'provisionResources'
  params: {
    provisionParameters: provisionParameters
    qnaStorageAccount: qnaService.outputs.qnaStorageAccount
    qnaMakerAccount: qnaService.outputs.qnaMakerAccount
  }
}

module teamsFxConfig './config.bicep' = {
  name: 'addTeamsFxConfigurations'
  params: {
    provisionParameters: provisionParameters
    provisionOutputs: provision
  }
}

module qnaService './qnaService.bicep' = {
  name: 'qnaService'
  params: {
    baseResourceName: provisionParameters.resourceBaseName
    configAdminUPNList: configAdminUPNList
    configAppClientId: configAppClientId
    provisionParameters: provisionParameters
  }
}

output provisionOutput object = provision
output teamsFxConfigurationOutput object = contains(reference(resourceId('Microsoft.Resources/deployments', teamsFxConfig.name), '2020-06-01'), 'outputs') ? teamsFxConfig : {}

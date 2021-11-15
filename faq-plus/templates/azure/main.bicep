@secure()
param provisionParameters object
param configAdminUPNList string
param configAppClientId string

module provision './provision.bicep' = {
  name: 'provisionResources'
  params: {
    provisionParameters: provisionParameters
  }
}

module teamsFxConfig './config.bicep' = {
  name: 'addTeamsFxConfigurations'
  params: {
    provisionParameters: provisionParameters
    provisionOutputs: provision
    storageName: azuredeploy.outputs.storageName
    qnaMakerAccountName: azuredeploy.outputs.qnaMakerAccountName
  }
}

module azuredeploy './azuredeploy.bicep' = {
  name: 'azuredeploy'
  params: {
    baseResourceName: provisionParameters.resourceBaseName
    configAdminUPNList: configAdminUPNList
    configAppClientId: configAppClientId
    provisionParameters: provisionParameters
  }
}

output provisionOutput object = provision
output teamsFxConfigurationOutput object = contains(reference(resourceId('Microsoft.Resources/deployments', teamsFxConfig.name), '2020-06-01'), 'outputs') ? teamsFxConfig : {}

@secure()
param provisionParameters object

module provision './provision.bicep' = {
  name: 'provisionResources'
  params: {
    provisionParameters: provisionParameters
  }
}

output provisionOutput object = provision
output teamsFxConfigurationOutput object = contains(reference(resourceId('Microsoft.Resources/deployments', teamsFxConfig.name), '2020-06-01'), 'outputs') ? teamsFxConfig : {}

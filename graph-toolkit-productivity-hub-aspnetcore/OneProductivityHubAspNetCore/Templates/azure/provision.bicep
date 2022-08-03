@secure()
param provisionParameters object
// Resources for web app
module webappProvision './provision/webapp.bicep' = {
  name: 'webappProvision'
  params: {
    provisionParameters: provisionParameters
    userAssignedIdentityId: userAssignedIdentityProvision.outputs.identityResourceId
  }
}

output webappOutput object = {
  teamsFxPluginId: 'fx-resource-frontend-hosting'
  domain: webappProvision.outputs.domain
  endpoint: webappProvision.outputs.endpoint
  indexPath: webappProvision.outputs.indexPath
  webAppResourceId: webappProvision.outputs.resourceId
}
// Resources for identity
module userAssignedIdentityProvision './provision/identity.bicep' = {
  name: 'userAssignedIdentityProvision'
  params: {
    provisionParameters: provisionParameters
  }
}

output identityOutput object = {
  teamsFxPluginId: 'fx-resource-identity'
  identityName: userAssignedIdentityProvision.outputs.identityName
  identityResourceId: userAssignedIdentityProvision.outputs.identityResourceId
  identityClientId: userAssignedIdentityProvision.outputs.identityClientId
}
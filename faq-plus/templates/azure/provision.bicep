@secure()
param provisionParameters object
param configAdminUPNList string
param configAppClientId string
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
// Resources for bot
module botProvision './provision/bot.bicep' = {
  name: 'botProvision'
  params: {
    provisionParameters: provisionParameters
    userAssignedIdentityId: userAssignedIdentityProvision.outputs.identityResourceId
    qnaStorageAccount: qnaService.outputs.qnaStorageAccount
    qnaMakerAccount: qnaService.outputs.qnaMakerAccount
    qnAMakerHostUrl: qnaService.outputs.qnAMakerHostUrl
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


output botOutput object = {
  teamsFxPluginId: 'fx-resource-bot'
  skuName: botProvision.outputs.botWebAppSKU
  siteName: botProvision.outputs.botWebAppName
  validDomain: botProvision.outputs.botDomain
  appServicePlanName: botProvision.outputs.appServicePlanName
  botWebAppResourceId: botProvision.outputs.botWebAppResourceId
  siteEndpoint: botProvision.outputs.botWebAppEndpoint
}

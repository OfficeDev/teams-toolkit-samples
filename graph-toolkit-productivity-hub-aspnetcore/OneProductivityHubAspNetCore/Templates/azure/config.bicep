@secure()
param provisionParameters object
param provisionOutputs object
var webappCurrentAppSettings = list('${provisionOutputs.webappOutput.value.webAppResourceId}/config/appsettings', '2021-02-01').properties

module teamsFxWebappConfig './teamsFx/webapp.bicep' = {
  name: 'addTeamsFxWebappConfiguration'
  params: {
    provisionParameters: provisionParameters
    provisionOutputs: provisionOutputs
    currentAppSettings: webappCurrentAppSettings
  }
}
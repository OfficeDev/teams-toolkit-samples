@secure()
param provisionParameters object
param provisionOutputs object
var botCurrentAppSettings = list('${provisionOutputs.botOutput.value.botWebAppResourceId}/config/appsettings', '2021-02-01').properties

module teamsFxBotConfig './teamsFx/bot.bicep' = {
  name: 'addTeamsFxBotConfiguration'
  params: {
    provisionParameters: provisionParameters
    provisionOutputs: provisionOutputs
    currentAppSettings: botCurrentAppSettings
  }
}
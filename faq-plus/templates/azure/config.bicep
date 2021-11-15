@secure()
param provisionParameters object
param provisionOutputs object
param storageName string
param qnaMakerAccountName string
var botCurrentAppSettings = list('${provisionOutputs.botOutput.value.botWebAppResourceId}/config/appsettings', '2021-01-15').properties

module teamsFxBotConfig './teamsFx/bot.bicep' = {
  name: 'addTeamsFxBotConfiguration'
  params: {
    provisionParameters: provisionParameters
    provisionOutputs: provisionOutputs
    currentAppSettings: botCurrentAppSettings
    storageName: storageName
    qnaMakerAccountName: qnaMakerAccountName
  }
}

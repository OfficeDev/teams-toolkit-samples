// Auto generated content, please customize files under provision folder

@secure()
param provisionParameters object
param provisionOutputs object
@secure()
param currentAppSettings object

param storageName string
param qnaMakerAccountName string

var botWebAppName = split(provisionOutputs.botOutput.value.botWebAppResourceId, '/')[8]
var m365ClientId = provisionParameters['m365ClientId']
var m365ClientSecret = provisionParameters['m365ClientSecret']
var m365TenantId = provisionParameters['m365TenantId']
var m365OauthAuthorityHost = provisionParameters['m365OauthAuthorityHost']

var botId = provisionParameters['botAadAppClientId']

var m365ApplicationIdUri = 'api://botid-${botId}'

var storageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storage.name};AccountKey=${listKeys(storage.id, storage.apiVersion).keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
var qnAMakerHostUrl = 'https://${qnaMakerAccountName}-qnamaker.azurewebsites.net'
var qnAMakerSubscriptionKey = listKeys(qnaMakerAccount.id, qnaMakerAccount.apiVersion).key1

resource storage 'Microsoft.Storage/storageAccounts@2021-04-01' existing = {
  name: storageName
}

resource qnaMakerAccount 'Microsoft.CognitiveServices/accounts@2017-04-18' existing = {
  name: qnaMakerAccountName
}

resource botWebAppSettings 'Microsoft.Web/sites/config@2021-01-15' = {
  name: '${botWebAppName}/appsettings'
  properties: union({
    INITIATE_LOGIN_ENDPOINT: uri(provisionOutputs.botOutput.value.siteEndpoint, 'auth-start.html')
    M365_AUTHORITY_HOST: m365OauthAuthorityHost
    M365_CLIENT_ID: m365ClientId
    M365_CLIENT_SECRET: m365ClientSecret
    M365_TENANT_ID: m365TenantId
    M365_APPLICATION_ID_URI: m365ApplicationIdUri
    IDENTITY_ID: provisionOutputs.identityOutput.value.identityClientId
    SCORETHRESHOLD: '0.5'
    STORAGECONNECTIONSTRING: storageConnectionString
    QNAMAKERAPIENDPOINTURL: qnaMakerAccount.properties.endpoint
    QNAMAKERHOSTURL: qnAMakerHostUrl
    QNAMAKERSUBSCRIPTIONKEY: qnAMakerSubscriptionKey
  }, currentAppSettings)
}

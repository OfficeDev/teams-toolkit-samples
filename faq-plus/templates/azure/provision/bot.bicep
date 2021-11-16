@secure()
param provisionParameters object
param userAssignedIdentityId string

param qnaStorageAccount string
param qnaMakerAccount string

var resourceBaseName = provisionParameters.resourceBaseName
var botAadAppClientId = provisionParameters['botAadAppClientId']
var botAadAppClientSecret = provisionParameters['botAadAppClientSecret']
var botServiceName = contains(provisionParameters, 'botServiceName') ? provisionParameters['botServiceName'] : '${resourceBaseName}-bot-service'
var botDisplayName = contains(provisionParameters, 'botDisplayName') ? provisionParameters['botDisplayName'] : '${resourceBaseName}-bot-displayname'
var serverfarmsName = contains(provisionParameters, 'botServerfarmsName') ? provisionParameters['botServerfarmsName'] : '${resourceBaseName}-bot-serverfarms'
var webAppSKU = contains(provisionParameters, 'botWebAppSKU') ? provisionParameters['botWebAppSKU'] : 'F1'
var webAppName = contains(provisionParameters, 'botSitesName') ? provisionParameters['botSitesName'] : '${resourceBaseName}-bot-sites'

var qnaStorageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${qnaStorage.name};AccountKey=${listKeys(qnaStorage.id, qnaStorage.apiVersion).keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
var qnAMakerHostUrl = 'https://${qnaMakerAccount}-qnamaker.azurewebsites.net'
var qnAMakerSubscriptionKey = listKeys(qnaMaker.id, qnaMaker.apiVersion).key1

resource qnaStorage 'Microsoft.Storage/storageAccounts@2021-04-01' existing = {
  name: qnaStorageAccount
}

resource qnaMaker 'Microsoft.CognitiveServices/accounts@2017-04-18' existing = {
  name: qnaMakerAccount
}

resource botService 'Microsoft.BotService/botServices@2021-03-01' = {
  kind: 'azurebot'
  location: 'global'
  name: botServiceName
  properties: {
    displayName: botDisplayName
    endpoint: uri('https://${webApp.properties.defaultHostName}', '/api/messages')
    msaAppId: botAadAppClientId
  }
  sku: {
    name: 'F0'
  }
}

resource botServiceMsTeamsChannel 'Microsoft.BotService/botServices/channels@2021-03-01' = {
  parent: botService
  location: 'global'
  name: 'MsTeamsChannel'
  properties: {
    channelName: 'MsTeamsChannel'
  }
}

resource serverfarm 'Microsoft.Web/serverfarms@2021-02-01' = {
  kind: 'app'
  location: resourceGroup().location
  name: serverfarmsName
  sku: {
    name: webAppSKU
  }
}

resource webApp 'Microsoft.Web/sites@2021-02-01' = {
  kind: 'app'
  location: resourceGroup().location
  name: webAppName
  properties: {
    serverFarmId: serverfarm.id
    keyVaultReferenceIdentity: userAssignedIdentityId
    siteConfig: {
      appSettings: [
        {
          name: 'BOT_ID'
          value: botAadAppClientId
        }
        {
          name: 'BOT_PASSWORD'
          value: botAadAppClientSecret
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '12.13.0'
        }
        {
          name: 'SCORETHRESHOLD'
          value: '0.5'
        }
        {
          name: 'STORAGECONNECTIONSTRING'
          value: qnaStorageConnectionString
        }
        {
          name: 'QNAMAKERAPIENDPOINTURL'
          value: qnaMaker.properties.endpoint
        }
        {
          name: 'QNAMAKERHOSTURL'
          value: qnAMakerHostUrl
        }
        {
          name: 'QNAMAKERSUBSCRIPTIONKEY'
          value: qnAMakerSubscriptionKey
        }
      ]
    }
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentityId}': {}
    }
  }
}

output botWebAppSKU string = webAppSKU
output botWebAppName string = webAppName
output botDomain string = webApp.properties.defaultHostName
output appServicePlanName string = serverfarmsName
output botServiceName string = botServiceName
output botWebAppResourceId string = webApp.id
output botWebAppEndpoint string = 'https://${webApp.properties.defaultHostName}'

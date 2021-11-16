param resourceBaseName string
param bot_aadClientId string
@secure()
param bot_aadClientSecret string
param bot_serviceName string = '${resourceBaseName}-bot-service'
param bot_displayName string = '${resourceBaseName}-bot-displayname'
param bot_serverfarmsName string = '${resourceBaseName}-bot-serverfarms'
param bot_webAppSKU string = 'F1'
param bot_serviceSKU string = 'F1'
param bot_sitesName string = '${resourceBaseName}-bot-sites'
param authLoginUriSuffix string = 'auth-start.html'
param m365ClientId string
@secure()
param m365ClientSecret string
param m365TenantId string
param m365OauthAuthorityHost string

var m365ApplicationIdUri = 'api://botid-${bot_aadClientId}'

module botProvision './modules/botProvision.bicep' = {
  name: 'botProvision'
  params: {
    botServerfarmsName: bot_serverfarmsName
    botServiceName: bot_serviceName
    botAadClientId: bot_aadClientId
    botDisplayName: bot_displayName
    botServiceSKU: bot_serviceSKU
    botWebAppName: bot_sitesName
    botWebAppSKU: bot_webAppSKU
  }
}
module botConfiguration './modules/botConfiguration.bicep' = {
  name: 'botConfiguration'
  dependsOn: [
    botProvision
  ]
  params: {
    botAadClientId: bot_aadClientId
    botAadClientSecret: bot_aadClientSecret
    botServiceName: bot_serviceName
    botWebAppName: bot_sitesName
    authLoginUriSuffix: authLoginUriSuffix
    botEndpoint: botProvision.outputs.botWebAppEndpoint
    m365ApplicationIdUri: m365ApplicationIdUri
    m365ClientId: m365ClientId
    m365ClientSecret: m365ClientSecret
    m365TenantId: m365TenantId
    m365OauthAuthorityHost: m365OauthAuthorityHost
  }
}

output bot_webAppSKU string = botProvision.outputs.botWebAppSKU
output bot_serviceSKU string = botProvision.outputs.botServiceSKU
output bot_webAppName string = botProvision.outputs.botWebAppName
output bot_webAppResourceId string = botProvision.outputs.botWebAppResourceId
output bot_domain string = botProvision.outputs.botDomain
output bot_appServicePlanName string = botProvision.outputs.appServicePlanName
output bot_serviceName string = botProvision.outputs.botServiceName
output bot_webAppEndpoint string = botProvision.outputs.botWebAppEndpoint
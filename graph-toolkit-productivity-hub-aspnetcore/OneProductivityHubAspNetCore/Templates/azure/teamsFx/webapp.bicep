// Auto generated content, please customize files under provision folder

@secure()
param provisionParameters object
param provisionOutputs object
@secure()
param currentAppSettings object

var webappName = split(provisionOutputs.webappOutput.value.webappResourceId, '/')[8]
var m365ClientId = provisionParameters['m365ClientId']
var m365ClientSecret = provisionParameters['m365ClientSecret']
var m365TenantId = provisionParameters['m365TenantId']
var m365OauthAuthorityHost = provisionParameters['m365OauthAuthorityHost']
var oauthAuthority = uri(m365OauthAuthorityHost, m365TenantId)
var webappEndpoint = provisionOutputs.webappOutput.value.endpoint
var initiateLoginEndpoint = uri(webappEndpoint, 'auth-start.html')

resource appSettings 'Microsoft.Web/sites/config@2021-02-01' = {
  name: '${webappName}/appsettings'
  properties: union({
    TAB_APP_ENDPOINT: webappEndpoint
    TeamsFx__Authentication__ClientId: m365ClientId
    TeamsFx__Authentication__ClientSecret: m365ClientSecret
    TeamsFx__Authentication__InitiateLoginEndpoint: initiateLoginEndpoint
    TeamsFx__Authentication__OAuthAuthority: oauthAuthority
    IDENTITY_ID: provisionOutputs.identityOutput.value.identityClientId
  }, currentAppSettings)
}

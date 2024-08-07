@secure()
param provisionParameters object
var resourceBaseName = provisionParameters.resourceBaseName
var staticWebAppName = contains(provisionParameters, 'frontendHostingStorageName') ? provisionParameters['frontendHostingStorageName'] : '${resourceBaseName}tab'
var staticWebAppSku = 'Free'

// Azure Static Web Apps that hosts your static web site
resource swa 'Microsoft.Web/staticSites@2022-09-01' = {
  name: staticWebAppName
  // SWA do not need location setting
  location: 'centralus'
  sku: {
    name: staticWebAppSku
    tier: staticWebAppSku
  }
  properties: {}
}

var siteDomain = swa.properties.defaultHostname

output resourceId string = swa.id
output endpoint string = 'https://${siteDomain}'
output domain string = siteDomain

@secure()
param provisionParameters object

@description('The base name to use for the resources that will be provisioned.')
@minLength(1)
param baseResourceName string

@description('The client ID of the of the configuration Azure AD app, e.g., 123e4567-e89b-12d3-a456-426655440000.')
@minLength(36)
@maxLength(36)
param configAppClientId string

@description('Semicolon-delimited list of the user principal names (UPNs) allowed to access the configuration app.')
@minLength(1)
param configAdminUPNList string

@description('The ID of the tenant to which the app will be deployed.')
@minLength(1)
@maxLength(36)
param tenantId string = subscription().tenantId

@description('The pricing tier for the hosting plan.')
@allowed([
  'Basic'
  'Standard'
  'Premium'
])
param sku string = 'Standard'

@description('The size of the hosting plan (small, medium, or large).')
@allowed([
  '1'
  '2'
  '3'
])
param planSize string = '2'

@description('Location for all resources.')
param location string = resourceGroup().location

@description('The pricing tier for the QnAMaker service.')
@allowed([
  'F0 (3 managed documents per month, 3 transactions per second, 100 transactions per minute, 50K transactions per month)'
  'S0 ($10 per month for unlimited documents, 3 transactions per second, 100 transactions per minute)'
])
param qnaMakerSku string = 'S0 ($10 per month for unlimited documents, 3 transactions per second, 100 transactions per minute)'

@description('The pricing tier for the Azure Search service.')
@allowed([
  'F (3 indexes)'
  'B (15 indexes)'
  'S (50 indexes)'
  'S2 (200 indexes)'
])
param searchServiceSku string = 'B (15 indexes)'

@description('The URL to the GitHub repository to deploy.')
param gitRepoUrl string = 'https://github.com/OfficeDev/TeamsFx-Samples'

@description('The branch of the GitHub repository to deploy.')
param gitBranch string = 'main'

var hostingPlanName_var = baseResourceName
var storageAccountName_var = uniqueString(concat(resourceGroup().id, baseResourceName))
var configAppName_var = '${baseResourceName}-config'
var configAppUrl = 'https://${configAppName_var}.azurewebsites.net'
var configAppInsightsName_var = '${baseResourceName}-config'
var qnaMakerAccountName_var = baseResourceName
var qnaMakerLocation = 'westus'
var qnaMakerAppServiceName_var = '${baseResourceName}-qnamaker'
var qnaMakerAppInsightsName = '${baseResourceName}-qnamaker'
var qnaMakerSkuValue = substring(qnaMakerSku, 0, 2)
var azureSearchName_var = '${uniqueString(concat(resourceGroup().id, baseResourceName))}-search'
var azureSearchSkus = {
  'F ': 'free'
  'B ': 'basic'
  'S ': 'standard'
  S2: 'standard2'
}
var azureSearchSkuValue = azureSearchSkus[toUpper(substring(searchServiceSku, 0, 2))]
var sharedSkus = [
  'Free'
  'Shared'
]
var isSharedPlan = contains(sharedSkus, sku)
var skuFamily = ((sku == 'Shared') ? 'D' : take(sku, 1))

resource storageAccountName 'Microsoft.Storage/storageAccounts@2018-02-01' = {
  name: storageAccountName_var
  location: location
  kind: 'Storage'
  sku: {
    name: 'Standard_LRS'
  }
}

resource hostingPlanName 'Microsoft.Web/serverfarms@2016-09-01' = {
  name: hostingPlanName_var
  location: location
  properties: {
    name: hostingPlanName_var
    hostingEnvironment: ''
    numberOfWorkers: 1
  }
  sku: {
    name: (isSharedPlan ? '${skuFamily}1' : concat(skuFamily, planSize))
    tier: sku
    size: concat(skuFamily, planSize)
    family: skuFamily
    capacity: 0
  }
}

resource configAppName 'Microsoft.Web/sites@2016-08-01' = {
  name: configAppName_var
  location: location
  kind: 'app'
  properties: {
    name: configAppName_var
    serverFarmId: hostingPlanName.id
    enabled: true
    reserved: false
    scmSiteAlsoStopped: false
    clientAffinityEnabled: true
    clientCertEnabled: false
    hostNamesDisabled: false
    containerSize: 0
    dailyMemoryTimeQuota: 0
    httpsOnly: true
    siteConfig: {
      alwaysOn: false
      appSettings: [
        {
          name: 'SAMPLE_NAME'
          value: 'faq-plus'
        }
        {
          name: 'SITE_ROLE'
          value: 'configuration'
        }
        {
          name: 'StorageConnectionString'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName_var};AccountKey=${listKeys(storageAccountName.id, '2015-05-01-preview').key1}'
        }
        {
          name: 'QnAMakerApiEndpointUrl'
          value: reference(qnaMakerAccountName.id, '2017-04-18').endpoint
        }
        {
          name: 'QnAMakerSubscriptionKey'
          value: listKeys(qnaMakerAccountName.id, '2017-04-18').key1
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: reference(configAppInsightsName.id, '2015-05-01').InstrumentationKey
        }
        {
          name: 'ida:AADInstance'
          value: 'https://login.microsoftonline.com/'
        }
        {
          name: 'ida:ClientId'
          value: configAppClientId
        }
        {
          name: 'ida:TenantId'
          value: tenantId
        }
        {
          name: 'ida:RedirectUri'
          value: configAppUrl
        }
        {
          name: 'ida:PostLogoutRedirectUri'
          value: configAppUrl
        }
        {
          name: 'ValidUpns'
          value: configAdminUPNList
        }
      ]
    }
  }
}

resource configAppName_web 'Microsoft.Web/sites/sourcecontrols@2016-08-01' = if (!empty(gitRepoUrl)) {
  parent: configAppName
  name: 'web'
  properties: {
    repoUrl: gitRepoUrl
    branch: gitBranch
    isManualIntegration: true
  }
}

resource configAppInsightsName 'Microsoft.Insights/components@2015-05-01' = {
  name: configAppInsightsName_var
  location: location
  kind: 'web'
  tags: {
    'hidden-link:${resourceGroup().id}/providers/Microsoft.Web/sites/${configAppName_var}': 'Resource'
  }
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
  }
}

resource qnaMakerAccountName 'Microsoft.CognitiveServices/accounts@2017-04-18' = {
  kind: 'QnAMaker'
  name: qnaMakerAccountName_var
  location: qnaMakerLocation
  sku: {
    name: qnaMakerSkuValue
  }
  properties: {
    apiProperties: {
      qnaRuntimeEndpoint: 'https://${qnaMakerAppServiceName.properties.hostNames[0]}'
    }
  }
}

resource azureSearchName 'Microsoft.Search/searchServices@2015-08-19' = {
  name: azureSearchName_var
  location: location
  tags: {
    isqnamaker: 'true'
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
  }
  sku: {
    name: toLower(azureSearchSkuValue)
  }
}

resource qnaMakerAppServiceName 'Microsoft.Web/sites@2016-08-01' = {
  name: qnaMakerAppServiceName_var
  location: location
  properties: {
    enabled: true
    siteConfig: {
      cors: {
        allowedOrigins: [
          '*'
        ]
      }
    }
    name: qnaMakerAppServiceName_var
    serverFarmId: '/subscriptions/${subscription().subscriptionId}/resourcegroups/${resourceGroup().name}/providers/Microsoft.Web/serverfarms/${hostingPlanName_var}'
    hostingEnvironment: ''
  }
  tags: {
    isqnamaker: 'true'
    'hidden-related:/subscriptions/${subscription().subscriptionId}/resourcegroups/${resourceGroup().name}/providers/Microsoft.Web/serverfarms/${hostingPlanName_var}': 'empty'
  }
  dependsOn: [
    hostingPlanName
  ]
}

resource qnaMakerAppServiceName_qnaMakerAppInsightsName 'Microsoft.Insights/components@2015-05-01' = {
  name: qnaMakerAppInsightsName
  kind: 'web'
  location: location
  tags: {
    'hidden-link:${qnaMakerAppServiceName.id}': 'Resource'
  }
  properties: {
    ApplicationId: qnaMakerAppServiceName_var
  }
}

resource qnaMakerAppServiceName_appsettings 'Microsoft.Web/sites/config@2015-08-01' = {
  parent: qnaMakerAppServiceName
  name: 'appsettings'
  location: location
  properties: {
    AzureSearchName: azureSearchName_var
    AzureSearchAdminKey: listAdminKeys(azureSearchName.id, '2015-08-19').primaryKey
    UserAppInsightsKey: reference(resourceId('Microsoft.Insights/components/', qnaMakerAppInsightsName), '2015-05-01').InstrumentationKey
    UserAppInsightsName: qnaMakerAppInsightsName
    UserAppInsightsAppId: reference(resourceId('Microsoft.Insights/components/', qnaMakerAppInsightsName), '2015-05-01').AppId
    PrimaryEndpointKey: '${qnaMakerAppServiceName_var}-PrimaryEndpointKey'
    SecondaryEndpointKey: '${qnaMakerAppServiceName_var}-SecondaryEndpointKey'
    DefaultAnswer: 'No good match found in KB.'
    QNAMAKER_EXTENSION_VERSION: 'latest'
  }
}

output configurationAppUrl string = configAppUrl
output storageName string = storageAccountName.name
output qnaMakerAccountName string = qnaMakerAccountName.name

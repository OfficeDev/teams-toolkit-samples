param resourceBaseName string
param apimServiceSku string
param publisherEmail string
param publisherName string
param aadAppClientId string
param aadAppTenantId string
param aadAppScope string
@secure()
param aadAppClientSecret string

param apimServiceName string = resourceBaseName
param apimApiGraphProxyName string = 'graph-proxy'
param apimApiCheckConsentName string = 'check-consent'
param location string = resourceGroup().location

// Azure API Management
resource apimService 'Microsoft.ApiManagement/service@2022-04-01-preview' = {
  name: apimServiceName
  location: location
  sku: {
    name: apimServiceSku
    capacity: 0
  }
  properties: {
    publisherEmail: publisherEmail
    publisherName: publisherName
    hostnameConfigurations: [
      {
        type: 'Proxy'
        hostName: '${apimServiceName}.azure-api.net'
        negotiateClientCertificate: false
        defaultSslBinding: true
        certificateSource: 'BuiltIn'
      }
    ]
  }
}

resource apimApiGraphProxy 'Microsoft.ApiManagement/service/apis@2023-03-01-preview' = {
  parent: apimService
  name: apimApiGraphProxyName
  properties: {
    displayName: apimApiGraphProxyName
    apiRevision: '1'
    subscriptionRequired: false
    serviceUrl: 'https://graph.microsoft.com/'
    path: apimApiGraphProxyName
    protocols: [
      'https'
    ]
    authenticationSettings: {
      oAuth2AuthenticationSettings: []
      openidAuthenticationSettings: []
    }
    subscriptionKeyParameterNames: {
      header: 'Ocp-Apim-Subscription-Key'
      query: 'subscription-key'
    }
  }
}

resource apimApiCheckConsent 'Microsoft.ApiManagement/service/apis@2023-03-01-preview' = {
  parent: apimService
  name: apimApiCheckConsentName
  properties: {
    displayName: apimApiCheckConsentName
    apiRevision: '1'
    subscriptionRequired: false
    serviceUrl: 'https://graph.microsoft.com/'
    path: apimApiCheckConsentName
    protocols: [
      'https'
    ]
    authenticationSettings: {
      oAuth2AuthenticationSettings: []
      openidAuthenticationSettings: []
    }
    subscriptionKeyParameterNames: {
      header: 'Ocp-Apim-Subscription-Key'
      query: 'subscription-key'
    }
  }
}

resource apimNamedValuesClientId 'Microsoft.ApiManagement/service/namedValues@2023-03-01-preview' = {
  parent: apimService
  name: 'clientId'
  properties: {
    displayName: 'clientId'
    value: '${aadAppClientId}'
    tags: []
    secret: false
  }
}

resource apimNamedValuesClientSecret 'Microsoft.ApiManagement/service/namedValues@2023-03-01-preview' = {
  parent: apimService
  name: 'clientSecret'
  properties: {
    displayName: 'clientSecret'
    value: '${aadAppClientSecret}'
    tags: []
    secret: true
  }
}

resource apimNamedValuesScope 'Microsoft.ApiManagement/service/namedValues@2023-03-01-preview' = {
  parent: apimService
  name: 'scope'
  properties: {
    displayName: 'scope'
    value: '${aadAppScope}'
    tags: []
    secret: false
  }
}

resource apimNamedValuesTenantId 'Microsoft.ApiManagement/service/namedValues@2023-03-01-preview' = {
  parent: apimService
  name: 'tenantId'
  properties: {
    displayName: 'tenantId'
    value: '${aadAppTenantId}'
    tags: []
    secret: false
  }
}

resource apimPolicy 'Microsoft.ApiManagement/service/policies@2023-03-01-preview' = {
  parent: apimService
  name: 'policy'
  properties: {
    value: '<!--\r\n    IMPORTANT:\r\n    - Policy elements can appear only within the <inbound>, <outbound>, <backend> section elements.\r\n    - Only the <forward-request> policy element can appear within the <backend> section element.\r\n    - To apply a policy to the incoming request (before it is forwarded to the backend service), place a corresponding policy element within the <inbound> section element.\r\n    - To apply a policy to the outgoing response (before it is sent back to the caller), place a corresponding policy element within the <outbound> section element.\r\n    - To add a policy position the cursor at the desired insertion point and click on the round button associated with the policy.\r\n    - To remove a policy, delete the corresponding policy statement from the policy document.\r\n    - Policies are applied in the order of their appearance, from the top down.\r\n-->\r\n<policies>\r\n  <inbound></inbound>\r\n  <backend>\r\n    <forward-request />\r\n  </backend>\r\n  <outbound></outbound>\r\n</policies>'
    format: 'xml'
  }
}

resource apimApiGraphProxyPolicy 'Microsoft.ApiManagement/service/apis/policies@2023-03-01-preview' = {
  parent: apimApiGraphProxy
  name: 'policy'
  properties: {
    value: '<!--\r\n    IMPORTANT:\r\n    - Policy elements can appear only within the <inbound>, <outbound>, <backend> section elements.\r\n    - To apply a policy to the incoming request (before it is forwarded to the backend service), place a corresponding policy element within the <inbound> section element.\r\n    - To apply a policy to the outgoing response (before it is sent back to the caller), place a corresponding policy element within the <outbound> section element.\r\n    - To add a policy, place the cursor at the desired insertion point and select a policy from the sidebar.\r\n    - To remove a policy, delete the corresponding policy statement from the policy document.\r\n    - Position the <base> element within a section element to inherit all policies from the corresponding section element in the enclosing scope.\r\n    - Remove the <base> element to prevent inheriting policies from the corresponding section element in the enclosing scope.\r\n    - Policies are applied in the order of their appearance, from the top down.\r\n    - Comments within policy elements are not supported and may disappear. Place your comments between policy elements or at a higher level scope.\r\n-->\r\n<policies>\r\n  <inbound>\r\n    <cors>\r\n      <allowed-origins>\r\n        <origin>*</origin>\r\n      </allowed-origins>\r\n      <allowed-methods>\r\n        <method>*</method>\r\n      </allowed-methods>\r\n      <allowed-headers>\r\n        <header>*</header>\r\n      </allowed-headers>\r\n      <expose-headers>\r\n        <header>*</header>\r\n      </expose-headers>\r\n    </cors>\r\n    <base />\r\n  </inbound>\r\n  <backend>\r\n    <base />\r\n  </backend>\r\n  <outbound>\r\n    <base />\r\n  </outbound>\r\n  <on-error>\r\n    <base />\r\n  </on-error>\r\n</policies>'
    format: 'xml'
  }
  dependsOn: [
    apimService
  ]
}

resource apimApiCheckConsentPolicy 'Microsoft.ApiManagement/service/apis/policies@2023-03-01-preview' = {
  parent: apimApiCheckConsent
  name: 'policy'
  properties: {
    value: '<!--\r\n    IMPORTANT:\r\n    - Policy elements can appear only within the <inbound>, <outbound>, <backend> section elements.\r\n    - To apply a policy to the incoming request (before it is forwarded to the backend service), place a corresponding policy element within the <inbound> section element.\r\n    - To apply a policy to the outgoing response (before it is sent back to the caller), place a corresponding policy element within the <outbound> section element.\r\n    - To add a policy, place the cursor at the desired insertion point and select a policy from the sidebar.\r\n    - To remove a policy, delete the corresponding policy statement from the policy document.\r\n    - Position the <base> element within a section element to inherit all policies from the corresponding section element in the enclosing scope.\r\n    - Remove the <base> element to prevent inheriting policies from the corresponding section element in the enclosing scope.\r\n    - Policies are applied in the order of their appearance, from the top down.\r\n    - Comments within policy elements are not supported and may disappear. Place your comments between policy elements or at a higher level scope.\r\n-->\r\n<policies>\r\n  <inbound>\r\n    <cors>\r\n      <allowed-origins>\r\n        <origin>*</origin>\r\n      </allowed-origins>\r\n      <allowed-methods>\r\n        <method>*</method>\r\n      </allowed-methods>\r\n      <allowed-headers>\r\n        <header>*</header>\r\n      </allowed-headers>\r\n      <expose-headers>\r\n        <header>*</header>\r\n      </expose-headers>\r\n    </cors>\r\n    <base />\r\n  </inbound>\r\n  <backend>\r\n    <base />\r\n  </backend>\r\n  <outbound>\r\n    <base />\r\n  </outbound>\r\n  <on-error>\r\n    <base />\r\n  </on-error>\r\n</policies>'
    format: 'xml'
  }
  dependsOn: [
    apimService
  ]
}

resource apimApiOperationGet 'Microsoft.ApiManagement/service/apis/operations@2023-03-01-preview' = {
  parent: apimApiGraphProxy
  name: 'get'
  properties: {
    displayName: 'Graph Get Calls'
    method: 'GET'
    urlTemplate: '/*'
    templateParameters: []
    description: 'Route all Get calls to Graph'
  }
  dependsOn: [
    apimService
  ]
}

resource apimApiOperationPost 'Microsoft.ApiManagement/service/apis/operations@2023-03-01-preview' = {
  parent: apimApiGraphProxy
  name: 'post'
  properties: {
    displayName: 'Graph Post Calls'
    method: 'POST'
    urlTemplate: '/*'
    templateParameters: []
    description: 'Route all Post calls to Graph'
  }
  dependsOn: [
    apimService
  ]
}

resource apimApiOperationCheckConsent 'Microsoft.ApiManagement/service/apis/operations@2023-03-01-preview' = {
  parent: apimApiCheckConsent
  name: 'post'
  properties: {
    displayName: 'check-consent'
    method: 'GET'
    urlTemplate: '/*'
    templateParameters: []
    description: 'Route all Post calls to Graph'
  }
  dependsOn: [
    apimService
  ]
}

resource apimApiOperationGetPolicy 'Microsoft.ApiManagement/service/apis/operations/policies@2023-03-01-preview' = {
  parent: apimApiOperationGet
  name: 'policy'
  properties: {
    value: '<!--\r\n    IMPORTANT:\r\n    - Policy elements can appear only within the <inbound>, <outbound>, <backend> section elements.\r\n    - To apply a policy to the incoming request (before it is forwarded to the backend service), place a corresponding policy element within the <inbound> section element.\r\n    - To apply a policy to the outgoing response (before it is sent back to the caller), place a corresponding policy element within the <outbound> section element.\r\n    - To add a policy, place the cursor at the desired insertion point and select a policy from the sidebar.\r\n    - To remove a policy, delete the corresponding policy statement from the policy document.\r\n    - Position the <base> element within a section element to inherit all policies from the corresponding section element in the enclosing scope.\r\n    - Remove the <base> element to prevent inheriting policies from the corresponding section element in the enclosing scope.\r\n    - Policies are applied in the order of their appearance, from the top down.\r\n    - Comments within policy elements are not supported and may disappear. Place your comments between policy elements or at a higher level scope.\r\n-->\r\n<policies>\r\n  <inbound>\r\n    <base />\r\n    <send-request ignore-error="true" timeout="20" response-variable-name="bearerToken" mode="new">\r\n      <set-url>https://login.microsoftonline.com/{{tenantId}}/oauth2/v2.0/token</set-url>\r\n      <set-method>POST</set-method>\r\n      <set-header name="Content-Type" exists-action="override">\r\n        <value>application/x-www-form-urlencoded</value>\r\n      </set-header>\r\n      <set-body>@{\r\n              var assertion = context.Request.Headers.GetValueOrDefault("Authorization","").Replace("Bearer ","");\r\n              return $"client_id={{clientId}}&amp;scope={{scope}}&amp;client_secret={{clientSecret}}&amp;assertion={assertion}&amp;requested_token_use=on_behalf_of&amp;grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer";\r\n          }</set-body>\r\n    </send-request>\r\n    <set-header name="Authorization" exists-action="override">\r\n      <value>@("Bearer " + (String)((IResponse)context.Variables["bearerToken"]).Body.As&lt;JObject&gt;()["access_token"])</value>\r\n    </set-header>\r\n    <!--  Don\'t expose APIM subscription key to the backend. -->\r\n    <set-header name="Ocp-Apim-Subscription-Key" exists-action="delete" />\r\n  </inbound>\r\n  <backend>\r\n    <base />\r\n  </backend>\r\n  <outbound>\r\n    <base />\r\n  </outbound>\r\n  <on-error>\r\n    <base />\r\n  </on-error>\r\n</policies>'
    format: 'xml'
  }
  dependsOn: [
    apimApiOperationGet
    apimService
  ]
}

resource apimApiOperationPostPolicy 'Microsoft.ApiManagement/service/apis/operations/policies@2023-03-01-preview' = {
  parent: apimApiOperationPost
  name: 'policy'
  properties: {
    value: '<!--\r\n    IMPORTANT:\r\n    - Policy elements can appear only within the <inbound>, <outbound>, <backend> section elements.\r\n    - To apply a policy to the incoming request (before it is forwarded to the backend service), place a corresponding policy element within the <inbound> section element.\r\n    - To apply a policy to the outgoing response (before it is sent back to the caller), place a corresponding policy element within the <outbound> section element.\r\n    - To add a policy, place the cursor at the desired insertion point and select a policy from the sidebar.\r\n    - To remove a policy, delete the corresponding policy statement from the policy document.\r\n    - Position the <base> element within a section element to inherit all policies from the corresponding section element in the enclosing scope.\r\n    - Remove the <base> element to prevent inheriting policies from the corresponding section element in the enclosing scope.\r\n    - Policies are applied in the order of their appearance, from the top down.\r\n    - Comments within policy elements are not supported and may disappear. Place your comments between policy elements or at a higher level scope.\r\n-->\r\n<policies>\r\n  <inbound>\r\n    <base />\r\n    <send-request ignore-error="true" timeout="20" response-variable-name="bearerToken" mode="new">\r\n      <set-url>https://login.microsoftonline.com/{{tenantId}}/oauth2/v2.0/token</set-url>\r\n      <set-method>POST</set-method>\r\n      <set-header name="Content-Type" exists-action="override">\r\n        <value>application/x-www-form-urlencoded</value>\r\n      </set-header>\r\n      <set-body>@{\r\n              var assertion = context.Request.Headers.GetValueOrDefault("Authorization","").Replace("Bearer ","");\r\n              return $"client_id={{clientId}}&amp;scope={{scope}}&amp;client_secret={{clientSecret}}&amp;assertion={assertion}&amp;requested_token_use=on_behalf_of&amp;grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer";\r\n          }</set-body>\r\n    </send-request>\r\n    <set-header name="Authorization" exists-action="override">\r\n      <value>@("Bearer " + (String)((IResponse)context.Variables["bearerToken"]).Body.As&lt;JObject&gt;()["access_token"])</value>\r\n    </set-header>\r\n    <!--  Don\'t expose APIM subscription key to the backend. -->\r\n    <set-header name="Ocp-Apim-Subscription-Key" exists-action="delete" />\r\n  </inbound>\r\n  <backend>\r\n    <base />\r\n  </backend>\r\n  <outbound>\r\n    <base />\r\n  </outbound>\r\n  <on-error>\r\n    <base />\r\n  </on-error>\r\n</policies>'
    format: 'xml'
  }
  dependsOn: [
    apimApiOperationPost
    apimService
  ]
}

resource apimApiOperationCheckConsentPolicy 'Microsoft.ApiManagement/service/apis/operations/policies@2023-03-01-preview' = {
  parent: apimApiOperationCheckConsent
  name: 'policy'
  properties: {
    value: '<!--\r\n    IMPORTANT:\r\n    - Policy elements can appear only within the <inbound>, <outbound>, <backend> section elements.\r\n    - To apply a policy to the incoming request (before it is forwarded to the backend service), place a corresponding policy element within the <inbound> section element.\r\n    - To apply a policy to the outgoing response (before it is sent back to the caller), place a corresponding policy element within the <outbound> section element.\r\n    - To add a policy, place the cursor at the desired insertion point and select a policy from the sidebar.\r\n    - To remove a policy, delete the corresponding policy statement from the policy document.\r\n    - Position the <base> element within a section element to inherit all policies from the corresponding section element in the enclosing scope.\r\n    - Remove the <base> element to prevent inheriting policies from the corresponding section element in the enclosing scope.\r\n    - Policies are applied in the order of their appearance, from the top down.\r\n    - Comments within policy elements are not supported and may disappear. Place your comments between policy elements or at a higher level scope.\r\n-->\r\n<policies>\r\n  <inbound>\r\n    <base />\r\n    <send-request ignore-error="true" timeout="20" response-variable-name="bearerToken" mode="new">\r\n      <set-url>https://login.microsoftonline.com/{{tenantId}}/oauth2/v2.0/token</set-url>\r\n      <set-method>POST</set-method>\r\n      <set-header name="Content-Type" exists-action="override">\r\n        <value>application/x-www-form-urlencoded</value>\r\n      </set-header>\r\n      <set-body>@{\r\n              var assertion = context.Request.Headers.GetValueOrDefault("Authorization","").Replace("Bearer ","");\r\n              return $"client_id={{clientId}}&amp;scope={{scope}}&amp;client_secret={{clientSecret}}&amp;assertion={assertion}&amp;requested_token_use=on_behalf_of&amp;grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer";\r\n          }</set-body>\r\n    </send-request>\r\n    <choose>\r\n      <when condition="@{&#xA;                var tokenResponse = (String)((IResponse)context.Variables[&quot;bearerToken&quot;]).Body.As&lt;JObject&gt;()[&quot;access_token&quot;];&#xA;                return tokenResponse != null;&#xA;            }">\r\n        <return-response>\r\n          <set-status code="200" />\r\n        </return-response>\r\n      </when>\r\n      <otherwise>\r\n        <return-response>\r\n          <set-status code="401" />\r\n        </return-response>\r\n      </otherwise>\r\n    </choose>\r\n  </inbound>\r\n  <backend>\r\n    <base />\r\n  </backend>\r\n  <outbound>\r\n    <base />\r\n  </outbound>\r\n  <on-error>\r\n    <base />\r\n  </on-error>\r\n</policies>'
    format: 'xml'
  }
  dependsOn: [
    apimApiOperationGet
    apimService
  ]
}

var apimEndpoint = apimService.properties.hostnameConfigurations[0].hostName

output APIM_ENDPOINT string = 'https://${apimEndpoint}'
output APIM_GRAPH_PROXY string = apimApiGraphProxyName
output APIM_CHECK_CONSNET string = apimApiCheckConsentName

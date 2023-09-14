const config = {
  initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
  clientId: process.env.REACT_APP_CLIENT_ID,
  apimEndpoint: process.env.REACT_APP_APIM_ENDPOINT,
  apimGraphProxy: process.env.REACT_APP_APIM_GRAPH_PROXY,
  apimCheckConsent: process.env.REACT_APP_APIM_CHECKCONSENT,
  scope: ["User.Read"]
};

export default config;

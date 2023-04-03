import {
  BearerTokenAuthProvider,
  createApiClient,
  TeamsUserCredential,
  TeamsUserCredentialAuthConfig,
} from "@microsoft/teamsfx";
import config from "./config";

const authConfig: TeamsUserCredentialAuthConfig = {
  clientId: config.clientId!,
  initiateLoginEndpoint: config.initiateLoginEndpoint!,
};
const credential = new TeamsUserCredential(authConfig);
const apiBaseUrl = config.apiEndpoint + "/api/";
// createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
const apiClient = createApiClient(
  apiBaseUrl,
  new BearerTokenAuthProvider(
    async () => (await credential.getToken(""))!.token
  )
);

export { apiClient };

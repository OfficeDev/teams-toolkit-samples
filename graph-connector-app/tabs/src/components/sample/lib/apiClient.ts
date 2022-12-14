import { BearerTokenAuthProvider, createApiClient, TeamsUserCredential, TeamsUserCredentialAuthConfig } from "@microsoft/teamsfx";

const authConfig: TeamsUserCredentialAuthConfig = {
    clientId: process.env.REACT_APP_CLIENT_ID!,
    initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL!,
}
const credential = new TeamsUserCredential(authConfig);
const apiBaseUrl = process.env.REACT_APP_FUNC_ENDPOINT + "/api/";
// createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
const apiClient = createApiClient(
    apiBaseUrl,
    new BearerTokenAuthProvider(async () => (await credential.getToken(""))!.token));

export { apiClient };
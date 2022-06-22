import { BearerTokenAuthProvider, createApiClient, TeamsFx } from "@microsoft/teamsfx";

const teamsfx = new TeamsFx();
const credential = teamsfx.getCredential();
const apiBaseUrl = teamsfx.getConfig("apiEndpoint") + "/api/";
// createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
const apiClient = createApiClient(
    apiBaseUrl,
    new BearerTokenAuthProvider(async () => (await credential.getToken(""))!.token));

export { apiClient };
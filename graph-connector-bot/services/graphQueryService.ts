import { OnBehalfOfUserCredential } from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import oboAuthConfig from "../authConfig";

export class GraphQueryService {
  private graphClient: Client;

  constructor(ssoToken: string) {
    const oboCredential = new OnBehalfOfUserCredential(ssoToken, oboAuthConfig);
    // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
    const authProvider = new TokenCredentialAuthenticationProvider(
      oboCredential,
      {
        scopes: ["ExternalItem.Read.All"],
      }
    );
    this.graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
  }

  async query(connectionId: string, query: string) {
    const searchContent = {
      requests: [
        {
          entityTypes: ["externalItem"],
          contentSources: [`/external/connections/${connectionId}`],
          query: {
            queryString: query,
          },
          from: 0,
          size: 25,
          fields: [
            "partNumber",
            "name",
            "description",
            "price",
            "inventory",
            "appliances",
          ],
        },
      ],
    };

    const result = await this.graphClient
      .api("/search/query")
      .version("beta")
      .post(searchContent);

    return result;
  }
}

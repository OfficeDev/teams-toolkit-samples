import { AppCredential } from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import authConfig from "../authConfig";

export class GraphService {
  private graphClient: Client;

  constructor() {
    const appCredential = new AppCredential(authConfig);
    const authProvider = new TokenCredentialAuthenticationProvider(
      appCredential,
      {
        scopes: ["https://graph.microsoft.com/.default"],
      }
    );
    this.graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
  }

  async createConnection(connection, connectorTicket: string) {
    await this.graphClient
      .api("/external/connections")
      .version("beta")
      .header("GraphConnectors-Ticket", connectorTicket)
      .post(connection);
  }

  async createSchema(connectionId: string, schema) {
    await this.graphClient
      .api(`/external/connections/${connectionId}/schema`)
      .version("beta")
      .post(schema);
  }

  async getConnection(connectionId: string) {
    return this.graphClient
      .api(`/external/connections/${connectionId}`)
      .version("beta")
      .get();
  }

  async createExternalItem(connectionId: string, itemId: string, externalItem) {
    await this.graphClient
      .api(`/external/connections/${connectionId}/items/${itemId}`)
      .version("beta")
      .put(externalItem);
  }

  async deleteConnection(connectionId: string) {
    await this.graphClient
      .api(`/external/connections/${connectionId}`)
      .version("beta")
      .delete();
  }
}

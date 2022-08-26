import { createMicrosoftGraphClient, IdentityType, TeamsFx } from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";

export class GraphService {
    private graphClient: Client;

    constructor() {
        const teamsfx = new TeamsFx(IdentityType.App);
        this.graphClient = createMicrosoftGraphClient(teamsfx);
    }

    async createConnection(connection, connectorTicket: string) {
        await this.graphClient.api("/external/connections")
            .version("beta")
            .header("GraphConnectors-Ticket", connectorTicket)
            .post(connection);
    }

    async createSchema(connectionId: string, schema) {
        await this.graphClient.api(`/external/connections/${connectionId}/schema`)
            .version("beta")
            .post(schema);
    }

    async getConnection(connectionId: string) {
        return this.graphClient.api(`/external/connections/${connectionId}`)
            .version("beta")
            .get();
    }

    async createExternalItem(connectionId: string, itemId: string, externalItem) {
        await this.graphClient.api(`/external/connections/${connectionId}/items/${itemId}`)
            .version("beta")
            .put(externalItem);
    }

    async deleteConnection(connectionId: string) {
        await this.graphClient.api(`/external/connections/${connectionId}`)
            .version("beta")
            .delete();
    }
}

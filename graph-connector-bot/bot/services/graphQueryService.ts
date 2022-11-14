import { createMicrosoftGraphClient, createMicrosoftGraphClientWithCredential, OnBehalfOfUserCredential } from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import oboAuthConfig from "../authConfig";

export class GraphQueryService {
    private graphClient: Client;

    constructor(ssoToken: string) {
        const oboCredential = new OnBehalfOfUserCredential(ssoToken, oboAuthConfig);
        this.graphClient = createMicrosoftGraphClientWithCredential(oboCredential, [
            "ExternalItem.Read.All",
        ]);
    }

    async query(connectionId: string, query: string) {
        const searchContent = {
            requests: [
                {
                    entityTypes: [
                        'externalItem'
                    ],
                    contentSources: [
                        `/external/connections/${connectionId}`
                    ],
                    query: {
                        queryString: query
                    },
                    from: 0,
                    size: 25,
                    fields: [
                        'partNumber',
                        'name',
                        'description',
                        'price',
                        'inventory',
                        'appliances'
                    ]
                }
            ]
        };

        const result = await this.graphClient.api('/search/query')
            .version('beta')
            .post(searchContent);

        return result;
    }

}

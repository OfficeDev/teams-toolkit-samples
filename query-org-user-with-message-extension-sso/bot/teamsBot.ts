import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext
} from "botbuilder";
import { ResponseType } from "@microsoft/microsoft-graph-client";
import { MessageExtensionTokenResponse, handleMessageExtensionQueryWithSSO, OnBehalfOfCredentialAuthConfig, OnBehalfOfUserCredential, createMicrosoftGraphClientWithCredential } from "@microsoft/teamsfx";
import "isomorphic-fetch";

const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
  authorityHost: process.env.M365_AUTHORITY_HOST,
  clientId: process.env.M365_CLIENT_ID,
  tenantId: process.env.M365_TENANT_ID,
  clientSecret: process.env.M365_CLIENT_SECRET,
};

const initialLoginEndpoint = process.env.INITIATE_LOGIN_ENDPOINT;

export class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();
  }

  // Search.
  public async handleTeamsMessagingExtensionQuery(context: TurnContext, query: any): Promise<any> {
    /**
     * User Code Here.
     * If query without token, no need to implement handleMessageExtensionQueryWithSSO;
     * Otherwise, just follow the sample code below to modify the user code.
     */
    return await handleMessageExtensionQueryWithSSO(context, oboAuthConfig, initialLoginEndpoint, ['User.Read.All', 'User.Read'], 
      async (token: MessageExtensionTokenResponse) => {
        // User Code

        const credential = new OnBehalfOfUserCredential(token.ssoToken, oboAuthConfig);
        const attachments = [];
        if (query.parameters[0] && query.parameters[0].name === 'initialRun') {
          const graphClient = createMicrosoftGraphClientWithCredential(credential, 'User.Read');
          const profile = await graphClient.api('/me').get();
          let photoBinary;
          try {
            photoBinary = await graphClient
              .api("/me/photo/$value")
              .responseType(ResponseType.ARRAYBUFFER)
              .get();
          } catch (err) {
            throw err;
          }
          const buffer = Buffer.from(photoBinary);
          const imageUri = "data:image/png;base64," + buffer.toString("base64");
          const thumbnailCard = CardFactory.thumbnailCard(profile.displayName, profile.mail, CardFactory.images([imageUri]));
          attachments.push(thumbnailCard);
        } else {
          const graphClient = createMicrosoftGraphClientWithCredential(credential, 'User.Read.All');
          const searchContext = query.parameters[0].value;
          let users = await graphClient.api(`/users?$search="displayName:${searchContext}"&$count=true`)
            .header('ConsistencyLevel', 'eventual')
            .orderby('displayName')
            .get();
          for(const user of users.value) {
            let photoBinary;
            try {
              photoBinary = await graphClient
                .api(`/users/${user.id}/photo/$value`)
                .responseType(ResponseType.ARRAYBUFFER)
                .get();
            } catch (err) {
              throw err;
            }
            const buffer = Buffer.from(photoBinary);
            const imageUri = "data:image/png;base64," + buffer.toString("base64");
            const thumbnailCard = CardFactory.thumbnailCard(user.displayName, user.mail, CardFactory.images([imageUri]));
            attachments.push(thumbnailCard);
          }
        }
        return {
          composeExtension: {
            type: 'result',
            attachmentLayout: 'list',
            attachments: attachments
          }
        };
      });
  }

  public async handleTeamsMessagingExtensionSelectItem(
    context: TurnContext,
    obj: any
  ): Promise<any> {
    return {
      composeExtension: {
        type: "result",
        attachmentLayout: "list",
        attachments: [CardFactory.heroCard(obj.name, obj.description)],
      },
    };
  }

}
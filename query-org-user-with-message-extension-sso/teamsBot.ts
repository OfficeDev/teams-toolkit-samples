import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext
} from "botbuilder";
import { ResponseType } from "@microsoft/microsoft-graph-client";
import { MessageExtensionTokenResponse, handleMessageExtensionQueryWithSSO, OnBehalfOfCredentialAuthConfig, OnBehalfOfUserCredential, createMicrosoftGraphClientWithCredential } from "@microsoft/teamsfx";
import "isomorphic-fetch";
import config from "./config";

const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
  authorityHost: config.authorityHost,
  clientId: config.clientId,
  tenantId: config.tenantId,
  clientSecret: config.clientSecret,
};

const initialLoginEndpoint = `https://${config.botDomain}/auth-start.html`;

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
          await this.getUserPhotoWithGraphClient(graphClient, attachments, profile, `/me/photo/$value`);
        } else {
          const graphClient = createMicrosoftGraphClientWithCredential(credential, 'User.Read.All');
          const searchContext = query.parameters[0].value;
          let users = await graphClient.api(`/users?$search="displayName:${searchContext}"&$count=true`)
            .header('ConsistencyLevel', 'eventual')
            .orderby('displayName')
            .get();
          for (const user of users.value) {
            await this.getUserPhotoWithGraphClient(graphClient, attachments, user, `/users/${user.id}/photo/$value`);
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

  private async getUserPhotoWithGraphClient(graphClient, attachments, user, apiPath) {
    let image = undefined;
    try {
      let photoBinary = await graphClient
        .api(apiPath)
        .responseType(ResponseType.ARRAYBUFFER)
        .get();
      const buffer = Buffer.from(photoBinary);
      const imageUri = "data:image/png;base64," + buffer.toString("base64");
      image = CardFactory.images([imageUri]);
    } catch (err) {
      console.error("This user may not have personal photo!", err.message)
    }
    const thumbnailCard = CardFactory.thumbnailCard(user.displayName, user.mail, image ? image : "");
    attachments.push(thumbnailCard);
  }

}
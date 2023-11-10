import { TeamsActivityHandler, CardFactory, TurnContext, AppBasedLinkQuery } from "botbuilder";
import { ResponseType, Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import {
  MessageExtensionTokenResponse,
  handleMessageExtensionQueryWithSSO,
  handleMessageExtensionLinkQueryWithSSO,
  OnBehalfOfCredentialAuthConfig,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
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
  public async handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: any
  ): Promise<any> {
    /**
     * User Code Here.
     * If query without token, no need to implement handleMessageExtensionQueryWithSSO;
     * Otherwise, just follow the sample code below to modify the user code.
     */
    return await handleMessageExtensionQueryWithSSO(
      context,
      oboAuthConfig,
      initialLoginEndpoint,
      ["User.Read.All", "User.Read"],
      async (token: MessageExtensionTokenResponse) => {
        // User Code

        const credential = new OnBehalfOfUserCredential(
          token.ssoToken,
          oboAuthConfig
        );
        const attachments = [];
        if (query.parameters[0] && query.parameters[0].name === "initialRun") {
          // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
          const authProvider = new TokenCredentialAuthenticationProvider(
            credential,
            {
              scopes: ["User.Read"],
            }
          );
          // Initialize Graph client instance with authProvider
          const graphClient = Client.initWithMiddleware({
            authProvider: authProvider,
          });
          const profile = await graphClient.api("/me").get();
          await this.getUserPhotoWithGraphClient(
            graphClient,
            attachments,
            profile,
            `/me/photo/$value`
          );
        } else {
          // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
          const authProvider = new TokenCredentialAuthenticationProvider(
            credential,
            {
              scopes: ["User.Read.All"],
            }
          );
          // Initialize Graph client instance with authProvider
          const graphClient = Client.initWithMiddleware({
            authProvider: authProvider,
          });
          const searchContext = query.parameters[0].value;
          let users = await graphClient
            .api(`/users?$search="displayName:${searchContext}"&$count=true`)
            .header("ConsistencyLevel", "eventual")
            .orderby("displayName")
            .get();
          for (const user of users.value) {
            await this.getUserPhotoWithGraphClient(
              graphClient,
              attachments,
              user,
              `/users/${user.id}/photo/$value`
            );
          }
        }
        return {
          composeExtension: {
            type: "result",
            attachmentLayout: "list",
            attachments: attachments,
          },
        };
      }
    );
  }

  public async handleTeamsAppBasedLinkQuery(context: TurnContext, query: AppBasedLinkQuery): Promise<any> {
    return await handleMessageExtensionLinkQueryWithSSO(context,
      oboAuthConfig,
      initialLoginEndpoint,
      ["User.Read"],
      async (token: MessageExtensionTokenResponse) => {
        const credential = new OnBehalfOfUserCredential(
          token.ssoToken,
          oboAuthConfig
        );
        const attachments = [];
        const authProvider = new TokenCredentialAuthenticationProvider(
          credential,
          {
            scopes: ["User.Read"],
          }
        );
        // Initialize Graph client instance with authProvider
        const graphClient = Client.initWithMiddleware({
          authProvider: authProvider,
        });
        const profile = await graphClient.api("/me").get();
        await this.getUserPhotoWithGraphClient(
          graphClient,
          attachments,
          profile,
          `/me/photo/$value`
        );
        return {
          composeExtension: {
            type: "result",
            attachmentLayout: "list",
            attachments: attachments,
          },
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

  private async getUserPhotoWithGraphClient(
    graphClient,
    attachments,
    user,
    apiPath
  ) {
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
      console.error("This user may not have personal photo!", err.message);
    }
    const thumbnailCard = CardFactory.thumbnailCard(
      user.displayName,
      user.mail,
      image ? image : ""
    );
    attachments.push(thumbnailCard);
  }
}

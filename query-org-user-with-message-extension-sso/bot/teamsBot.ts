import { default as axios } from "axios";
import * as querystring from "querystring";
import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext
} from "botbuilder";
// import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { ResponseType } from "@microsoft/microsoft-graph-client";
import { MessageExtensionTokenResponse, handleMessageExtensionQueryWithToken, TeamsFx, createMicrosoftGraphClient } from "@microsoft/teamsfx";
import "isomorphic-fetch";

// export interface DataInterface {
//   likeCount: number;
// }

export class TeamsBot extends TeamsActivityHandler {
  // record the likeCount
  likeCountObj: { likeCount: number };

  constructor() {
    super();
  }

  // Message extension Code
  // Action.
  // public async handleTeamsMessagingExtensionSubmitAction(
  //   context: TurnContext,
  //   action: any
  // ): Promise<any> {
  //   switch (action.commandId) {
  //     case "createCard":
  //       return createCardCommand(context, action);
  //     case "shareMessage":
  //       return shareMessageCommand(context, action);
  //     default:
  //       throw new Error("NotImplemented");
  //   }
  // }

  // Search.
  public async handleTeamsMessagingExtensionQuery(context: TurnContext, query: any): Promise<any> {
    /**
     * User Code Here.
     * If query without token, no need to implement handleMessageExntesionQueryWithToken;
     * Otherwise, just follow the sample code below to modify the user code.
     */
    return await handleMessageExtensionQueryWithToken(context, null, ['User.Read.All', 'User.Read'], 
      async (token: MessageExtensionTokenResponse) => {
        // User Code
        const teamsfx = new TeamsFx().setSsoToken(token.ssoToken);
        const attachments = [];
        if (query.parameters[0] && query.parameters[0].name === 'initialRun') {
          const graphClient = createMicrosoftGraphClient(teamsfx, 'User.Read');
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
          const graphClient = createMicrosoftGraphClient(teamsfx, 'User.Read.All');
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

// async function createCardCommand(context: TurnContext, action: any): Promise<any> {
//   // The user has chosen to create a card by choosing the 'Create Card' context menu command.
//   const data = action.data;
//   const heroCard = CardFactory.heroCard(data.title, data.text);
//   heroCard.content.subtitle = data.subTitle;
//   const attachment = {
//     contentType: heroCard.contentType,
//     content: heroCard.content,
//     preview: heroCard,
//   };

//   return {
//     composeExtension: {
//       type: "result",
//       attachmentLayout: "list",
//       attachments: [attachment],
//     },
//   };
// }

// async function shareMessageCommand(context: TurnContext, action: any): Promise<any> {
//   // The user has chosen to share a message by choosing the 'Share Message' context menu command.
//   let userName = "unknown";
//   if (
//     action.messagePayload &&
//     action.messagePayload.from &&
//     action.messagePayload.from.user &&
//     action.messagePayload.from.user.displayName
//   ) {
//     userName = action.messagePayload.from.user.displayName;
//   }

//   // This Message Extension example allows the user to check a box to include an image with the
//   // shared message.  This demonstrates sending custom parameters along with the message payload.
//   let images = [];
//   const includeImage = action.data.includeImage;
//   if (includeImage === "true") {
//     images = [
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtB3AwMUeNoq4gUBGe6Ocj8kyh3bXa9ZbV7u1fVKQoyKFHdkqU",
//     ];
//   }
//   const heroCard = CardFactory.heroCard(
//     `${userName} originally sent this message:`,
//     action.messagePayload.body.content,
//     images
//   );

//   if (
//     action.messagePayload &&
//     action.messagePayload.attachment &&
//     action.messagePayload.attachments.length > 0
//   ) {
//     // This sample does not add the MessagePayload Attachments.  This is left as an
//     // exercise for the user.
//     heroCard.content.subtitle = `(${action.messagePayload.attachments.length} Attachments not included)`;
//   }

//   const attachment = {
//     contentType: heroCard.contentType,
//     content: heroCard.content,
//     preview: heroCard,
//   };

//   return {
//     composeExtension: {
//       type: "result",
//       attachmentLayout: "list",
//       attachments: [attachment],
//     },
//   };
// }

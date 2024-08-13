import {
  AppBasedLinkQuery,
  CardFactory,
  ChannelInfo,
  MessagingExtensionResponse,
  MessagingExtensionAction,
  MessagingExtensionActionResponse,
  MessagingExtensionQuery,
  TaskModuleContinueResponse,
  TaskModuleMessageResponse,
  TeamsActivityHandler,
  TurnContext,
} from "botbuilder";
import axios from "axios";
import querystring from "querystring";
import npmSearchResultCard from "./adaptiveCards/npmSearchResultCard.json";
import actionMEFetchTaskCard from "./adaptiveCards/actionMEFetchTaskCard.json";
import actionMEFetchTaskCard1 from "./adaptiveCards/actionMEFetchTaskCard1.json";
import actionMEFetchTaskCard2 from "./adaptiveCards/actionMEFetchTaskCard2.json";
import actionMESubmitCard from "./adaptiveCards/actionMESubmitCard.json";
import actionMESubmitStaticCard from "./adaptiveCards/actionMESubmitStaticCard.json";
import * as ACData from "adaptivecards-templating";
import helloWorldCard from "./adaptiveCards/linkUnfurlingCard.json";
import o365ConnectorCard from "./adaptiveCards/o365ConnectorCard.json";
import { ActionCommandId } from "./messageExtension/actionCommands";
import { SearchCommandId } from "./messageExtension/searchCommands";

export class SimpleBot extends TeamsActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      if (context.activity.value) {
        const value = context.activity.value;
        if (value.action === "SubmitForm") {
          await context.sendActivity(`The form is submitted, your name is ${value.firstName} ${value.lastName}.`)
        }
      }

      await next();
    })

    // this.onInstallationUpdateAdd(async (context: TurnContext, next) => {
    //   await context.sendActivity("Thanks for installing me.");
    //   await next();
    // });

    // this.onInstallationUpdateRemove(async (context: TurnContext, next) => {
    //   await context.sendActivity("Thanks for uninstall me.");
    //   await next();
    // });

    // this.onMembersAdded(async (context: TurnContext, next) => {
    //   const idList = context.activity.membersAdded?.map((user) => `"${user.id}"`).join(",");
    //   await context.sendActivity(`Members added to conversation: ${idList}.`);
    //   await next();
    // });

    // this.onMembersRemoved(async (context: TurnContext, next) => {
    //   const idList = context.activity.membersRemoved?.map((user) => `"${user.id}"`).join(",");
    //   await context.sendActivity(`Members removed from conversation: ${idList}.`);
    //   await next();
    // });

    // this.onTeamsChannelCreatedEvent(
    //   async (channelInfo: ChannelInfo, teamInfo: TeamInfo, context: TurnContext, next) => {
    //     await context.sendActivity(
    //       `Create channel '${channelInfo.name}' in team: '${teamInfo.id}'`
    //     );
    //     await next();
    //   }
    // );

    // this.onTeamsChannelDeletedEvent(
    //   async (channelInfo: ChannelInfo, teamInfo: TeamInfo, context: TurnContext, next) => {
    //     await context.sendActivity(
    //       `Delete channel '${channelInfo.name}' in team: '${teamInfo.id}'`
    //     );
    //     await next();
    //   }
    // );

    // this.onTeamsChannelRenamedEvent(
    //   async (channelInfo: ChannelInfo, teamInfo: TeamInfo, context: TurnContext, next) => {
    //     await context.sendActivity(
    //       `Rename channel '${channelInfo.name}' in team: '${teamInfo.id}'`
    //     );
    //     await next();
    //   }
    // );

    // this.onTeamsTeamRenamedEvent(async (teamInfo: TeamInfo, context: TurnContext, next) => {
    //   await context.sendActivity(`Rename team '${teamInfo.name}'`);
    //   await next();
    // });

    // this.onTeamsTeamDeletedEvent(async (teamInfo: TeamInfo, context: TurnContext, next) => {
    //   await context.sendActivity(`Delete team '${teamInfo.name}'`);
    //   await next();
    // });
  }

  // Messaging Extension Search
  public async handleTeamsMessagingExtensionQuery(context: TurnContext, query: MessagingExtensionQuery): Promise<any> {
    if (query.commandId === SearchCommandId.Text) {
      return {
        composeExtension: {
          type: 'message',
          text: 'This is a message from the message extension app',
        }
      };
    } else if (query.commandId === SearchCommandId.O365) {
      return {
        composeExtension: {
          type: 'result',
          attachmentLayout: 'list',
          attachments: [
            o365ConnectorCard,
          ]
        }
      }
    }

    const searchQuery = query.parameters[0].value;
    const attachments = [];
    const response = await axios.get(`http://registry.npmjs.com/-/v1/search?${querystring.stringify({ text: searchQuery, size: 8 })}`);

    response.data.objects.forEach((obj) => {
      const imageUrl = `https://picsum.photos/seed/${Math.random()}/800/500`;
      const heroCard = CardFactory.heroCard(obj.package.name, [imageUrl], undefined, { subtitle: obj.package.version, text: obj.package.description })
      const thumbnailCard = CardFactory.thumbnailCard(obj.package.name, [imageUrl], undefined, { subtitle: obj.package.version, text: obj.package.description });
      const cardJson = new ACData.Template(npmSearchResultCard).expand({ $root: { ...obj.package, imageUrl } });
      const adaptiveCard = CardFactory.adaptiveCard(cardJson);
      if (query.commandId === SearchCommandId.Tap) {
        heroCard.content.tap = { type: 'invoke', value: { description: obj.package.description } };
      }
      if (query.commandId === SearchCommandId.HeroCard) {
        attachments.push(heroCard);
      } else if (query.commandId === SearchCommandId.HeroPreviewCard) {
        attachments.push({ ...adaptiveCard, preview: heroCard });
      } else {
        attachments.push({ ...adaptiveCard, preview: thumbnailCard });
      }
    });

    return {
      composeExtension: {
        type: 'result',
        attachmentLayout: query.commandId === SearchCommandId.Grid ? 'grid' : 'list',
        attachments: attachments
      }
    };
  }

  // Messaging Extension Action Fetch Task
  public async handleTeamsMessagingExtensionFetchTask(
    context: TurnContext,
    action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
    switch (action.commandId) {
      case ActionCommandId.MultipleCards:
        return {
          task: {
            type: 'continue',
            value: {
              card: CardFactory.adaptiveCard(actionMEFetchTaskCard1),
              title: "Report incident",
            }
          } as TaskModuleContinueResponse,
        };

      case ActionCommandId.FetchTaskMessage:
        return {
          task: {
            type: 'message',
            value: 'message info is not supported as fetch task response'
          } as TaskModuleMessageResponse,
        };

      case ActionCommandId.InvalidFetchTask:
        return {
          foo: 'bar'
        } as any;

      case ActionCommandId.Default:
      default:
        const title = action.messagePayload?.body?.content || "";
        const cardJson = new ACData.Template(actionMEFetchTaskCard).expand({ $root: title });

        return {
          task: {
            type: 'continue',
            value: {
              card: CardFactory.adaptiveCard(cardJson),
              title: "Report incident",
              height: 400,
              width: 300
            }
          } as TaskModuleContinueResponse,
        };
    }
  }

  // Messaging Extension Action Submit Action
  public async handleTeamsMessagingExtensionSubmitAction(
    context: TurnContext,
    action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
    const viewDetailsUrl = "https://docs.microsoft.com/en-us/adaptive-cards/";
    const data = Object.assign({}, action.data, {
      viewDetailsUrl,
    });

    switch (action.commandId) {
      case ActionCommandId.StaticCard:
        const fields = Object.entries(action.data)
          .map(([k, v]) => ({ ["name"]: k, ["value"]: v }));
        const card = new ACData.Template(actionMESubmitStaticCard).expand({ $root: fields });
        return {
          composeExtension: {
            type: 'result',
            attachmentLayout: 'list',
            attachments: [CardFactory.adaptiveCard(card)]
          }
        }
      case ActionCommandId.InvalidSubmitAction:
        return {
          foo: 'bar'
        } as any;

      case ActionCommandId.CardNotInsert:
        return {
          task: {
            type: 'message',
            value: 'Submit successfully without card insert'
          }
        }

      case ActionCommandId.EmbeddedWebview:
        return {
          task: {
            type: 'continue',
            value: {
              url: "https://adaptivecards.io/designer",
              title: "Adaptive Cards Designer"
            }
          } as TaskModuleContinueResponse
        }

      case ActionCommandId.PreviewEditCard:
        return {
          composeExtension: {
            type: "botMessagePreview",
            activityPreview: {
              type: "message",
              attachments: []
            } as any,
          }
        }

      case ActionCommandId.MultipleCards:
        if (action.data?.hasNext) {
          const cardJson = new ACData.Template(actionMEFetchTaskCard2).expand({ $root: data });
          return {
            task: {
              type: 'continue',
              value: {
                card: CardFactory.adaptiveCard(cardJson),
                title: "Report incident",
              }
            } as TaskModuleContinueResponse,
          };
        }

      case ActionCommandId.Default:
      default:
        const cardJson = new ACData.Template(actionMESubmitCard).expand({ $root: data });
        return {
          composeExtension: {
            type: 'result',
            attachmentLayout: 'list',
            attachments: [CardFactory.adaptiveCard(cardJson)]
          }
        };
    }
  }

  // Message Extension Link Unfurling.
  public async handleTeamsAppBasedLinkQuery(
    context: TurnContext,
    query: AppBasedLinkQuery
  ): Promise<MessagingExtensionResponse> {
    // When the returned card is an adaptive card, the previewCard property of the attachment is required.
    const previewCard = CardFactory.thumbnailCard("Preview Card", query.url, [
      "https://raw.githubusercontent.com/microsoft/botframework-sdk/master/icon.png",
    ]);

    const cardJson = new ACData.Template(helloWorldCard).expand({ $root: { link: query.url }  });
    const attachment = {
      ...CardFactory.adaptiveCard(cardJson),
      // preview: previewCard 
    };

    return {
      composeExtension: {
        type: "result",
        attachmentLayout: "list",
        attachments: [attachment],
        suggestedActions: {
          actions: [
            {
              title: "default",
              type: "setCachePolicy",
              value: '{"type":"no-cache"}',
            },
          ],
        },
      },
    };
  }

  // Zero Install Message Extension Link Unfurling.
  // This function can be triggered if this app sets "supportsAnonymizedPayloads": true in manifest and is uploaded to org's app catalog.
  public async handleTeamsAnonymousAppBasedLinkQuery(
    context: TurnContext,
    query: AppBasedLinkQuery
  ): Promise<MessagingExtensionResponse> {
    // When the returned card is an adaptive card, the previewCard property of the attachment is required.
    const previewCard = CardFactory.thumbnailCard("Preview Card", query.url, [
      "https://raw.githubusercontent.com/microsoft/botframework-sdk/master/icon.png",
    ]);

    const cardJson = new ACData.Template(helloWorldCard).expand({ $root: { link: query.url } });
    const attachment = { ...CardFactory.adaptiveCard(cardJson), preview: previewCard };

    return {
      composeExtension: {
        type: "result",
        attachmentLayout: "list",
        attachments: [attachment],
        suggestedActions: {
          actions: [
            {
              title: "default",
              type: "setCachePolicy",
              value: '{"type":"no-cache"}',
            },
          ],
        },
      },
    };
  }
}

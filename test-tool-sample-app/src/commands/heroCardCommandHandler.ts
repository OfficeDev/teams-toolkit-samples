import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import * as helpResponse from "../adaptiveCards/helpResponse.json";

export class HeroCardCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "herocard";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    // https://learn.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/cards-reference#example-of-a-hero-card
    const heroCardAttachment = {
      "contentType": "application/vnd.microsoft.card.hero",
      "content": {
        "title": "Seattle Center Monorail",
        "subtitle": "Seattle Center Monorail",
        "text": "The Seattle Center Monorail is an elevated train line between Seattle Center (near the Space Needle) and downtown Seattle. It was built for the 1962 World's Fair. Its original two trains, completed in 1961, are still in service.",
        "images": [
          {
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Seattle_monorail01_2008-02-25.jpg/1024px-Seattle_monorail01_2008-02-25.jpg"
          }
        ],
        "buttons": [
          {
            "type": "openUrl",
            "title": "Official website",
            "value": "https://www.seattlemonorail.com"
          },
          {
            "type": "messageBack",
            "title": "MessageBack",
            "value": {key: "key", value: "value"},
            "displayText": "MessageBack"
          }
        ]
      }
    }

    return MessageFactory.attachment(heroCardAttachment);
  }
}

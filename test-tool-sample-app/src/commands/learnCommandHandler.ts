import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import learnCard from "../adaptiveCards/learn.json";

export class LearnCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "learn";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    const cardData = {
      "likeCount": '0'
    };

    const cardJson = AdaptiveCards.declare(learnCard).render(cardData);
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

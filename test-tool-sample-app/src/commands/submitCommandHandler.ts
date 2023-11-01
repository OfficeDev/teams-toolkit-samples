import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import submitObjectCard from "../adaptiveCards/submit.json";

/**
 * The `SubmitCommandHandler` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */
export class SubmitCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = /submit/i;

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);
    const cardJson = AdaptiveCards.declare(submitObjectCard).render({});
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import * as ACData from "adaptivecards-templating";
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
    const cardJson = new ACData.Template(submitObjectCard).expand({ $root: {} });
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

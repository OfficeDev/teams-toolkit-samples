import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import * as ACData from "adaptivecards-templating";
import reportIncidentCard from "../adaptiveCards/reportIncidentResponse.json";

export class ReportIncidentCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "report incident";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    return MessageFactory.attachment(CardFactory.adaptiveCard(reportIncidentCard));
  }
}

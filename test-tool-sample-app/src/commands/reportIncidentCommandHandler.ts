import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import reportIncidentCard from "../adaptiveCards/reportIncidentResponse.json";

export class ReportIncidentCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "report incident";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    const cardJson = AdaptiveCards.declareWithoutData(reportIncidentCard).render();
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

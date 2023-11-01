import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { TurnContext, InvokeResponse, TeamsInfo } from "botbuilder";
import { TeamsFxAdaptiveCardActionHandler, InvokeResponseFactory } from "@microsoft/teamsfx";
import responseCard from "../adaptiveCards/incidentReportedResponse.json";

export class AssignIncidentActionHandler implements TeamsFxAdaptiveCardActionHandler {
  triggerVerb = "assignIncident";

  async handleActionInvoked(context: TurnContext, actionData: any): Promise<InvokeResponse> {
    const incidentId = Math.floor(Math.random() * 1000000);
    const viewDetailsUrl = "https://docs.microsoft.com/en-us/adaptive-cards/";

    const data = Object.assign({}, actionData, {
        incidentId,
        viewDetailsUrl,
    });
        
    const cardJson = AdaptiveCards.declare(responseCard).render(data);
    return InvokeResponseFactory.adaptiveCard(cardJson);
  }
}

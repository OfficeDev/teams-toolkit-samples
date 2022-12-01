import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { AdaptiveCardResponse, InvokeResponseFactory, TeamsFxAdaptiveCardActionHandler } from "@microsoft/teamsfx";
import { TurnContext, InvokeResponse } from "botbuilder";
import { OrderActionData, OrderResponseData } from "../cardModels";
import orderActionResponseCard from "../adaptiveCards/orderActionResponse.json";

export class OrderActionHandler implements TeamsFxAdaptiveCardActionHandler {

    triggerVerb: string = "order";

    async handleActionInvoked(context: TurnContext, actionData: OrderActionData): Promise<InvokeResponse<any>> {
        const orderRepsonseData: OrderResponseData = {
            title: "✅ [ACK] Order Placed",
            actionData
        };
        const cardJson = AdaptiveCards.declare(orderActionResponseCard).render(orderRepsonseData);
        return InvokeResponseFactory.adaptiveCard(cardJson);
    }
}

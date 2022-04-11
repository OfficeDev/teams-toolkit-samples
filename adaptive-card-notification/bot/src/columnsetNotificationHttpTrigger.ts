import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { CardData } from "./cardModels";
import { bot } from "./internal/initialize";
import notificationTemplate from "./adaptiveCards/notification-columnset.json";
import notificationData from "./adaptiveCards/notification-columnset.data.json";

// HTTP trigger to send notification.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  for (const target of await bot.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declare<CardData>(notificationTemplate).render(notificationData)
    );
  }

  context.res = {};
};

export default httpTrigger;

import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { bot } from "./internal/initialize";
import notificationTemplate from "./adaptiveCards/notification-list.json";
import notificationData from "./adaptiveCards/notification-list.data.json";

// HTTP trigger to send notification.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  for (const target of await bot.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declare(notificationTemplate).render(notificationData)
    );
  }

  context.res = {};
};

export default httpTrigger;

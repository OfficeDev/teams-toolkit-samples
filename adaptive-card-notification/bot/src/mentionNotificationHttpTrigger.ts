import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BotNotification } from "@microsoft/teamsfx";
import { buildAdaptiveCard } from "./adaptiveCard";
import notificationTemplate from "./adaptiveCards/notification-mention.json";
import notificationData from "./adaptiveCards/notification-mention.data.json";

// HTTP trigger to send notification.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  for (const target of await BotNotification.installations()) {
    await target.sendAdaptiveCard(
      buildAdaptiveCard(() => notificationData, notificationTemplate)
    );
  }

  context.res = {};
};

export default httpTrigger;

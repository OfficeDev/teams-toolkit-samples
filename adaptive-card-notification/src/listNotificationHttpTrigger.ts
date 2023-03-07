import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { notificationApp } from "./internal/initialize";
import notificationTemplate from "./adaptiveCards/notification-list.json";
import { ListData } from "./cardModels";

const data: ListData = {
  title: "New Event Occurred!",
  appName: "Contoso App",
  description: "Detailed description of what happened so the user knows what's going on.",
  notificationUrl: "https://www.adaptivecards.io/",
  data: [
    "list item 1",
    "list item 2",
    "list item 3"
  ]
};

// HTTP trigger to send notification.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  for (const target of await notificationApp.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declare<ListData>(notificationTemplate).render(data)
    );
  }

  context.res = {};
};

export default httpTrigger;

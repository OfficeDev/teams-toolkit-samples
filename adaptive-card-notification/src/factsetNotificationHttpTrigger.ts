import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { notificationApp } from "./internal/initialize";
import notificationTemplate from "./adaptiveCards/notification-factset.json";
import { FactsetData } from "./cardModels";

const data: FactsetData = {
  title: "New Event Occurred!",
  appName: "Contoso App",
  description: "Detailed description of what happened so the user knows what's going on.",
  notificationUrl: "https://www.adaptivecards.io/",
  factSet: {
    property1: "https://github.com/OfficeDev/TeamsFx",
    property2: "sample@contoso.com",
    property3: "2022-05-04",
  }
};

// HTTP trigger to send notification.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  for (const target of await notificationApp.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declare<FactsetData>(notificationTemplate).render(data)
    );
  }

  context.res = {};
};

export default httpTrigger;

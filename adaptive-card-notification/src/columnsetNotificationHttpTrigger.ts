import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { notificationApp } from "./internal/initialize";
import notificationTemplate from "./adaptiveCards/notification-columnset.json";
import { ColumnsetData } from "./cardModels";

const data: ColumnsetData = {
  title: "New Event Occurred!",
  appName: "Contoso App",
  description: "Detailed description of what happened so the user knows what's going on.",
  notificationUrl: "https://www.adaptivecards.io/",
  data: [
    {
      property1: "sample data",
      property2: "sample data",
      property3: "https://www.adaptivecards.io/",
    },
    {
      property1: "sample data",
      property2: "sample data",
      property3: "https://www.adaptivecards.io/",
    },
    {
      property1: "sample data",
      property2: "sample data",
      property3: "https://www.adaptivecards.io/",
    },
  ]
}

// HTTP trigger to send notification.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  for (const target of await notificationApp.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declare<ColumnsetData>(notificationTemplate).render(data)
    );
  }

  context.res = {};
};

export default httpTrigger;

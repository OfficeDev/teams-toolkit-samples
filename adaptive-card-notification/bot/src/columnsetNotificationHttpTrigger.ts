import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { bot } from "./internal/initialize";
import notificationTemplate from "./adaptiveCards/notification-columnset.json";

// HTTP trigger to send notification.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  for (const target of await bot.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declare(notificationTemplate).render({
        "title": "New Event Occurred!",
        "appName": "Contoso App",
        "description": "Detailed description of what happened so the user knows what's going on.",
        "notificationUrl": "https://www.adaptivecards.io/",
        "data": [
          {
            "property1": "sample data",
            "property2": "sample data",
            "property3": "https://www.adaptivecards.io/"
          },
          {
            "property1": "sample data",
            "property2": "sample data",
            "property3": "https://www.adaptivecards.io/"
          },
          {
            "property1": "sample data",
            "property2": "sample data",
            "property3": "https://www.adaptivecards.io/"
          }
        ]
      })
    );
  }
  
  context.res = {};
};

export default httpTrigger;

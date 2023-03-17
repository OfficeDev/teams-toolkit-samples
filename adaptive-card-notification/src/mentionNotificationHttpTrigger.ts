import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { notificationApp } from "./internal/initialize";
import notificationTemplate from "./adaptiveCards/notification-mention.json";
import { MentionData } from "./cardModels";

const data: MentionData = {
  title: "New Event Occurred!",
  appName: "Contoso App",
  userId: "<user-id>",
  userName: "<user-name>",
  description: "Detailed description of what happened so the user knows what's going on.",
  notificationUrl: "https://www.adaptivecards.io/"
};

// HTTP trigger to send notification.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  for (const target of await notificationApp.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declare<MentionData>(notificationTemplate).render(data)
    );

    /** List all members then notify each member
    for (const member of await target.members()) {
      data.userId = member.account.email;
      data.userName = member.account.name;
      await target.sendAdaptiveCard(
        AdaptiveCards.declare<MentionData>(notificationTemplate).render(data)
      );
    }
    */
  }

  context.res = {};
};

export default httpTrigger;

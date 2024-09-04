import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as ACData from "adaptivecards-templating";
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
  const pageSize = 100;
  let continuationToken: string | undefined;
  do {
    const pagedInstallations = await notificationApp.notification.getPagedInstallations(pageSize, continuationToken);
    continuationToken = pagedInstallations.continuationToken;
    const targets = pagedInstallations.data;
    for (const target of targets) {
      await target.sendAdaptiveCard(
        new ACData.Template(notificationTemplate).expand({ $root: data })
      );
    }
  } while (continuationToken);

  context.res = {};
};

export default httpTrigger;

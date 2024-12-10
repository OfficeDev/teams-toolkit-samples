import { TurnContext } from "botbuilder";
import * as ACData from "adaptivecards-templating";
import { app, InvocationContext } from "@azure/functions";
import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";

import config from "../internal/config";
import { notificationApp } from "../internal/initialize";
import { InstallationReference } from "../types/installationReference";
import notificationTemplate from "../adaptiveCards/notification-default.json";
import { constructConversationReference } from "../util";

export async function serviceBusQueueTrigger(
  mySbMsg: any,
  context: InvocationContext
): Promise<void> {
  const installationReference = JSON.parse(mySbMsg) as InstallationReference;
  const conversation = constructConversationReference(installationReference);
  const installation = new BotBuilderCloudAdapter.TeamsBotInstallation(
    notificationApp.adapter,
    conversation,
    config.MicrosoftAppId
  );

  await installation.sendAdaptiveCard(
    new ACData.Template(notificationTemplate).expand({
      $root: {
        title: "New Event Occurred!",
        appName: "Contoso App Notification",
        description: `This is a sample http-triggered notification to ${installation.type}`,
        notificationUrl: "https://aka.ms/teamsfx-notification-new",
      },
    }),
    (_: TurnContext, error: Error) => {
      throw error;
    }
  );
}

app.serviceBusQueue("serviceBusQueueTrigger", {
  connection: "ServiceBusConnection",
  queueName: "notification-messages",
  handler: serviceBusQueueTrigger,
});

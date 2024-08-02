import { TurnContext } from "botbuilder";

import { AzureFunction, Context } from "@azure/functions";
import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";

import config from "../internal/config";
import { notificationApp } from "../internal/initialize";
import { InstallationReference } from "../types/installationReference";
import { constructConversationReference } from "../util";

const serviceBusQueueTrigger: AzureFunction = async function (
  context: Context,
  mySbMsg: any
): Promise<void> {
  const installationReference = JSON.parse(mySbMsg) as InstallationReference;
  const conversation = constructConversationReference(installationReference);
  const installation = new BotBuilderCloudAdapter.TeamsBotInstallation(
    notificationApp.adapter,
    conversation,
    config.MicrosoftAppId
  );

  await installation.sendMessage(
    "Hello World!",
    (_: TurnContext, error: Error) => {
      throw error;
    }
  );
};

export default serviceBusQueueTrigger;

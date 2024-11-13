import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";

import {
  managedIdentityId,
  storageAccountName,
  storageTableName,
} from "../consts";
import config from "./config";
import { TableStore } from "./tableStore";

import ConversationBot = BotBuilderCloudAdapter.ConversationBot;
// Create bot.
export const notificationApp = new ConversationBot({
  // The bot id and password to create CloudAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: config,
  // Enable notification
  notification: {
    enabled: true,
    store: new TableStore(
      managedIdentityId,
      `https:${storageAccountName}.table.core.windows.net`,
      storageTableName
    ),
  },
});

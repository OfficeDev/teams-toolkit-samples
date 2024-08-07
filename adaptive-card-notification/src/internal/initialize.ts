import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;
import config from "./config";
import { BlobStore } from "../store/blobStore";

// Create bot.
export const notificationApp = new ConversationBot({
  // The bot id and password to create CloudAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: config,
  // Enable notification
  notification: {
    enabled: true,
    // uncomment following line to use your own blob store
    // store: new BlobStore("{your-connection-string}", "{your-container-name}"),
  },
});

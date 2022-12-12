import { ConversationBot } from "@microsoft/teamsfx";
import { BlobsStorage } from "../storage/blobsStorage";
import config from "./config";

// Create bot.
export const bot = new ConversationBot({
  // The bot id and password to create BotFrameworkAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    appId: config.botId,
    appPassword: config.botPassword,
  },
  // Enable notification
  notification: {
    enabled: true,
    // uncomment following line to use your own blob storage
    // storage: new BlobsStorage("{your-connection-string}", "{your-container-name}"),
  },
});

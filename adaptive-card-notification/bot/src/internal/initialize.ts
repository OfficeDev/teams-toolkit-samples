import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;
import { BlobsStorage } from "../storage/blobsStorage";

// Create bot.
export const bot = new ConversationBot({
  // The bot id and password to create CloudAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    MicrosoftAppId: process.env.BOT_ID,
    MicrosoftAppPassword: process.env.BOT_PASSWORD,
    MicrosoftAppType: "MultiTenant",
  },
  // Enable notification
  notification: {
    enabled: true,
    // uncomment following line to use your own blob storage
    // storage: new BlobsStorage("{your-connection-string}", "{your-container-name}"),
  },
});

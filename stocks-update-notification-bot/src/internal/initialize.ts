import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;

// Create bot.
export const notificationApp = new ConversationBot({
  // The bot id and password to create CloudAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    MicrosoftAppId: process.env.BOT_ID,
    MicrosoftAppType: process.env.BOT_TYPE,
    MicrosoftAppTenantId: process.env.BOT_TENANT_ID,
    MicrosoftAppPassword: process.env.BOT_PASSWORD,
  },
  // Enable notification
  notification: {
    enabled: true,
  },
});

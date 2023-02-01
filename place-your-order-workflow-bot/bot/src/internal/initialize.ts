import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;
import config from "./config";
import { OrderCommandHandler } from "../commands/orderCommandHandler";
import { OrderActionHandler } from "../cardActions/orderActionHander";

// Create the conversation bot and register the command and card action handlers for your app.
export const conversationBot = new ConversationBot({
  // The bot id and password to create BotFrameworkAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    MicrosoftAppId: config.botId,
    MicrosoftAppPassword: config.botPassword,
    MicrosoftAppType: "MultiTenant",
  },
  command: {
    enabled: true,
    commands: [new OrderCommandHandler()],
  },
  cardAction: {
    enabled: true,
    actions: [new OrderActionHandler()],
  },
});

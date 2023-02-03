import { ConversationBot } from "@microsoft/teamsfx";

import { HelloWorldCommandHandler } from "../helloworldCommandHandler";
import { ProfileSsoCommandHandler } from "../profileSsoCommandHandler";
import { PhotoSsoCommandHandler } from "../photoSsoCommandHandler";
import config from "./config";

// Create the command bot and register the command handlers for your app.
// You can also use the commandBot.command.registerCommands to register other commands
// if you don't want to register all of them in the constructor

export const commandBot = new ConversationBot({
  // The bot id and password to create BotFrameworkAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    appId: config.botId,
    appPassword: config.botPassword,
  },

  // See https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-sdk to learn more about ssoConfig
  ssoConfig: {
    aad: {
      scopes: ["User.Read"],
      initiateLoginEndpoint: `https://${config.botDomain}/auth-start.html`,
      authorityHost: config.authorityHost,
      clientId: config.clientId,
      tenantId: config.tenantId,
      clientSecret: config.clientSecret,
    },
  },
  command: {
    enabled: true,
    commands: [new HelloWorldCommandHandler()],
    ssoCommands: [new ProfileSsoCommandHandler(), new PhotoSsoCommandHandler()],
  },
});

import { DoStuffActionHandler } from "../cardActions/doStuffActionHandler";
import { HelloWorldCommandHandler } from "../commands/helloworldCommandHandler";
import { ConversationBot } from "@microsoft/teamsfx";
import config from "./config";
import { MembersCommandHandler } from "../commands/membersCommandHandler";
import { UserLikeActionHandler } from "../cardActions/userLikeActionHandler";
import { LearnCommandHandler } from "../commands/learnCommandHandler";
import { HelpCommandHandler } from "../commands/helpCommandHandler";
import { ShowCardCommandHandler } from "../commands/showCardCommandHandler";
import { HeroCardCommandHandler } from "../commands/heroCardCommandHandler";
import { ReportIncidentCommandHandler } from "../commands/reportIncidentCommandHandler";
import { AssignIncidentActionHandler } from "../cardActions/assignIncidentActionHandler";
import { SubmitCommandHandler } from "../commands/submitCommandHandler";
import { TypingCommandHandler } from "../commands/typingCommandHandler";
import { MarkdownCommandHandler } from "../commands/markdownCommandHandler";

// Create the conversation bot and register the command and card action handlers for your app.
export const conversationBot = new ConversationBot({
  // The bot id and password to create BotFrameworkAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    appId: config.botId,
    appPassword: config.botPassword,
  },
  notification: {
    enabled: true,
  },
  command: {
    enabled: true,
    commands: [
      new HelloWorldCommandHandler(),
      new MembersCommandHandler(),
      new LearnCommandHandler(),
      new HelpCommandHandler(),
      new ShowCardCommandHandler(),
      new HeroCardCommandHandler(),
      new ReportIncidentCommandHandler(),
      new SubmitCommandHandler(),
      new TypingCommandHandler(),
      new MarkdownCommandHandler(),
    ],
  },
  cardAction: {
    enabled: true,
    actions: [
      new DoStuffActionHandler(),
      new UserLikeActionHandler(),
      new AssignIncidentActionHandler(),
    ],
  },
});

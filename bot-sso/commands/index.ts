import { BotCommand, MatchTerm, SSOCommand } from "../helpers/botCommand";
import { LearnCommand } from "./learn";
import { ShowUserProfile } from "./showUserProfile";
import { WelcomeCommand } from "./welcome";

export const commands: BotCommand[] = [
  new LearnCommand(),
  new ShowUserProfile(),
  new WelcomeCommand(),
];

export const SSOCommands: SSOCommand[] = [
  new ShowUserProfile(),
];

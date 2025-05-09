import { BotCommand } from "../helpers/botCommand";
import { QueryCommand } from "./query";
import { WelcomeCommand } from "./welcome";

export const commands: BotCommand[] = [
  new QueryCommand(),
  new WelcomeCommand(),
];

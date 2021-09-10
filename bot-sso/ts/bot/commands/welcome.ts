import { BotCommand } from "../helplers/botCommand";
import { Utils } from "../helplers/utils";
const rawWelcomeCard = require("../adaptiveCards/welcome.json");

export class WelcomeCommand implements BotCommand {
  public commandKey = "welcome";

  async run(parameters: any): Promise<any> {
    const card = Utils.renderAdaptiveCard(rawWelcomeCard);
    return await parameters.context.sendActivity({ attachments: [card] });
  }
}

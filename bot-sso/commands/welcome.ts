import { BotCommand } from "../helpers/botCommand";
import { Utils } from "../helpers/utils";
const rawWelcomeCard = require("../adaptiveCards/welcome.json");

export class WelcomeCommand extends BotCommand {
  constructor() {
    super();
    this.matchPatterns = [/^\s*welcome\s*/];
  }

  async run(parameters: any): Promise<any> {
    const card = Utils.renderAdaptiveCard(rawWelcomeCard);
    return await parameters.context.sendActivity({ attachments: [card] });
  }
}

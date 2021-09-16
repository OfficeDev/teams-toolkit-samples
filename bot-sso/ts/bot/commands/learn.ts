import { BotCommand } from "../helpers/botCommand";
import { Utils } from "../helpers/utils";
const rawLearnCard = require("../adaptiveCards/learn.json");

export class LearnCommand extends BotCommand {
  constructor() {
    super();
    this.matchPatterns = [/^\s*learn\s*/];
  }

  validateParameters(parameters: any): boolean {
    if (!parameters.likeCount) {
      throw new Error(`Command "learn" failed: missing input "likeCount"`);
    }
    return true;
  }

  async run(parameters: any): Promise<any> {
    this.validateParameters(parameters);
    const card = Utils.renderAdaptiveCard(rawLearnCard, parameters.likeCount);
    return await parameters.context.sendActivity({ attachments: [card] });
  }
}

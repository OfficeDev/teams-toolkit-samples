import { BotCommand } from "../helpers/botCommand";
import { Utils } from "../helpers/utils";
const rawLearnCard = require("../adaptiveCards/learn.json");

export class LearnCommand extends BotCommand {
  constructor() {
    super();
    this.matchPatterns = [/^\s*learn\s*/];
  }

  async run(parameters: any): Promise<any> {
    if (!parameters.likeCount) {
      throw new Error(
        `Run "learn" command failed! Do not have input "likeCount"`
      );
    }
    const card = Utils.renderAdaptiveCard(rawLearnCard, parameters.likeCount);
    return await parameters.context.sendActivity({ attachments: [card] });
  }
}

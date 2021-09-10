import { BotCommand } from "../helplers/botCommand";
import { Utils } from "../helplers/utils";
const rawLearnCard = require("../adaptiveCards/learn.json");

export class LearnCommand implements BotCommand {
  public commandKey = "learn";

  async run(parameters: any): Promise<any> {
    if(!parameters.likeCount) {
      throw new Error(`Run "learn" command failed! Do not have input "likeCount"`);
    }
    const card = Utils.renderAdaptiveCard(rawLearnCard, parameters.likeCount);
    return await parameters.context.sendActivity({ attachments: [card] });
  }
}

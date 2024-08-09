import * as ACData from "adaptivecards-templating";
import { TurnContext, InvokeResponse } from "botbuilder";
import { TeamsFxAdaptiveCardActionHandler, InvokeResponseFactory, AdaptiveCardResponse } from "@microsoft/teamsfx";
import learnCard from "../adaptiveCards/learn.json";

export class UserLikeActionHandler implements TeamsFxAdaptiveCardActionHandler {
  /**
   * A global unique string associated with the `Action.Execute` action.
   * The value should be the same as the `verb` property which you define in your adaptive card JSON.
   */
  triggerVerb = "userlike";
  adaptiveCardResponse = AdaptiveCardResponse.ReplaceForAll;

  async handleActionInvoked(context: TurnContext, actionData: any): Promise<InvokeResponse> {
    console.log(actionData);
    const count = parseInt(actionData['likeCount'], 10);
    const cardJson = new ACData.Template(learnCard).expand({ $root: {'likeCount': `${count+1}`} });
    return InvokeResponseFactory.adaptiveCard(cardJson);
  }
}

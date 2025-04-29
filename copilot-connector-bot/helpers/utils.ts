import { CardFactory, Attachment } from "botbuilder";
import ACData = require("adaptivecards-templating");
import config from "../config";

export class Utils {
  // Bind AdaptiveCard with data
  static renderAdaptiveCard(rawCardTemplate: any, dataObj?: any): Attachment {
    const cardTemplate = new ACData.Template(rawCardTemplate);
    const cardWithData = cardTemplate.expand({ $root: dataObj });
    const card = CardFactory.adaptiveCard(cardWithData);
    return card;
  }

  static getConnectionId(): string {
    return config.MicrosoftAppId.replace(/[^A-Za-z0-9]/g, '');
  }
}

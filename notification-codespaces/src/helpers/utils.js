const { CardFactory } = require("botbuilder");
const ACData = require("adaptivecards-templating");

class Utils {
  // Bind AdaptiveCard with data
  static renderAdaptiveCard(rawCardTemplate, dataObj) {
    const cardTemplate = new ACData.Template(rawCardTemplate);
    const cardWithData = cardTemplate.expand({ $root: dataObj });
    const card = CardFactory.adaptiveCard(cardWithData);
    return card;
  }
}

module.exports = {
    Utils
}
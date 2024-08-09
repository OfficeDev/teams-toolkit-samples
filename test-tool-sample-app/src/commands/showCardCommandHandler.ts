import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import * as agendaCard from "../adaptiveCards/agenda.json";
import * as flightCard from "../adaptiveCards/flightDetails.json";
import * as listCard from "../adaptiveCards/list.json";
import * as factsetCard from "../adaptiveCards/factset.json";
import * as columnsetCard from "../adaptiveCards/columnset.json";
import { FactsetData, ListData, ColumnsetData } from "../cardModels";
import * as ACData from "adaptivecards-templating";

const listData: ListData = {
  title: "New Event Occurred!",
  appName: "Contoso App",
  description: "Detailed description of what happened so the user knows what's going on.",
  notificationUrl: "https://www.adaptivecards.io/",
  data: [
    "list item 1",
    "list item 2",
    "list item 3"
  ]
};

const factsetData: FactsetData = {
  title: "New Event Occurred!",
  appName: "Contoso App",
  description: "Detailed description of what happened so the user knows what's going on.",
  notificationUrl: "https://www.adaptivecards.io/",
  factSet: {
    property1: "https://github.com/OfficeDev/TeamsFx",
    property2: "sample@contoso.com",
    property3: "2022-05-04",
  }
};

const columnsetData: ColumnsetData = {
  title: "New Event Occurred!",
  appName: "Contoso App",
  description: "Detailed description of what happened so the user knows what's going on.",
  notificationUrl: "https://www.adaptivecards.io/",
  data: [
    {
      property1: "sample data",
      property2: "sample data",
      property3: "https://www.adaptivecards.io/",
    },
    {
      property1: "sample data",
      property2: "sample data",
      property3: "https://www.adaptivecards.io/",
    },
    {
      property1: "sample data",
      property2: "sample data",
      property3: "https://www.adaptivecards.io/",
    },
  ]
}

export class ShowCardCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = /show\s+(\w+)/;

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    const cards = {
      "agenda": [agendaCard, {}],
      "flight": [flightCard, {}],
      "list": [listCard, listData],
      "factset": [factsetCard, factsetData],
      "columnset": [columnsetCard, columnsetData],
    }

    const cardName = message.matches?.[1];
    if (!(cardName in cards)) {
      return `Unknown command "${message.text}"`;
    }

    const [cardTemplate, cardData] = cards[cardName];
    const cardJson = new ACData.Template(cardTemplate).expand({ $root: cardData });
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

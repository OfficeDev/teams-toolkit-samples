import { TurnContext } from "botbuilder";
import { SSOCommand } from "../helpers/botCommand";
import { GraphQueryService } from "../services/graphQueryService";
import { Utils } from "../helpers/utils";
const rawQueryCard = require("../adaptiveCards/query.json");

export class QueryCommand extends SSOCommand {
  constructor() {
    super();
    this.matchPatterns = [/^\s*query\s*.*/];
    this.operationWithSSOToken = this.query;
  }

  async query(context: TurnContext, text: string, ssoToken: string) {
    await context.sendActivity("Querying data from Microsoft Graph connectors ...");

    try {
      const graphQueryService = new GraphQueryService(ssoToken);

      const connectionId = Utils.getConnectionId();
      const query = text.substring(6);
      const result = await graphQueryService.query(connectionId, query);

      const hitsContainer = result.value[0].hitsContainers[0];
      const count = hitsContainer.total;

      if (count > 0) {
        await context.sendActivity(`Total count: ${count}`);
        const items: any[] = hitsContainer.hits;
        const dataObj = {
          data: []
        }
        items.forEach((element) => {
          const properties = element.resource.properties;
          dataObj.data.push({
            partNumber: properties.partNumber.toString(),
            name: properties.name,
            description: properties.description,
            price: properties.price.toString(),
            inventory: properties.inventory.toString(),
            appliances: properties.appliances.join(','),
          });
        })

        const card = Utils.renderAdaptiveCard(rawQueryCard, dataObj);
        await context.sendActivity({ attachments: [card] });
      } else {
        await context.sendActivity("No items are found!");
      }
    } catch (error) {
      if (error?.message && error.message.includes("No connection setting found")) {
        return await context.sendActivity("No connection found! Please make sure Graph Connector is turned on in Microsoft Teams admin center and wait for connection is created.");
      }
      throw error;
    }
  }
}

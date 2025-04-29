import express from "express";
import { ConnectionState, TargetConnectorState } from "./constants";
import { GraphService } from "./graphService";
import { Utils } from "./utils";
import { Utils as BotUtils } from "../helpers/utils";
import { readFile } from "fs/promises";
import * as path from "path";
import { parse } from "csv-parse/sync";
import config from "../config";

export class NotificationHandler {
  static async processGraphWebhookChangeNotification(req: express.Request) {
    console.log("Received Graph Webhook Change Notification.");
    const validationToken = req.body?.validationTokens[0];

    await Utils.validateToken(
      validationToken,
      config.tenantId,
      config.clientId
    );

    const graphService = new GraphService();
    const connectionId = BotUtils.getConnectionId();
    const changeDetails = req.body?.value[0]?.resourceData;
    const targetConnectorState = changeDetails?.state;
    console.log("Connector State: " + targetConnectorState);

    if (targetConnectorState === TargetConnectorState.Enabled) {
      const connectorId = changeDetails?.id;
      const connectorTicket = changeDetails?.connectorsTicket;
      const connection = {
        id: connectionId,
        name: "Sample connection",
        description: "Sample connection description",
        connectorId,
      };

      await graphService.createConnection(connection, connectorTicket);

      const schema = {
        baseType: "microsoft.graph.externalItem",
        properties: [
          {
            name: "partNumber",
            type: "int64",
            isSearchable: false,
            isRetrievable: true,
            isQueryable: true,
            labels: [],
            aliases: [],
          },
          {
            name: "name",
            type: "string",
            isSearchable: true,
            isRetrievable: true,
            isQueryable: true,
            labels: [],
            aliases: [],
          },
          {
            name: "description",
            type: "string",
            isSearchable: true,
            isRetrievable: true,
            isQueryable: false,
            labels: [],
            aliases: [],
          },
          {
            name: "price",
            type: "double",
            isSearchable: false,
            isRetrievable: true,
            isQueryable: true,
            labels: [],
            aliases: [],
          },
          {
            name: "inventory",
            type: "int64",
            isSearchable: false,
            isRetrievable: true,
            isQueryable: true,
            labels: [],
            aliases: [],
          },
          {
            name: "appliances",
            type: "stringCollection",
            isSearchable: true,
            isRetrievable: true,
            isQueryable: true,
            labels: [],
            aliases: [],
          },
        ],
      };

      await graphService.createSchema(connectionId, schema);

      let state: string;
      do {
        await Utils.sleep(1000);
        state = (await graphService.getConnection(connectionId)).state;
        console.log("Connection State: " + state);
      } while (state !== ConnectionState.Ready);

      const csvFileContent = (
        await readFile(
          path.join(__dirname, "..", "assets", "ApplianceParts.csv")
        )
      ).toString();
      const records = parse(csvFileContent, {
        columns: true,
        skip_empty_lines: true,
      });

      for (const item of records) {
        const externalItem = {
          acl: [
            {
              type: "everyone",
              value: "c5f19b2d-0a77-454a-9b43-abf298c3b34e",
              accessType: "grant",
            },
          ],
          properties: {
            partNumber: Number(item.PartNumber),
            name: item.Name,
            description: item.Description,
            price: Number(item.Price),
            inventory: Number(item.Inventory),
            appliances: item.Appliances.split(";"),
            "appliances@odata.type": "Collection(String)",
          },
          content: {
            type: "text",
            value: item.Description,
          },
        };
        await graphService.createExternalItem(
          connectionId,
          item.PartNumber,
          externalItem
        );
      }
      console.log("Processed 'enabled' event.");
    } else if (targetConnectorState === TargetConnectorState.Disabled) {
      await graphService.deleteConnection(connectionId);
      console.log("Processed 'disabled' event.");
    }
  }
}

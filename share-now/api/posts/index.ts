// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import "isomorphic-fetch";
import { Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import {
  createMicrosoftGraphClient,
  loadConfiguration,
  OnBehalfOfUserCredential,
  UserInfo,
  DefaultTediousConnectionConfiguration
} from "teamsdev-client";
import * as tedious from "tedious";

interface Response {
  status: number;
  body: { [key: string]: any; };
}

type TeamsfxContext = { [key: string]: any; };

export default async function run(
  context: Context,
  req: HttpRequest,
  teamsfxContext: TeamsfxContext
): Promise<Response> {
  context.log("HTTP trigger function processed a request.");

  // Initialize response.
  const res: Response = {
    status: 200,
    body: {}
  };

  // Set default configuration for teamsfx SDK.
  try {
    loadConfiguration();
  } catch (e) {
    context.log.error(e);
    return {
      status: 500,
      body: {
        error: 'Failed to load app configuration.'
      }
    };
  }

  // Prepare access token.
  const accessToken: string = teamsfxContext["AccessToken"];
  if (!accessToken) {
    return {
      status: 400,
      body: {
        error: "No access token was found in request header."
      }
    };
  }

  // Construct credential.
  let credential: OnBehalfOfUserCredential;
  try {
    credential = new OnBehalfOfUserCredential(accessToken);
  } catch (e) {
    context.log.error(e);
    return {
      status: 500,
      body: {
        error:
          'Failed to obtain on-behalf-of credential using your accessToken. ' +
          'Ensure your function app is configured with the right Azure AD App registration.'
      }
    };
  }

  const currentUser = await credential.getUserInfo();

  const method = req.method.toLowerCase();
  if (method === "get") {
    const pageCount = req.query.pageCount ? Number(req.query.pageCount) : 0;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 2;
    context.log(`pageCount ${pageCount} pageSize ${pageSize}`);

    try {
      const sqlConnectConfig = new DefaultTediousConnectionConfiguration();
      const config = await sqlConnectConfig.getConfig();
      const conn = new tedious.Connection(config);
      await connectSQL(conn);

      let query = `SELECT * FROM [dbo].[TeamPostEntity] ORDER BY PostID DESC OFFSET ${pageSize * pageCount} ROWS FETCH NEXT ${pageSize} ROWS ONLY;`;

      var result = await executeQuery(query, conn);
      res.body["data"] = result;

      conn.close();
    } catch (e) {
      res.status = 500;
      res.body = {
        error: "sql error:" + e.message
      };
      return res;
    }
    return res;
  } else if (method === "post") {
    try {
      const sqlConnectConfig = new DefaultTediousConnectionConfiguration();
      const config = await sqlConnectConfig.getConfig();
      const conn = new tedious.Connection(config);
      await connectSQL(conn);

      let query = `INSERT TeamPostEntity (ContentUrl, CreatedByName, CreatedDate, Description, IsRemoved, Tags, Title, TotalVote, Type, UpdatedDate, UserID) VALUES ('https://bing.com','zhaofeng xu', CURRENT_TIMESTAMP, 'hello', 0, 'red', 'manual post', 0,1, CURRENT_TIMESTAMP, '${currentUser.objectId}');`;

      var result = await executeQuery(query, conn);
      res.body["data"] = "create post successfully";

      conn.close();
    } catch (e) {
      res.status = 500;
      res.body = {
        error: "sql error:" + e.message
      };
      return res;
    }
    return res;
  }
}

function connectSQL(connection) {
  return new Promise((resolve) => {
    connection.on("connect", (error) => {
      resolve(connection);
    });
  });
}

function executeQuery(query, connection) {
  return new Promise((resolve) => {
    var res = [];
    const request = new tedious.Request(query, (err) => {
      if (err) {
        console.log(err);
      }
    });
    request.on("row", (columns) => {
      var row = {};
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value;
      });
      res.push(row);
    });
    request.on("requestCompleted", () => {
      resolve(res);
    });
    connection.execSql(request);
  });
}
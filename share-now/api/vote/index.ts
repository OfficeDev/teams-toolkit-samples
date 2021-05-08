// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import "isomorphic-fetch";
import { Context, HttpRequest } from "@azure/functions";
import {
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
  const postID = context.bindingData.id as number;

  const method = req.method.toLowerCase();
  if (method === "post") {
    try {
      const sqlConnectConfig = new DefaultTediousConnectionConfiguration();
      const config = await sqlConnectConfig.getConfig();
      const conn = new tedious.Connection(config);
      await connectSQL(conn);
      let query = `select count(*) as count from [dbo].[TeamPostEntity] where PostID = ${postID};`;
      var result = await executeQuery(query, conn);
      if (result.length === 0 || result[0].count === 0) {
        conn.close();
        res.status = 500;
        res.body = {
          error: `PostID ${postID} is invalid`
        };
        return res;
      }
      query = `select count(*) as count from [dbo].[UserVoteEntity] where UserID = '${currentUser.objectId}' and PostID = ${postID};`;
      var result = await executeQuery(query, conn);
      if (result.length && result[0].count !== 0) {
        conn.close();
        res.body["data"] = "already voted";
        return res;
      }
      query = `INSERT [dbo].[UserVoteEntity] (PostID, UserID) VALUES (${postID},'${currentUser.objectId}');`;
      context.log(query);
      await executeQuery(query, conn);
      query = `update [dbo].[TeamPostEntity] set totalVote = totalVote + 1 where PostID = ${postID};`;
      context.log(query);
      await executeQuery(query, conn);
      conn.close();
      res.body["data"] = "vote successfully";
      return res;
    } catch (e) {
      res.status = 500;
      res.body = {
        error: "sql error:" + e.message
      };
      return res;
    }
  } else if (method === "delete") {
    try {
      const sqlConnectConfig = new DefaultTediousConnectionConfiguration();
      const config = await sqlConnectConfig.getConfig();
      const conn = new tedious.Connection(config);
      await connectSQL(conn);
      let query = `select count(*) as count from [dbo].[TeamPostEntity] where PostID = ${postID};`;
      var result = await executeQuery(query, conn);
      if (result.length === 0 || result[0].count === 0) {
        conn.close();
        res.status = 500;
        res.body = {
          error: `PostID ${postID} is invalid`
        };
        return res;
      }
      query = `select count(*) as count from [dbo].[UserVoteEntity] where UserID = '${currentUser.objectId}' and PostID = ${postID};`;
      var result = await executeQuery(query, conn);
      if (result.length && result[0].count === 0) {
        conn.close();
        return res;
      }
      query = `delete [dbo].[UserVoteEntity] where UserID = '${currentUser.objectId}' and PostID = ${postID};`;
      await executeQuery(query, conn);
      query = `update [dbo].[TeamPostEntity] set totalVote = totalVote - 1 where PostID = ${postID};`;
      await executeQuery(query, conn);
      conn.close();
      return res;
    } catch (e) {
      res.status = 500;
      res.body = {
        error: "sql error:" + e.message
      };
      return res;
    }
  } else {
    res.status = 500;
    res.body = {
      error: "invalid method"
    };
    return res;
  }
}

async function connectSQL(connection) {
  return new Promise((resolve) => {
    connection.on("connect", (error) => {
      resolve(connection);
    });
  });
}

async function executeQuery(query, connection):Promise<any[]> {
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
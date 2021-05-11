// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import "isomorphic-fetch";
import { Context, HttpRequest } from "@azure/functions";
import {
  loadConfiguration,
  OnBehalfOfUserCredential,
} from "teamsdev-client";
import { executeQuery, getSQLConnection } from "../utils/common";

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
  context.log("HTTP trigger function processed a post request.");

  // Initialize response.
  const res: Response = {
    status: 200,
    body: {}
  };

  let connection;
  loadConfiguration();
  try {
    connection = await getSQLConnection();
    const method = req.method.toLowerCase();
    const accessToken: string = teamsfxContext["AccessToken"];
    const credential = new OnBehalfOfUserCredential(accessToken);
    const currentUser = await credential.getUserInfo();
    
    let query;

    switch (method) {
      case "get":
        const pageCount = req.query.pageCount ? Number(req.query.pageCount) : 0;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 2;
        query = `SELECT * FROM [dbo].[TeamPostEntity] ORDER BY PostID DESC OFFSET ${pageSize * pageCount} ROWS FETCH NEXT ${pageSize} ROWS ONLY;`;
        const result = await executeQuery(query, connection);
        res.body["data"] = result;
        return res;
      case "post":
        query = `INSERT TeamPostEntity (ContentUrl, CreatedByName, CreatedDate, Description, IsRemoved, Tags, Title, TotalVote, Type, UpdatedDate, UserID) VALUES ('https://bing.com','zhaofeng xu', CURRENT_TIMESTAMP, 'hello', 0, 'red', 'manual post', 0,1, CURRENT_TIMESTAMP, '${currentUser.objectId}');`;
        await executeQuery(query, connection);
        res.body["data"] = "create post successfully";
        return res;
    }
  } catch (error) {
    return {
      status: 500,
      body: error.message
    };
  } finally {
    if (connection) {
      connection.close();
    }
  }
}
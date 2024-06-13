// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import "isomorphic-fetch";
import { HttpRequest, HttpResponseInit, InvocationContext, app } from "@azure/functions";
import { OnBehalfOfCredentialAuthConfig, OnBehalfOfUserCredential } from "@microsoft/teamsfx";
import { executeQuery, getSQLConnection } from "../utils/common";
import { checkPost } from "../utils/query";
import config from "../config";

interface Response {
  status: number;
  body: any;
}

const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
  authorityHost: config.authorityHost,
  clientId: config.clientId,
  tenantId: config.tenantId,
  clientSecret: config.clientSecret,
};

export default async function vote(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a vote request.");

  // Initialize response.
  const res: Response = {
    status: 200,
    body: {}
  };
  
  let connection;
  try {
    connection = await getSQLConnection();
    const method = req.method.toLowerCase();
    const accessToken: string = req.headers
    .get("Authorization")
    ?.replace("Bearer ", "")
    .trim();

    const oboCredential = new OnBehalfOfUserCredential(accessToken, oboAuthConfig);
    const currentUser = await oboCredential.getUserInfo();

    const postID = +req.params.id;;
    const checkRes = await checkPost(postID, connection);
    if (!checkRes) {
      throw new Error(`invalid postID ${postID}`);
    }

    let query;
    if (method === "post") {
      const voted = await checkVoted(postID, currentUser.objectId, connection);
      if (voted) {
        res.body = "already voted";
        return res;
      }
      query = `INSERT [dbo].[UserVoteEntity] (PostID, UserID) VALUES (${postID},'${currentUser.objectId}');`;
      await executeQuery(query, connection);
      await updateVoteCount(postID, true, connection)
      res.body = "vote successfully";
      return res;
    } else if (method === "delete") {
      const voted = await checkVoted(postID, currentUser.objectId, connection);
      if (!voted) {
        res.body = "haven't voted";
        return res;
      }
      query = `delete [dbo].[UserVoteEntity] where UserID = '${currentUser.objectId}' and PostID = ${postID};`;
      await executeQuery(query, connection);
      await updateVoteCount(postID, false, connection)
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

async function checkVoted(postID, userID, conn): Promise<boolean> {
  let query = `select count(*) as count from [dbo].[UserVoteEntity] where UserID = '${userID}' and PostID = ${postID};`;
  var result = await executeQuery(query, conn);
  if (result.length === 0 || result[0].count === 0) {
    return false;
  } else {
    return true;
  }
}

async function updateVoteCount(postID, isAdd, conn) {
  let flag = isAdd ? '+' : '-';
  let query = `update [dbo].[TeamPostEntity] set totalVotes = totalVotes ${flag} 1 where PostID = ${postID};`;
  await executeQuery(query, conn);
}

app.http("vote", {
  methods: ["POST", "DELETE"],
  authLevel: "anonymous",
  route: 'vote/{id:int?}',
  handler: vote,
});
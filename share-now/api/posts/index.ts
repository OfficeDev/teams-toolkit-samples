// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import "isomorphic-fetch";
import { Context, HttpRequest } from "@azure/functions";
import {
  loadConfiguration,
  OnBehalfOfUserCredential,
} from "teamsdev-client";
import { executeQuery, getSQLConnection, PostRequest, ResponsePost } from "../utils/common";

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
    let postID;

    switch (method) {
      case "get":
        const pageCount = req.query.pageCount ? Number(req.query.pageCount) : 0;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 8;
        query = `SELECT * FROM [dbo].[TeamPostEntity] where IsRemoved = 0 ORDER BY PostID DESC OFFSET ${pageSize * pageCount} ROWS FETCH NEXT ${pageSize} ROWS ONLY;`;
        const posts = await executeQuery(query, connection);
        const data = await decoratePosts(posts, currentUser.objectId, connection);
        res.body["data"] = data;
        return res;
      case "post":
        const createRequest = getPostRequest(req);
        query = `INSERT TeamPostEntity (ContentUrl, CreatedByName, CreatedDate, Description, IsRemoved, Tags, Title, TotalVotes, Type, UpdatedDate, UserID) VALUES ('${createRequest.contentUrl}','${currentUser.displayName}', CURRENT_TIMESTAMP, '${createRequest.description}', 0, '${createRequest.tags}', '${createRequest.title}', 0,${createRequest.type}, CURRENT_TIMESTAMP, '${currentUser.objectId}');`;
        await executeQuery(query, connection);
        res.body["data"] = "create post successfully";
        return res;
      case "delete":
        postID = context.bindingData.id as number;
        query = `update TeamPostEntity set IsRemoved = 1 where PostID = ${postID}`;
        await executeQuery(query, connection);
        res.body["data"] = "delete post successfully";
        return res;
      case "put":
        postID = context.bindingData.id as number;
        const updateRequest = getPostRequest(req);
        query = `update TeamPostEntity set ContentUrl = '${updateRequest.contentUrl}', Description = '${updateRequest.description}', Tags = '${updateRequest.tags}', Title = '${updateRequest.title}', Type = ${updateRequest.type}, UpdatedDate = CURRENT_TIMESTAMP where PostID = ${postID};`;
        await executeQuery(query, connection);
        res.body["data"] = "update post successfully";
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

async function decoratePosts(posts, userID, connection) {
  if (posts.length === 0) {
    return [];
  }
  let postIDs = posts.map(post => post.PostID);
  let query = `select PostID from [dbo].[UserVoteEntity] where UserID = '${userID}' and PostID in (${postIDs.join(',')});`;
  const result = await executeQuery(query, connection);
  let votedPostIDs = result.map(post => post.PostID);
  let elements = posts.map(post => {
    let element = new ResponsePost(post);
    element.isCurrentUserPost = element.userId.toLowerCase() === userID.toLowerCase() ? true : false;
    element.isVotedByUser = votedPostIDs.includes(element.postId) ? true : false;
    return element;
  });
  return elements;
}

function getPostRequest(req: HttpRequest) {
  let res = new PostRequest();
  res.type = req.body.type ?? 1;
  res.title = req.body.title ?? "automatic post";
  res.description = req.body.description ?? "hello";
  res.contentUrl = req.body.contentUrl ?? "https://bing.com";
  res.tags = req.body.tags ?? "";
  
  if (res.type in [1,2,3,4,5] === false) {
    throw new Error("invalid input for type")
  }
  return res;
}
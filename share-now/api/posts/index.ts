// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import "isomorphic-fetch";
import { Context, HttpRequest } from "@azure/functions";
import { OnBehalfOfCredentialAuthConfig, OnBehalfOfUserCredential } from "@microsoft/teamsfx";
import { executeQuery, getSQLConnection, PostRequest, PostTypes, ResponsePost, LengthLimit } from "../utils/common";
import { checkPost } from "../utils/query";

interface Response {
  status: number;
  body: any;
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
  try {
    connection = await getSQLConnection();
    const method = req.method.toLowerCase();
    const accessToken: string = teamsfxContext["AccessToken"];
    const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
      authorityHost: process.env.M365_AUTHORITY_HOST,
      clientId: process.env.M365_CLIENT_ID,
      tenantId: process.env.M365_TENANT_ID,
      clientSecret: process.env.M365_CLIENT_SECRET,
    };
    
    const oboCredential = new OnBehalfOfUserCredential(accessToken, oboAuthConfig);
    
    const currentUser = await oboCredential.getUserInfo();
    let query;
    let postID;
    let check;

    switch (method) {
      case "get":
        const pageCount = req.query.pageCount ? Number(req.query.pageCount) : 0;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 8;
        query = `SELECT * FROM [dbo].[TeamPostEntity] where IsRemoved = 0 ORDER BY PostID DESC OFFSET ${pageSize * pageCount} ROWS FETCH NEXT ${pageSize} ROWS ONLY;`;
        const posts = await executeQuery(query, connection);
        const data = await decoratePosts(posts, currentUser.objectId, connection);
        res.body = data;
        return res;
      case "post":
        const createRequest = getPostRequest(req);
        query = `INSERT TeamPostEntity (ContentUrl, CreatedByName, CreatedDate, Description, IsRemoved, Tags, Title, TotalVotes, Type, UpdatedDate, UserID) OUTPUT Inserted.PostID VALUES (N'${createRequest.contentUrl}',N'${currentUser.displayName}', CURRENT_TIMESTAMP, N'${createRequest.description}', 0, N'${createRequest.tags}', N'${createRequest.title}', 0,${createRequest.type}, CURRENT_TIMESTAMP, '${currentUser.objectId}');`;
        const created = await executeQuery(query, connection);
        const createdId = created[0].PostID;
        const detail = await postDetail(createdId, currentUser.objectId, connection);
        res.body = detail;
        return res;
      case "delete":
        postID = context.bindingData.id as number;
        check = await checkPost(postID, connection, currentUser.objectId);
        if (!check) {
          throw new Error("invalid postID");
        }
        query = `update TeamPostEntity set IsRemoved = 1 where PostID = ${postID}`;
        await executeQuery(query, connection);
        res.body = "delete post successfully";
        return res;
      case "put":
        postID = context.bindingData.id as number;
        check = await checkPost(postID, connection, currentUser.objectId);
        if (!check) {
          throw new Error("invalid postID");
        }
        const updateRequest = getPostRequest(req);
        query = `update TeamPostEntity set ContentUrl = N'${updateRequest.contentUrl}', Description = N'${updateRequest.description}', Tags = N'${updateRequest.tags}', Title = N'${updateRequest.title}', Type = ${updateRequest.type}, UpdatedDate = CURRENT_TIMESTAMP where PostID = ${postID};`;
        await executeQuery(query, connection);
        const updatedDetail = await postDetail(postID, currentUser.objectId, connection);
        res.body = updatedDetail;
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

async function postDetail(postID, userID, connection) {
  const query = `SELECT * FROM [dbo].[TeamPostEntity] where PostID = ${postID};`;
  const posts = await executeQuery(query, connection);
  const data = await decoratePosts(posts, userID, connection);
  return data[0];
}

function getPostRequest(req: HttpRequest) {
  let res = new PostRequest();
  res.type = req.body.type ?? 1;
  res.title = req.body.title ?? "automatic post";
  res.description = req.body.description ?? "hello";
  res.contentUrl = req.body.contentUrl ?? "https://bing.com";
  res.tags = req.body.tags ?? "red;blue";

  if (!Object.values(PostTypes).includes(res.type)) {
    throw new Error("invalid input for type");
  }
  if (res.title.length > LengthLimit.title) {
    throw new Error(`the input of title is too long, max length is ${LengthLimit.title}`);
  }
  if (res.contentUrl.length > LengthLimit.contentUrl) {
    throw new Error(`the input of contentUrl is too long, max length is ${LengthLimit.contentUrl}`);
  }
  if (res.description.length > LengthLimit.description) {
    throw new Error(`the input of description is too long, max length is ${LengthLimit.description}`);
  }
  if (res.tags.length > LengthLimit.tags) {
    throw new Error(`the input of tags is too long, max length is ${LengthLimit.tags}`);
  }
  return res;
}
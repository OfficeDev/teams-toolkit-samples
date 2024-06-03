// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { executeQuery } from "./common";

export async function checkPost(postID, conn, userID = ""): Promise<boolean> {
  let userFilter = userID ? `and UserID = '${userID}'` : "";
  let query = `select count(*) as count from [dbo].[TeamPostEntity] where PostID = ${postID} and isRemoved = 0 ${userFilter};`;
  var result = await executeQuery(query, conn);
  if (result.length === 0 || result[0].count === 0) {
    return false;
  } else {
    return true;
  }
}

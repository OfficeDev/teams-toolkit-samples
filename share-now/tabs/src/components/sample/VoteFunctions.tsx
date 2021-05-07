// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from "react";
import { Button, Input, Loader } from "@fluentui/react-northstar";
import { useData } from "./lib/useData";
import * as axios from "axios";
import {
  TeamsUserCredential,
  getResourceConfiguration,
  ResourceType,
} from "teamsdev-client";

var functionName = "vote";

async function callFunction() {
  try {
    const credential = new TeamsUserCredential();
    const accessToken = await credential.getToken("");
    const apiConfig = getResourceConfiguration(ResourceType.API);
    const response = await axios.default.post(apiConfig.endpoint + "/api/" + functionName + "/3", {}, {
      headers: {
        authorization: "Bearer " + accessToken?.token || "",
      },
    });
    return response.data;
  } catch (err) {
    let funcErrorMsg = "";
    if (err.response && err.response.status && err.response.status === 404) {
      funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "TeamsFx - Deploy Package") first before running this App`;
    } else if (err.message === "Network Error") {
      funcErrorMsg = "Cannot call Azure Function due to network error, please check your network connection status and ";
      if (err.config.url.indexOf("localhost") >= 0) {
        funcErrorMsg += `make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App`;
      }
      else {
        funcErrorMsg += `make sure to provision and deploy Azure Function (Run command palette "TeamsFx - Provision Resource" and "TeamsFx - Deploy Package") first before running this App`;
      }
    } else {
      funcErrorMsg = err.toString();
      if (err.response?.data?.error) {
        funcErrorMsg += ": " + err.response.data.error;
      }
    }
    throw new Error(funcErrorMsg);
  }
}

export function VoteFunctions(props: { codePath?: string; docsUrl?: string; }) {
  const { loading, data, error, reload } = useData(callFunction, {
    auto: false,
  });
  return (
    <div>
      <h2>Vote for post</h2>
      {!loading && (
        <Button primary content="Vote" onClick={reload} />
      )}
      {loading && <Loader />}
      {!loading && !!data && !error && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
      {!loading && !!error && <div className="error">{error.toString()}</div>}
    </div>
  );
}

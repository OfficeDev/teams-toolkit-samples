import React, { useState } from "react";
import { Button, Spinner } from "@fluentui/react-components";
import * as axios from "axios";
import { apiClient } from "./lib/apiClient";
import { ConnectionId } from "./lib/constants";
import { Status } from "./Status";

async function callFunction(
  functionName: string,
  method: axios.Method,
  params?: any,
  data?: any
) {
  try {
    const response = await apiClient.request({
      url: functionName,
      method,
      params,
      data,
    });
    return response.data;
  } catch (err: unknown) {
    if (axios.default.isAxiosError(err)) {
      let funcErrorMsg = "";

      if (err?.response?.status === 404) {
        funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "Teams: Deploy") first before running this App`;
      } else if (err.message === "Network Error") {
        funcErrorMsg =
          "Cannot call Azure Function due to network error, please check your network connection status and ";
        if (err.config?.url && err.config.url.indexOf("localhost") >= 0) {
          funcErrorMsg += `make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App`;
        } else {
          funcErrorMsg += `make sure to provision and deploy Azure Function (Run command palette "Teams: Provision" and "Teams: Deploy") first before running this App`;
        }
      } else {
        funcErrorMsg = err.message;
        if (err.response?.data?.error) {
          funcErrorMsg += ": " + err.response.data.error;
        }
      }

      throw new Error(funcErrorMsg);
    }
    throw err;
  }
}

export function Ingest() {
  const [step, setStep] = useState(-1);
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState(false);

  async function ingestData() {
    try {
      setLoading(true);
      setError("");
      setStep(0);
      const connectionResult = await callFunction("connection", "post", {
        connectionId: ConnectionId,
      });
      setStep(1);
      if (!connectionResult.connectionAlreadyExists) {
        const schemaResult = await callFunction("schema", "post", {
          connectionId: ConnectionId,
        });
        setStep(2);
        let statusResult;
        do {
          statusResult = await callFunction("status", "get", {
            location: schemaResult.location,
          });
        } while (statusResult.status !== "completed");
      }
      setStep(3);
      await callFunction("data", "post", { connectionId: ConnectionId });
      setStep(4);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>2. Ingest Sample Data into Copilot connector</h2>
      <p>
        An Azure Functions app is running. Click below button to ingest data
        from the{" "}
        <a
          href="https://github.com/microsoftgraph/msgraph-search-connector-sample/blob/main/PartsInventoryConnector/ApplianceParts.csv"
          target="_blank"
          rel="noreferrer"
        >
          CSV file
        </a>
        .
      </p>
      <p>
        <strong>
          Note: before ingesting data, you need to do 'Admin Consent' with
          'ExternalConnection.ReadWrite.OwnedBy' and
          'ExternalItem.ReadWrite.All' application permissions for your AAD App
          in Azure Portal.
        </strong>
      </p>
      <Button appearance="primary" disabled={loading} onClick={ingestData}>
        Ingest Data
      </Button>
      {loading && <Spinner />}
      <div style={{ marginTop: 20 }}>
        <Status
          currentStep={step}
          targetStep={1}
          error={error}
          text="Create connection"
        />
        <Status
          currentStep={step}
          targetStep={2}
          error={error}
          text="Register schema"
        />
        <Status
          currentStep={step}
          targetStep={3}
          error={error}
          text="Wait for schema to be ready (It may take about several minutes for the first time, and please do not reload this page)"
        />
        <Status
          currentStep={step}
          targetStep={4}
          error={error}
          text="Push all items from CSV file to current connection"
        />
      </div>
      {!loading && !!error && (
        <div className="error fixed">{error.toString()}</div>
      )}
    </div>
  );
}

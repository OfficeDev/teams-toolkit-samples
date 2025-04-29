// Import polyfills for fetch required by msgraph-sdk-javascript.
import "isomorphic-fetch";
import { app, InvocationContext, HttpRequest, HttpResponseInit } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { AppCredential, AppCredentialAuthConfig } from "@microsoft/teamsfx";
import config from "../config";

const authConfig: AppCredentialAuthConfig = {
  authorityHost: config.authorityHost,
  clientId: config.clientId,
  tenantId: config.tenantId,
  clientSecret: config.clientSecret,
};

/**
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 */
export async function connection(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  const connectionId = req.query.get("connectionId");

  // Initialize response.
  const res: HttpResponseInit = {
    status: 200,
    jsonBody: {
      connectionAlreadyExists: false,
    },
  };

  let appCredential;
  try {
    appCredential = new AppCredential(authConfig);
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      jsonBody: {
        error:
          "Failed to construct TeamsFx with Application Identity. " +
          "Ensure your function app is configured with the right Azure AD App registration.",
      },
    };
  }

  // Create connection
  try {
    // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
    const authProvider = new TokenCredentialAuthenticationProvider(
      appCredential,
      {
        scopes: ["https://graph.microsoft.com/.default"],
      }
    );
    const graphClient: Client = Client.initWithMiddleware({
      authProvider: authProvider,
    });
    await graphClient.api("/external/connections").post({
      id: connectionId,
      name: "Sample connection",
      description: "Sample connection description",
    });
  } catch (e) {
    if (e?.statusCode === 409) {
      res.jsonBody.connectionAlreadyExists = true;
    } else {
      context.error(e);
      let error =
        "Failed to create a connection for Graph connector: " + e.toString();
      if (e?.statusCode === 401) {
        error +=
          " -- Please make sure you have done 'Admin Consent' with 'ExternalConnection.ReadWrite.OwnedBy' and 'ExternalItem.ReadWrite.All' application permissions for your AAD App";
      }
      return {
        status: e?.statusCode ?? 500,
        jsonBody: {
          error,
        },
      };
    }
  }

  return res;
}

app.http("connection", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: connection,
});
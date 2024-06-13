// Import polyfills for fetch required by msgraph-sdk-javascript.
import "isomorphic-fetch";
import { app, InvocationContext, HttpRequest, HttpResponseInit } from "@azure/functions";
import { Client, ResponseType } from "@microsoft/microsoft-graph-client";
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
export async function schema(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  const connectionId = req.query.get("connectionId");

  // Initialize response.
  const res: HttpResponseInit = {
    status: 200,
    jsonBody: {},
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
          "Failed to construct AppCredential with Application Identity. " +
          "Ensure your function app is configured with the right Azure AD App registration.",
      },
    };
  }

  // Register schema
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
    const result = await graphClient
      .api(`/external/connections/${connectionId}/schema`)
      .responseType(ResponseType.RAW)
      .post({
        baseType: "microsoft.graph.externalItem",
        properties: [
          {
            name: "partNumber",
            type: "int64",
            isSearchable: false,
            isRetrievable: true,
            isQueryable: true,
            labels: [],
            aliases: [],
          },
          {
            name: "name",
            type: "string",
            isSearchable: true,
            isRetrievable: true,
            isQueryable: true,
            labels: [],
            aliases: [],
          },
          {
            name: "description",
            type: "string",
            isSearchable: true,
            isRetrievable: true,
            isQueryable: false,
            labels: [],
            aliases: [],
          },
          {
            name: "price",
            type: "double",
            isSearchable: false,
            isRetrievable: true,
            isQueryable: true,
            labels: [],
            aliases: [],
          },
          {
            name: "inventory",
            type: "int64",
            isSearchable: false,
            isRetrievable: true,
            isQueryable: true,
            labels: [],
            aliases: [],
          },
          {
            name: "appliances",
            type: "stringCollection",
            isSearchable: true,
            isRetrievable: true,
            isQueryable: true,
            labels: [],
            aliases: [],
          },
        ],
      });
    res.jsonBody.location = result.headers.get("Location");
  } catch (e) {
    context.error(e);
    return {
      status: e?.statusCode ?? 500,
      jsonBody: {
        error: "Failed to register a schema for connection: " + e.toString(),
      },
    };
  }

  return res;
}

app.http("schema", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: schema,
});
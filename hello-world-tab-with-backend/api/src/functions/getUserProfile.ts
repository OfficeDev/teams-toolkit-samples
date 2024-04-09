/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

// Import polyfills for fetch required by msgraph-sdk-javascript.
import "isomorphic-fetch";
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  OnBehalfOfCredentialAuthConfig,
  OnBehalfOfUserCredential,
  UserInfo,
} from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import config from "../config";
// Only takes effect for proxy purpose when HOOK_FOR_PROXY is set in the environment.
import "../HookForProxy";

/**
 * This function handles requests from teamsfx client.
 * The HTTP request should contain an SSO token queried from Teams in the header.
 * Before trigger this function, teamsfx binding would process the SSO token and generate teamsfx configuration.
 *
 * This function initializes the teamsfx SDK with the configuration and calls these APIs:
 * - new OnBehalfOfUserCredential(accessToken, oboAuthConfig) - Construct OnBehalfOfUserCredential instance with the received SSO token and initialized configuration.
 * - getUserInfo() - Get the user's information from the received SSO token.
 *
 * The response contains multiple message blocks constructed into a JSON object, including:
 * - An echo of the request body.
 * - The display name encoded in the SSO token.
 * - Current user's Microsoft 365 profile if the user has consented.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The invocation context.
 */
export async function getUserProfile(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  // Initialize response.
  const res: HttpResponseInit = {
    status: 200,
    jsonBody: {},
  };

  // Put an echo into response body.
  res.jsonBody.receivedHTTPRequestBody = req.body || "";

  // Prepare access token.
   // Prepare access token.
   const accessToken: string = req.headers
    .get("Authorization")
    ?.replace("Bearer ", "")
    .trim();
  if (!accessToken) {
    return {
      status: 400,
      jsonBody: {
        error: "No access token was found in request header.",
      },
    };
  }

  const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
    authorityHost: config.authorityHost,
    clientId: config.clientId,
    tenantId: config.tenantId,
    clientSecret: config.clientSecret,
  };

  let oboCredential: OnBehalfOfUserCredential;
  try {
    oboCredential = new OnBehalfOfUserCredential(accessToken, oboAuthConfig);
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      jsonBody: {
        error:
          "Failed to construct OnBehalfOfUserCredential using your accessToken. " +
          "Ensure your function app is configured with the right Azure AD App registration.",
      },
    };
  }

  // Query user's information from the access token.
  try {
    const currentUser: UserInfo = await oboCredential.getUserInfo();
    if (currentUser && currentUser.displayName) {
      res.jsonBody.userInfoMessage = `User display name is ${currentUser.displayName}.`;
    } else {
      res.jsonBody.userInfoMessage =
        "No user information was found in access token.";
    }
  } catch (e) {
    context.error(e);
    return {
      status: 400,
      jsonBody: {
        error: "Access token is invalid.",
      },
    };
  }

  // Create a graph client with default scope to access user's Microsoft 365 data after user has consented.
  try {
    // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
    const authProvider = new TokenCredentialAuthenticationProvider(
      oboCredential,
      {
        scopes: ["https://graph.microsoft.com/.default"],
      }
    );

    // Initialize Graph client instance with authProvider
    const graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });

    const profile: any = await graphClient.api("/me").get();
    res.jsonBody.graphClientMessage = profile;
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      jsonBody: {
        error:
          "Failed to retrieve user profile from Microsoft Graph. The application may not be authorized.",
      },
    };
  }

  return res;
}

// You can replace the codes above from the function body with comment "Query user's information from the access token." to the end
// with the following codes to use application permission to get user profiles.
// Remember to get admin consent of application permission "User.Read.All". 
// If you use the proxy mode to debug, the application permission is not required as the Graph API proxy will not check the token and permission.
/*
// Query user's information from the access token.
  let userName: string;
  try {
    const currentUser: UserInfo = await oboCredential.getUserInfo();
    console.log(currentUser);
    userName = currentUser.preferredUserName; // Will be used in app credential flow
    if (currentUser && currentUser.displayName) {
      res.jsonBody.userInfoMessage = `User display name is ${currentUser.displayName}.`;
    } else {
      res.jsonBody.userInfoMessage = "No user information was found in access token.";
    }
  } catch (e) {
    context.error(e);
    return {
      status: 400,
      jsonBody: {
        error: "Access token is invalid.",
      },
    };
  }

  // Use IdentityType.App + client secret to create a teamsfx
  const appAuthConfig: AppCredentialAuthConfig = {
    clientId: process.env.M365_CLIENT_ID,
    clientSecret: process.env.M365_CLIENT_SECRET,
    authorityHost: process.env.M365_AUTHORITY_HOST,
    tenantId: process.env.M365_TENANT_ID,
  };
  try {
    const appCredential = new AppCredential(appAuthConfig);
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      jsonBody: {
        error:
          "App credential error:" +
          "Failed to construct TeamsFx using your accessToken. " +
          "Ensure your function app is configured with the right Azure AD App registration.",
      },
    };
  }

  // Create a graph client with default scope to access user's Microsoft 365 data after user has consented.
  try {
    // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
    const authProvider = new TokenCredentialAuthenticationProvider(appCredential, {
      scopes: ["https://graph.microsoft.com/.default"],
    });

    // Initialize the Graph client
    const graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });

    const profile: any = await graphClient.api("/users/"+userName).get();
    res.jsonBody.graphClientMessage = profile;
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      jsonBody: {
        error:
          "Failed to retrieve user profile from Microsoft Graph. The application may not be authorized.",
      },
    };
  }
*/

app.http("getUserProfile", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getUserProfile,
});
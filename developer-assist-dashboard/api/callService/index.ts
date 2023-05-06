/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

// Import polyfills for fetch required by msgraph-sdk-javascript.
import "isomorphic-fetch";

import { Context, HttpRequest } from "@azure/functions";
import { Client, ResponseType } from "@microsoft/microsoft-graph-client";
import {
  createMicrosoftGraphClientWithCredential,
  OnBehalfOfCredentialAuthConfig,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import { Octokit } from "@octokit/core";

import config from "../config";

interface Response {
  status: number;
  body: { [key: string]: any };
}

type TeamsfxContext = { [key: string]: any };

/**
 * This function handles requests from teamsfx client.
 * The HTTP request should contain an SSO token queried from Teams in the header.
 * Before trigger this function, teamsfx binding would process the SSO token and generate teamsfx configuration.
 *
 * This function initializes the teamsfx SDK with the configuration and calls these APIs:
 * - TeamsFx().setSsoToken() - Construct teamsfx instance with the received SSO token and initialized configuration.
 * - getUserInfo() - Get the user's information from the received SSO token.
 * - createMicrosoftGraphClient() - Get a graph client to access user's Microsoft 365 data.
 *
 * The response contains multiple message blocks constructed into a JSON object, including:
 * - An echo of the request body.
 * - The display name encoded in the SSO token.
 * - Current user's Microsoft 365 profile if the user has consented.
 *
 * @param {Context} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 * @param {teamsfxContext} TeamsfxContext - The context generated by teamsfx binding.
 */
export default async function run(
  context: Context,
  req: HttpRequest,
  teamsfxContext: TeamsfxContext
): Promise<Response> {
  context.log("HTTP trigger function processed a request.");

  // Initialize response.
  const res: Response = {
    status: 200,
    body: {},
  };

  // Put an echo into response body.
  res.body.receivedHTTPRequestBody = req.headers || "";

  // Prepare access token.
  const accessToken: string = teamsfxContext["AccessToken"];
  if (!accessToken) {
    return {
      status: 400,
      body: {
        error: "No access token was found in request header.",
      },
    };
  }

  // Construct teamsfx.
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
    context.log.error(e);
    return {
      status: 500,
      body: {
        error:
          "Failed to construct OnBehalfOfUserCredential using your accessToken. " +
          "Ensure your function app is configured with the right Azure AD App registration.",
      },
    };
  }

  // Get the serviceType, method, and request data from the HTTP request.
  const serviceType = req.query["serviceType"];
  const method = req.method;
  const reqData = req.body;

  try {
    // Call the appropriate function based on the graphType and method.
    const result = await handleRequest(oboCredential, serviceType, method, reqData);
    res.body = { ...res.body, ...result };
  } catch (e) {
    context.log.error(e);
    return {
      status: 500,
      body: {
        error: "Failed to process request.",
      },
    };
  }

  return res;
}

async function handleRequest(
  oboCredential: OnBehalfOfUserCredential,
  serviceType: string,
  method: string,
  reqData: any
): Promise<any> {
  // Switch statement to handle different serviceType and method combinations
  switch (`${serviceType}:${method}`) {
    // If serviceType is "devops" and method is "GET"
    case "devops:GET": {
      return { items: await getDevops() };
    }
    // If serviceType is "github" and method is "GET"
    case "github:GET": {
      return { issues: await getIssues() };
    }
    // If serviceType is "github" and method is "POST"
    case "github:POST": {
      await createIssue(reqData);
      return { issues: await getIssues() };
    }
    // If serviceType is "planner" and method is "GET"
    case "planner:GET": {
      return { tasks: await getPlanner(oboCredential) };
    }
    // If serviceType is "planner" and method is "POST"
    case "planner:POST": {
      // Call createPlannerTask function to create a task
      await createPlannerTask(oboCredential, reqData);
      return { tasks: await getPlanner(oboCredential) };
    }
    default: {
      // If serviceType or method is invalid, throw an error
      throw new Error("Invalid serviceType or method.");
    }
  }
}

/**
 * Retrieves work items from Azure DevOps.
 * @returns An array of work items.
 */
async function getDevops(): Promise<any> {
  // Construct the URL to retrieve work items.
  const url = `https://dev.azure.com/${config.devopsOrgName}/${config.devopsProjectName}/_apis/wit/workitems?ids=1,2,3,4,5&api-version=7.0`;

  // Encode the access token for authentication.
  const auth = Buffer.from(`Basic:${config.devopsAccessToken}`).toString("base64");

  // Set the headers for the request.
  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json; charset=utf-8;",
  };

  // Send the request to retrieve work items.
  const response = await fetch(url, { headers });

  // Parse the response as JSON.
  const data = await response.json();

  // Map the work items to a simpler format.
  return data.value.map(({ id, url, fields }) => ({
    id,
    url,
    title: fields["System.Title"],
    workItemType: fields["System.WorkItemType"],
    assignedToName: fields["System.AssignedTo"]?.displayName || "",
    assignedToAvatar: fields["System.AssignedTo"]?._links.avatar.href || "",
    state: fields["System.State"],
  }));
}

/**
 * Retrieves issues from a GitHub repository.
 * @returns An array of issues.
 */
async function getIssues(): Promise<any> {
  // Create a new Octokit instance with the GitHub access token.
  const octokit = new Octokit({
    auth: config.githubAccessToken,
  });

  // Send a GET request to retrieve issues from the specified repository.
  const { data } = await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: config.githubRepoOwner,
    repo: config.githubRepoName,
  });

  // Map the issues to a simpler format.
  return data.map((issue) => ({
    state: issue.state,
    url: issue.html_url,
    title: issue.title,
    body: issue.body,
  }));
}

/**
 * Creates a new GitHub issue with the specified title.
 * @param reqData An object containing the title of the new task.
 */
async function createIssue(reqData: any) {
  const octokit = new Octokit({
    auth: config.githubAccessToken,
  });

  // Send a POST request to create a new issue in the specified repository.
  await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner: config.githubRepoOwner,
    repo: config.githubRepoName,
    title: reqData.title,
  });
}

/**
 * Retrieves the top 8 tasks from a Planner plan.
 * @param oboCredential The OnBehalfOfUserCredential object for authentication.
 * @returns An array of tasks, each containing the task ID, title, priority, percent complete, assigned users, and over-assigned users.
 */
/**
 * Retrieves the top 8 tasks from a Planner plan.
 * @param oboCredential The OnBehalfOfUserCredential object for authentication.
 * @returns An array of tasks, each containing the task ID, title, priority, percent complete, assigned users, and over-assigned users.
 */
async function getPlanner(oboCredential: OnBehalfOfUserCredential): Promise<any> {
  // Create a Microsoft Graph client with the provided credentials and permissions.
  const graphClient = createMicrosoftGraphClientWithCredential(oboCredential, [
    "Tasks.ReadWrite",
    "Group.ReadWrite.All",
  ]);

  // Retrieve the top 8 tasks from the specified Planner plan.
  const { value: tasksData } = await graphClient
    .api(`/planner/plans/${config.plannerPlanId}/tasks?$top=8`)
    .get();

  // Map the tasks to a simpler format.
  const tasks = await Promise.all(
    tasksData.map(async (task: any) => {
      const { id, title, priority, percentComplete, assignments } = task;
      const assignMap = new Map(Object.entries(assignments || {}));
      const [assigned, overAssigned] = [[], []];
      for (const [userId] of assignMap) {
        // Get information about the user assigned to the task.
        const assignInfo = await getUser(oboCredential, userId as string);

        // Add the user to the assigned or over-assigned list, depending on how many users are already assigned.
        (assigned.length < 2 ? assigned : overAssigned).push(assignInfo);
      }
      return { id, title, priority, percentComplete, assigned, overAssigned };
    })
  );

  return tasks;
}

/**
 * Creates a new task in a Planner plan.
 * @param oboCredential The OnBehalfOfUserCredential object for authentication.
 * @param reqData An object containing the title of the new task.
 * @returns The response from the POST request to create the new task.
 */
async function createPlannerTask(
  oboCredential: OnBehalfOfUserCredential,
  reqData: any
): Promise<any> {
  // Create a Microsoft Graph client with the provided credentials and permissions.
  const graphClient: Client = createMicrosoftGraphClientWithCredential(oboCredential, [
    "Tasks.ReadWrite",
    "Group.ReadWrite.All",
  ]);

  // Create a task object with the provided title and assignments.
  const task = {
    planId: config.plannerPlanId,
    bucketId: reqData.assignments,
    title: reqData.title,
  };

  // Send a POST request to create a new task in the specified Planner plan.
  const resp = await graphClient.api(`/planner/tasks`).post(task);

  // Return the response from the POST request.
  return resp;
}

/**
 * Retrieves information about a user from Microsoft Graph API.
 * @param oboCredential The OnBehalfOfUserCredential object for authentication.
 * @param userId The ID of the user to retrieve information for.
 * @returns An object containing the user's ID, display name, and avatar (if available).
 */
async function getUser(oboCredential: OnBehalfOfUserCredential, userId: string): Promise<any> {
  const graphClient = createMicrosoftGraphClientWithCredential(oboCredential, ["User.Read.All"]);

  // Send a GET request to retrieve the user's display name.
  const { displayName } = await graphClient.api(`/users/${userId}`).get();

  let avatar: string | undefined;
  try {
    // Send a GET request to retrieve the user's avatar.
    const blob = await graphClient
      .api(`/users/${userId}/photo/$value`)
      .responseType(ResponseType.ARRAYBUFFER)
      .get();
    avatar = `data:image/jpeg;base64,${Buffer.from(blob).toString("base64")}`;
  } catch (error) {}

  // Return an object containing the user's ID, display name, and avatar (if available).
  return { userId, displayName, avatar };
}
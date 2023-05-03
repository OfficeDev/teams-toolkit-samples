import { githubIssuesModel } from "../models/githubIssuesModel";
import { callFunction } from "./callFunction";

/**
 * Retrieves a list of GitHub issues.
 *
 * @returns A Promise that resolves to an array of GitHub issues.
 */
export async function getIssues(): Promise<githubIssuesModel[]> {
  try {
    const respData = await callFunction("GET", "callService", { serviceType: "github" });
    return respData["issues"];
  } catch (e) {
    throw e;
  }
}

/**
 * Creates a new GitHub issue with the given title.
 *
 * @param title The title of the new issue.
 * @returns A Promise that resolves to an array of GitHub issues.
 */
export async function createIssue(title: string): Promise<githubIssuesModel[]> {
  try {
    const respData = await callFunction("POST", "github", { title: title });
    return respData["issues"];
  } catch (e) {
    throw e;
  }
}

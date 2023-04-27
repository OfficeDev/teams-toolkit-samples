import { githubIssuesModel } from "../models/githubIssuesModel";
import { callFunction } from "./callFunction";

export async function getIssues(): Promise<githubIssuesModel[]> {
  try {
    const respData = await callFunction("GET", "callService", { serviceType: "github" });
    return respData["issues"];
  } catch (e) {
    throw e;
  }
}

export async function createIssue(title: string): Promise<githubIssuesModel[]> {
  try {
    const respData = await callFunction("POST", "github", { title: title });
    return respData["issues"];
  } catch (e) {
    throw e;
  }
}

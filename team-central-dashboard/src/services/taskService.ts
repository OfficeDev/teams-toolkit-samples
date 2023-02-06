import { Client } from "@microsoft/microsoft-graph-client";
import {
  createMicrosoftGraphClientWithCredential,
  TeamsUserCredential,
} from "@microsoft/teamsfx";

import { TeamsUserCredentialContext } from "../internal/singletonContext";
import { TaskModel } from "../models/taskModel";

export async function getTasks(): Promise<TaskModel[]> {
  let credential: TeamsUserCredential;
  try {
    credential = TeamsUserCredentialContext.getInstance().getCredential();
    const graphClient: Client = createMicrosoftGraphClientWithCredential(credential, [
      "Tasks.ReadWrite",
    ]);
    const tasklists = await graphClient.api("/me/todo/lists").get();
    const myFirstTaskList = tasklists["value"][0];
    const todoTaskListId: string = myFirstTaskList["id"];
    const resp = await graphClient.api(`/me/todo/lists/${todoTaskListId}/tasks?$top=3`).get();
    const tasksInfo = resp["value"];
    let tasks: TaskModel[] = [];
    for (const obj of tasksInfo) {
      const tmp: TaskModel = {
        id: obj["id"],
        name: obj["title"],
        status: obj["status"],
        importance: obj["importance"],
        content: obj["content"],
      };
      tasks.push(tmp);
    }
    return tasks;
  } catch (e) {
    throw e;
  }
}

export async function addTask(title: string): Promise<TaskModel[]> {
  try {
    let credential: TeamsUserCredential;
    credential = TeamsUserCredentialContext.getInstance().getCredential();

    const graphClient: Client = createMicrosoftGraphClientWithCredential(credential, [
      "Tasks.ReadWrite",
    ]);
    const tasklists = await graphClient.api("/me/todo/lists").get();
    const myFirstTaskList = tasklists["value"][0];
    const todoTaskListId: string = myFirstTaskList["id"];
    await graphClient.api("/me/todo/lists/" + todoTaskListId + "/tasks").post({ title: title });
    const tasks = await graphClient.api(`/me/todo/lists/${todoTaskListId}/tasks?$top=3`).get();
    const tasksInfo = tasks["value"];
    let taskResult: TaskModel[] = [];
    for (const obj of tasksInfo) {
      const tmp: TaskModel = {
        id: obj["id"],
        name: obj["title"],
        status: obj["status"],
        importance: obj["importance"],
        content: obj["content"],
      };
      taskResult.push(tmp);
    }
    return taskResult;
  } catch (e) {
    throw e;
  }
}

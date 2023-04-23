import { TaskModel } from "../models/taskModel";
import { callFunction } from "./callFunction";

export async function getTasks(): Promise<TaskModel[]> {
  try {
    const respData = await callFunction("GET", "callGraph", { graphType: "task" });
    return respData["taskResult"];
  } catch (e) {
    throw e;
  }
}

export async function addTask(title: string): Promise<TaskModel[]> {
  try {
    const respData = await callFunction(
      "POST",
      "callGraph",
      { graphType: "task" },
      { taskTitle: title }
    );
    return respData["taskResult"];
  } catch (e) {
    throw e;
  }
}

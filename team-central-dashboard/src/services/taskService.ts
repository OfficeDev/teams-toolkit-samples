import { TaskModel } from "../models/taskModel";
import { callFunction } from "./callFunction";

/**
 * Retrieves tasks from the server.
 * @returns An array of TaskModel objects.
 */
export async function getTasks(): Promise<TaskModel[]> {
  try {
    const respData = await callFunction("GET", "callGraph", { graphType: "task" });
    return respData["taskResult"];
  } catch (e) {
    throw e;
  }
}

/**
 * Adds a new task to the server.
 * @param title The title of the new task.
 * @returns An array of TaskModel objects.
 */
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

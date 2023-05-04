import { TaskModel } from "../models/plannerTaskModel";
import { callFunction } from "./callFunction";

/**
 * Retrieves all tasks from the planner.
 * @returns A Promise that resolves to an array of TaskModel objects.
 */
export async function getTasks(): Promise<TaskModel[]> {
  try {
    const respData = await callFunction("GET", "callService", { serviceType: "planner" });
    return respData["tasks"];
  } catch (e) {
    throw e;
  }
}

/**
 * Adds a new task to the planner.
 * @param title The title of the new task.
 * @returns A Promise that resolves to an array of TaskModel objects.
 */
export async function addTask(title: string): Promise<TaskModel[]> {
  try {
    const respData = await callFunction(
      "POST",
      "callService",
      { serviceType: "planner" },
      { title: title }
    );
    return respData["tasks"];
  } catch (e) {
    throw e;
  }
}

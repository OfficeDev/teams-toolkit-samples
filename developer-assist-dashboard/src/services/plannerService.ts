import { TaskModel } from "../models/plannerTaskModel";
import { callFunction } from "./callFunction";

export async function getTasks(): Promise<TaskModel[]> {
  try {
    const respData = await callFunction("GET", "callService", { serviceType: "planner" });
    return respData["tasks"];
  } catch (e) {
    throw e;
  }
}

export async function addTask(title: string): Promise<TaskModel[]> {
  try {
    const respData = await callFunction("POST", "planner", { title: title });
    return respData["tasks"];
  } catch (e) {
    throw e;
  }
}

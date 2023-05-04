import { DevOpsModel } from "../models/devOpsModel";
import { callFunction } from "./callFunction";

/**
 * This function retrieves DevOps work items from the backend service.
 * @returns An array of DevOpsModel objects representing the work items.
 */
export async function DevOpsWorkItems(): Promise<DevOpsModel[]> {
  try {
    const respData = await callFunction("GET", "callService", { serviceType: "devops" });
    return respData["items"];
  } catch (e) {
    throw e;
  }
}

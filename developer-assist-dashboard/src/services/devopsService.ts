import { DevOpsModel } from "../models/devOpsModel";
import { callFunction } from "./callFunction";

export async function DevOpsWorkItems(): Promise<DevOpsModel[]> {
  try {
    const respData = await callFunction("GET", "callService", { serviceType: "devops" });
    return respData["items"];
  } catch (e) {
    throw e;
  }
}

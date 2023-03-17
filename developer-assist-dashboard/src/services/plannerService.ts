import { Client } from "@microsoft/microsoft-graph-client";
import { createMicrosoftGraphClientWithCredential, TeamsUserCredential } from "@microsoft/teamsfx";

import { TeamsUserCredentialContext } from "../internal/singletonContext";
import { TaskAssignedToModel, TaskModel } from "../models/plannerTaskModel";
import * as configs from "../configs";

export async function getTasks(): Promise<TaskModel[]> {
    let credential: TeamsUserCredential;
    try {
        credential = TeamsUserCredentialContext.getInstance().getCredential();
        const graphClient: Client = createMicrosoftGraphClientWithCredential(credential, [
            "Tasks.ReadWrite",
            "Group.ReadWrite.All",
        ]);
        const resp = await graphClient
            .api(`/planner/plans/${configs.PLAN_ID}/tasks?$top=4`)
            .get();
        const tasksInfo = resp["value"];
        let tasks: TaskModel[] = [];
        for (const obj of tasksInfo) {
            const taskInfo: TaskModel = {
                id: obj["id"],
                name: obj["title"],
                priority: obj["priority"],
                percentComplete: obj["percentComplete"],
            };
            if (obj["assignments"] !== undefined) {
                let assignMap: Map<String, object> = new Map(Object.entries(obj["assignments"]));
                let assignments: TaskAssignedToModel[] = [];
                let overAssignments: TaskAssignedToModel[] = [];
                assignMap.forEach(async (value, userId) => {
                    const assignInfo: TaskAssignedToModel = await getUser(userId as string);
                    if (assignments.length < 2) {
                        assignments.push(assignInfo);
                    } else {
                        overAssignments.push(assignInfo);
                    }
                });
                taskInfo.assignments = assignments;
                taskInfo.overAssignments = overAssignments;
            }
            tasks.push(taskInfo);
            await graphClient.api("/planner/tasks/" + taskInfo.id + "/details").get();
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
            "Group.ReadWrite.All",
        ]);
        const plannerTask = {
            planId: configs.PLAN_ID,
            bucketId: configs.BUCKET_ID,
            title: title,
        };
        await graphClient.api("/planner/tasks").post(plannerTask);
        const resp = await graphClient
            .api(`/planner/plans/${configs.PLAN_ID}/tasks?$top=4`)
            .get();
        const tasksInfo = resp["value"];
        let tasks: TaskModel[] = [];
        for (const obj of tasksInfo) {
            const taskInfo: TaskModel = {
                id: obj["id"],
                name: obj["title"],
                priority: obj["priority"],
                percentComplete: obj["percentComplete"],
            };
            if (obj["assignments"] !== undefined) {
                let assignMap: Map<String, object> = new Map(Object.entries(obj["assignments"]));
                let assignments: TaskAssignedToModel[] = [];
                let overAssignments: TaskAssignedToModel[] = [];
                assignMap.forEach(async (value, userId) => {
                    const assignInfo: TaskAssignedToModel = await getUser(userId as string);
                    if (assignments.length < 2) {
                        assignments.push(assignInfo);
                    } else {
                        overAssignments.push(assignInfo);
                    }
                });
                taskInfo.assignments = assignments;
                taskInfo.overAssignments = overAssignments;
            }
            tasks.push(taskInfo);
            await graphClient.api("/planner/tasks/" + taskInfo.id + "/details").get();
        }
        return tasks;
    } catch (e) {
        throw e;
    }
}

async function getUser(userId: string): Promise<TaskAssignedToModel> {
    let assignedInfo: TaskAssignedToModel = {
        userId: userId,
        userDisplayName: "",
        userAvatar: undefined,
    };
    try {
        let credential: TeamsUserCredential;
        credential = TeamsUserCredentialContext.getInstance().getCredential();
        const graphClient: Client = createMicrosoftGraphClientWithCredential(credential, [
            "User.Read.All",
        ]);
        const userInfo = await graphClient.api(`/users/${userId}`).get();
        assignedInfo.userDisplayName = userInfo["displayName"];
        const photo = await graphClient.api(`/users/${userId}/photo/$value`).get();
        assignedInfo.userAvatar = photo;
        return assignedInfo;
    } catch (e) {
        console.log("getUser error: " + e);
    }
    return assignedInfo;
}

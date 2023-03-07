import { DevOpsModel } from "../models/devOpsModel";
import * as configs from "../configs";
export async function DevOpsWorkItems(): Promise<DevOpsModel[]> {
    try {
        let devopsItems: DevOpsModel[] = [];
        const req = await fetch(
            "https://dev.azure.com/" +
            configs.ORGANIZATION_NAME +
            "/" +
            configs.PROJECT_NAME +
            "/_apis/wit/workitems?ids=1,2,3,4,5&api-version=7.0",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json; charset=utf-8;",
                    Authorization: "Basic " + btoa("Basic" + ":" + configs.DEVOPS_PERSONAL_ACCESS_TOKEN),
                },
            }
        )
            .then((response) => response.json())
            .then((req) => {
                return req;
            });

        //var value = JSON.parse(req);

        const devopsValue = req["value"];

        for (const obj of devopsValue) {
            const tmp: DevOpsModel = {
                id: obj["id"],
                url: obj["url"],
                fields: {
                    title: obj["fields"]["System.Title"],
                    workItemType: obj["fields"]["System.WorkItemType"],
                    assigendTo: {
                        displayName:
                            obj["fields"]["System.AssignedTo"] !== undefined
                                ? obj["fields"]["System.AssignedTo"]["displayName"]
                                : "",
                        links: {
                            avatar: {
                                href:
                                    obj["fields"]["System.AssignedTo"] !== undefined
                                        ? obj["fields"]["System.AssignedTo"]["_links"]["avatar"][
                                        "href"
                                        ]
                                        : "",
                            },
                        },
                    },
                    state: obj["fields"]["System.State"],
                },
            };

            devopsItems.push(tmp);
        }
        return devopsItems;
    } catch (e) {
        throw e;
    }
}

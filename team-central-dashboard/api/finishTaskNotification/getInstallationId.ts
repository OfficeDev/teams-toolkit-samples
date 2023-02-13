import * as fs from "fs";

import { Client } from "@microsoft/microsoft-graph-client";
import { createMicrosoftGraphClient, TeamsFx } from "@microsoft/teamsfx";

let appInfo;
const manifestPath = "../../templates/appPackage/manifest.template.json";
fs.exists(manifestPath, (exist) => {
  if (exist) {
    const Info = require(manifestPath);
    appInfo = Info;
  } else {
    appInfo = {};
  }
});

export async function getInstallationId(teamsfx: TeamsFx, userId: string) {
  try {
    const info = appInfo;
    const teamsAppId: string = info["id"];
    const apiPath =
      "/users/" +
      userId +
      "/teamwork/installedApps?$expand=teamsApp,teamsAppDefinition&$filter=teamsApp/externalId eq " +
      teamsAppId;

    const graphClient: Client = await createMicrosoftGraphClient(teamsfx, ["User.Read"]);
    const appInstallationInfo = await graphClient.api(apiPath).get()["value"];

    const installationId = appInstallationInfo["id"];
    return installationId;
  } catch (e) {}
}

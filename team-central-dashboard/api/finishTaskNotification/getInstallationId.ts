import { createMicrosoftGraphClient, IdentityType, TeamsFx } from "@microsoft/teamsfx";

export async function getInstallationId(userId: string): Promise<any> {
  try {
    const teamsAppId = process.env.TEAMS_APP_ID;
    const apiPath =
      `/users/${userId}/teamwork/installedApps?$expand=teamsApp,teamsAppDefinition&$filter=teamsApp/externalId eq '${teamsAppId}'`;

    let teamsfx_app;
    teamsfx_app = new TeamsFx(IdentityType.App);
    const graphClient = createMicrosoftGraphClient(teamsfx_app, [".default"]);
    const appInstallationInfo = await graphClient.api(apiPath).get();
    const appArray = appInstallationInfo["value"][0];
    const installationId = appArray["id"];

    return installationId;
  } catch (e) {}
}

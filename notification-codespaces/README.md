# Getting Started with Notification Sample

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=dev&repo=348288141&machine=basicLinux32gb&location=WestUs2&devcontainer_path=.devcontainer%2Fnotification-codespaces%2Fdevcontainer.json)

This sample showcases an app that send a message to Teams with Adaptive Cards triggered by a HTTP post request. You can further extend the sample to consume, transform and post events to individual, chat or channel in Teams.

The app is built using the TeamsFx SDK, which provides a simple set of functions over the Microsoft Bot Framework to implement this scenario.

![Notification Message in Teams](https://user-images.githubusercontent.com/10163840/224254253-21b4dedd-1079-4cda-ac9e-cd3bce725702.png)

## This sample illustrates
- How to use Teams Toolkit build a notification app.
- How to use [Codespaces](https://github.com/features/codespaces) to run and preview a message extension.

## Prerequisite to use this sample
- A GitHub account which will be used to create a codespace with fully configured dev environments in the cloud. 
- A Microsoft 365 tenant in which you have permission to upload Teams apps. You can get a free Microsoft 365 developer tenant by joining the [Microsoft 365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program).

## Minimal path to awesome

### Run the app in Codespaces
1. Click [Open in GitHub Codespaces badge](#getting-started-with-notification-sample) to create a codespace for the sample app.

    > Note: you can customize the creation options (e.g. region, machine type) according to your needs.

1. Once your codespace is created, Select the Teams Toolkit icon on the left in the VS Code toolbar. And then select `Preview your Teams app (F5)` from Teams Toolkit or simply press `F5` to run and preview your application.

1. When Teams Web Client is launched in the browser, select the `Add` button in the dialog to install your app to Teams.

   > **Note**: You may need to **allow pop-ups** so that Codespace can open a new browser to sideload the app to Teams:
   >
   > ![image](https://user-images.githubusercontent.com/10163840/225506097-18d04d70-ea4c-4a10-bde4-9d38654a2e72.png)

1. Open a terminal in your Codespaces, and send a POST request to the app with the following command:
   ```bash
   curl -X POST http://localhost:3978/api/notification
   ```

   The application will send an Adaptive Card to Teams:

   ![Notification Message in Teams](https://user-images.githubusercontent.com/10163840/224254253-21b4dedd-1079-4cda-ac9e-cd3bce725702.png)

### Deploy the app to Azure
- From VS Code: 
    1. Sign into Azure by clicking the `Sign in to Azure` under the `ACCOUNTS` section from sidebar.
    1. Click `Provision in the Cloud` from `DEPLOYMENT` section or open the command palette and select: `Teams: Provision in the Cloud`.
    1. Click `Deploy to the Cloud` or open the command palette and select: `Teams: Deploy to the Cloud`.
- From TeamsFx CLI:
    1. Run command: `teamsfx account login azure`.
    1. Run command: `teamsfx provision --env dev`.
    1. Run command: `teamsfx deploy --env dev`.

### Preview the app in Teams
- From VS Code: 
    1. Open the `Run and Debug Activity` Panel. Select `Launch Remote (Codespaces)` from the launch configuration drop-down.
- From TeamsFx CLI:
    1. Run command: `teamsfx preview --env dev`.

## Code structure

| Folder / File| Contents |
| - | - |
| `teamsapp.yml` | Main project file describes your application configuration and defines the set of actions to run in each lifecycle stages |
| `teamsapp.local.yml`| This overrides `teamsapp.yml` with actions that enable local execution and debugging |
| `env/`| Name / value pairs are stored in environment files and used by `teamsapp.yml` to customize the provisioning and deployment rules |
| `.vscode/` | VSCode files for debugging |
| `src/` | The source code for the notification Teams application |
| `appPackage/` | Templates for the Teams application manifest |
| `infra/` | Templates for provisioning Azure resources |

The following files can be customized and demonstrate an example implementation to get you started.

| File | Contents |
| - | - |
| `src/index.js` | Application entry point and `restify` handlers for notifications |
| `src/teamsBot.js`| An empty teams activity handler for bot customization |
| `src/adaptiveCards/notification-default.json` | A generated Adaptive Card that is sent to Teams |
| `src/cardModels.js` | The default Adaptive Card data model |

## Version History
|Date| Author| Comments|
|---|---|---|
|Apr 3, 2023| Dooriya Li | Add notification sample for codespaces |

## Feedback
We really appreciate your feedback! If you encounter any issue or error, please report issues to us following the [Supporting Guide](https://github.com/OfficeDev/TeamsFx-Samples/blob/dev/SUPPORT.md). Meanwhile you can make [recording](https://aka.ms/teamsfx-record) of your journey with our product, they really make the product better. Thank you!

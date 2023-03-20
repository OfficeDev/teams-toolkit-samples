# Getting Started with Command Bot with SSO

A bot, chatbot, or conversational bot is an app that responds to simple commands sent in chat and replies in meaningful ways. Examples of bots in everyday use include: bots that notify about build failures, bots that provide information about the weather or bus schedules, or provide travel information. A bot interaction can be a quick question and answer, or it can be a complex conversation. Being a cloud application, a bot can provide valuable and secure access to cloud services and corporate resources.

This is a simple command bot that implements single sign-on feature to retrieve profile and photo for currently signed-in user using Bot Framework SDK, TeamsFx SDK and Microsoft Graph API, and the commands can be found as below:

| command | response | sso command |
| - | - | - |
| helloworld | helloworld adaptive card message | false |
| profile | user profile information from Microsoft Graph API | true |
| photo | user photo image from Microsoft Graph API| true |

![SSO Command and Response Bot](./images/sso-command-bot.gif)

## This sample illustrates
- Use Teams Toolkit to create a Teams bot app.
- Use Microsoft Graph to get User info and picture in Teams app.
- Use TeamsFx SDK to implementing SSO for Teams bot.

## Prerequisite to use this sample
- [Node.js](https://nodejs.org/) version 14, 16, 18
- A Microsoft 365 tenant in which you have permission to upload Teams apps. You can get a free Microsoft 365 developer tenant by joining the [Microsoft 365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program).
- [Teams Toolkit for VS Code](https://aka.ms/teams-toolkit) or [TeamsFx CLI](https://aka.ms/teamsfx-cli)


## Minimal path to awesome

### Run the app locally
- From VS Code: 
    1. hit `F5` to start debugging. Alternatively open the `Run and Debug Activity` Panel and select `Debug (Edge)` or `Debug (Chrome)`.
- From TeamsFx CLI: 
    1. Run command: `teamsfx provision --env local` .
    1. Run command: `teamsfx deploy --env local` .
    1. Run command: `teamsfx preview --env local` .

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
    1. Open the `Run and Debug Activity` Panel. Select `Launch Remote (Edge)` or `Launch Remote (Chrome)` from the launch configuration drop-down.
- From TeamsFx CLI:
    1. Run command: `teamsfx preview --env dev`.


## Known issues
If you encounter the ngrok page below when sending the `show` command to the bot, please follow the steps to solve this issue.
![ngrok auth page](./images/ngrok-authtoken-page.png)
1. Stop debugging in VS Code.
1. Sign up an ngrok account in https://dashboard.ngrok.com/signup.
Copy your personal ngrok authtoken from https://dashboard.ngrok.com/get-started/your-authtoken.
1. Run `npx ngrok authtoken <your-personal-ngrok-authtoken>` in VS Code terminal.
1. Start debugging the project again by hitting the `F5` key in VS Code.

## Version History
|Date| Author| Comments|
|---|---|---|
|Mar 17, 2023| rentu | update to support Teams Toolkit v5.0.0|

## Feedback
We really appreciate your feedback! If you encounter any issue or error, please report issues to us following the [Supporting Guide](https://github.com/OfficeDev/TeamsFx-Samples/blob/dev/SUPPORT.md). Meanwhile you can make [recording](https://aka.ms/teamsfx-record) of your journey with our product, they really make the product better. Thank you!
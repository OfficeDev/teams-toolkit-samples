# Getting Started With In-meeting App

> ## WARNING: This repository is under active development and the samples are not guaranteed to work!
> This warning will be removed when the samples are ready for consumption

This is a hello-world template which shows how to build an app in the context of a Teams meeting and does not provide any functional feature. This app contains a side panel and a Bot which only shows user profile and can only be added to a Teams meeting.

![MeetingApp](./images/InMeetingApp.png)

## What you will learn in this sample
- How to build tab app for your Meeting App. 
- How to build a bot for your Meeting App. 
- How to use Microsoft Teams sdk to get Teams user login information. 
- How to use Microsoft graph client to get access to user data. 
- How to use Teams Toolkit to provision and deploy your app to Azure. 

## Prerequisites
-  [NodeJS](https://nodejs.org/en/)
-  [ngrok](https://ngrok.com/)
-  An M365 account, if you do not have M365 account, apply one from [M365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
-  [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) or [TeamsFx CLI](https://aka.ms/teamsfx-cli)
-  An [Azure subscription](https://azure.microsoft.com/en-us/free/)

## Try this sample
### Step 1: Start ngrok

Teams needs to access your tab from a publicly accessible URL. If you are running your app in localhost, you will need to use a tunneling service like ngrok. Run ngrok and point it to localhost: `ngrok http https://localhost:3000`.

Keep a note of the ngrok endpoint (Example: `https://f631****.ngrok.io`), as you will use this in the registration steps below.

> **IMPORTANT**: The fixed subdomain from ngrok requires a subscription. If you don't have it, please remember to update your Azure AD app registration application ID URI, redirect URL, env files in this project and manifest file every time you restart ngrok as the domain will change.

### Step 2: Complete Bot Channel Registration in Azure
1. Register your bot using bot channel registration in Azure AD portal, following the instructions [here](docs/azure-bot-channels-registration.md).

### Step 3: Register Azure Active Directory applications
1. Update the AAD app registration for single sign on features needed in tab, following the instructions [here](docs/auth-aad-sso.md). The "fully qualified domain name" in the instructions will be your ngrok domain (Example: `f631****.ngrok.io`).
1. Replace the placeholders of the following keys with their actual value, if there is any in the `tabs/.env.development.local` and `bot/.env.development.local` files:
    - `"appid"`: Application (client) ID of the bot's Azure AD application
    - `"clientSecret"`: client secret of the bot's Azure AD application
    - `"baseUrl "`: The ngrok endpoint (Example: `https://f631****.ngrok.io`)

### Step 4: Update placeholders in manifest file 
1. Locate the manifest file `manifest/local/manifest.json` ([schema reference](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema))
1. Replace the placeholders of the following keys with their actual value in manifest file:
    - `"appid"`: Application (client) ID of the bot's Azure AD application
    - `"baseUrl "`: The ngrok endpoint (Example: `https://f631****.ngrok.io`)
    - `"baseUrlDomain "`: The ngrok domain (Example: `f631****.ngrok.io`)
    - `"applicationIDURI"`: Application ID URI of the AAD (Example: `api://f631****.ngrok.io/00000000-0000-0000-0000-000000000000`)

### Step 5: Build and run the app

#### Build and run the tab part:
1. Navigate to the `tabs` folder in a terminal
2. Run `npm install`
3. Run `npm start` to start frontend. 
#### Build and run the bot part
1. Navigate to the `bot` folder in a terminal
2. Run `npm install`
3. Run `npm run start:local` to start bot and api server. 

### Step 6: Follow `Use the app in Teams` to see how to use the app.

## (Optional) Debug
- Open a JavaScript Debug Terminal in Visual studio code and navigate to the `bot` folder
- Add a breakpoint (like line 134 in bot/index.js)
- Run `npm install` then `npm run start:local`
- Open a Terminal in Visual studio code, navigate to the `tabs` folder and run `npm install` `npm start`
- Follow the steps in `Deploy to Teams` (if already installed the app please uninstall it first). Then in action, it will hit the break point.

## (Optional) Deploy to Azure
> Provision and deployment may incur charges to your subscription.
> You can use the [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) for provision and deployment task.
### Step 1: Provision the resources in Azure
Click `Provision in the Cloud` in PROJECT panel of Microsoft Teams Toolkit extension. or select `Teams: Provision in the Cloud` from command palette. This will create an app in Teams Developer Portal.
> **Important** This step may require you to login Microsoft Teams Toolkit extension first. **Make sure you are using your M365 tenant admin account.** Check the account you are using.

### Step 2: Update Azure Active Directory applications
1. Go to Azure Portal, select `Azure Active Directory` and then find `App Registrations`.
1. In owned applications, select the AAD application which its name is the same with you app name.
1. Navigate to **Authentication** blade and change the redirect URI to remove the `.html`, these will be: `https://XXXX.z13.web.core.windows.ne/auth-end`.
1. Next, enable implicit grant by checking the following boxes:  
    - ID Token  
    - Access Token  
1. Click **Save**.

### Step 3: Update App Service
1. Find the Resource in your Subscription, its name is under `.fx` folder in your project, its key is `siteName` in file `env.default.json`.
1. Navigate to **CORS** blade in your resource. Copy the endpoint in file `env.default.json`, its key is `endpoint` under `fx-resource-frontend-hosting`. Write down it as endpoint and it will be used. Next, paste in the **Allowed Origins** in **CORS** and click **Save**.  
1. Navigate to **Configuration**  in your resource. Copy the `teamsappid` in file `env.default.json`, its key is `remoteTeamsAppId`. Write down it as `teamsappid` and it will be used. Next,click **New application setting**. Add two settings, one is named `TEAMS_APP_ID`, its value is `teamsappid` we just copied. Another is named `TEAMSFX_ENDPOINT`, its value is endpoint we just copied. Then click **Save**.  

### Step 4: Update env file in project
1. In tabs/.env, change the value of `REACT_APP_TEAMSFX_ENDPOINT`, its value is the `siteEndpoint` in file `env.default.json`. 
1. Add a new line `REACT_APP_GRAPH_SCOPES=User.Read`

### Step 5: Deploy the resource
1. Go back to Microsoft Teams Toolkit extension, click `Deploy to the Cloud` in PROJECT panel, or select `Teams: Deploy to the Cloud` from command palette.  
1. Select both `Tab` and `Bot`.

## Use the app in Teams
To use the meeting app, you can schedule a meeting and manually upload your app package.
- Schedule a meeting with at least one other participant.
- Edit the scheduled meeting in Teams client or Teams webapp.
- Press the '+' button, then select 'Manage apps'.
- Click the 'Upload custom app' from the bottom right corner.
- Upload the corresponding app packages:
    - If built locally: Go to `manifest/local` folder and zip the three files under local folder. 
        >Ensure the zip file contains only three files, no extra folder layers in the zip file.
    - If deployed to Azure: Go to [Teams Developer Portal](https://dev.teams.microsoft.com/apps), find the app which Teams Toolkit just registered in deployment step. Click `...` in the left and click `Download app package`.
- Select the zip file to upload.
- Once you see it in a meeting's list of managed apps, press the '+' again to add it to meeting.
- Join the meeting and open the app to see it in action.

## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

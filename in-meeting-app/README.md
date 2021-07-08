# Getting Started With In-meeting Apps

> Note: Please be advised that this sample repository is currently in **Public Preview**, with a lot of active development work taking place. Please expect breaking changes as we continue to iterate. 
> 
> We really appreciate your feedback! If you encounter any issue or error, please report issues to us following the [Supporting Guide](./../SUPPORT.md). Meanwhile you can make [recording](https://aka.ms/teamsfx-record) of your journey with our product, they really make the product better. Thank you!
>  
> This warning will be removed when the samples are ready for production.

This is a hello-world template which shows how to build an app in the context of a Teams meeting. This app contains a side panel and a Bot which shows the user's profile and can be added to a Teams meeting.

![MeetingApp](./images/InMeetingApp.png)

## What you will learn in this sample
- How to build Custom Tab for your Meeting App. 
- How to build a Bot for your Meeting App. 
- How to use Microsoft Teams SDK to get Teams user login information. 
- How to use Microsoft Graph to get access to user profile data. 
- How to use the Teams Toolkit to provision and deploy your app to Azure. 

## Prerequisites
-  [NodeJS](https://nodejs.org/en/)
-  [ngrok](https://ngrok.com/)
-  An M365 account, if you do not have M365 account, apply one from [M365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
-  [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit)
-  An [Azure subscription](https://azure.microsoft.com/en-us/free/)

## Try this sample
### Step 1: Start ngrok

Teams needs to access your development server from a publicly accessible URL. If you are running your app on localhost, you will need to use a tunneling service like ngrok. Run ngrok and point it to localhost: `ngrok http https://localhost:3000`.

Keep a note of the ngrok endpoint (Example: `https://f631****.ngrok.io`), as you will use this in the registration steps below.

> **IMPORTANT**: A fixed subdomain from ngrok requires a subscription. If you don't have it, please remember to update your Azure AD app registration application ID URI, redirect URL, env files in this project and manifest file every time you restart ngrok, as the domain will change.

### Step 2: Complete Bot Channel Registration in Azure
1. Register your bot using bot channel registration in Azure AD portal, following the instructions [here](docs/azure-bot-channels-registration.md).

### Step 3: Register Azure Active Directory applications
1. Update the AAD app registration for single sign on features needed in the tab, following the instructions [here](docs/auth-aad-sso.md). The "fully qualified domain name" in the instructions will be your ngrok domain (Example: `f631****.ngrok.io`).
1. Replace the placeholders of the following keys with their actual value, if there are any in the `tabs/.env.development.local` and `bot/.env.development.local` files:
    - `"{appid}"`: Application (client) ID of the bot's Azure AD application
    - `"{clientSecret}"`: client secret of the bot's Azure AD application
    - `"{baseUrl}"`: The ngrok endpoint (Example: `https://f631****.ngrok.io`)

### Step 4: Update placeholders in manifest file 
1. Locate the manifest file `manifest/local/manifest.json` ([schema reference](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema))
1. Replace the placeholders of the following keys with their actual value in the manifest file:
    - `"{appid}"`: Application (client) ID of the bot's Azure AD application
    - `"{baseUrl}"`: The ngrok endpoint (Example: `https://f631****.ngrok.io`)
    - `"{baseUrlDomain}"`: The ngrok domain (Example: `f631****.ngrok.io`)
    - `"{applicationIDURI}"`: Application ID URI of the AAD app (Example: `api://f631****.ngrok.io/00000000-0000-0000-0000-000000000000`)

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
- Add a breakpoint
- Run `npm install` then `npm run start:local`
- Open a Terminal in Visual studio code, navigate to the `tabs` folder and run `npm install` and `npm start`
- In order to debug the app, you'll have to add it to an existing meeting. If that meeting already had the app added, you'll have to remove it first. Breakpoints should start working once you do this.

## (Optional) Deploy to Azure
> Warning: Provision and deployment may incur charges to your subscription.
> You can use the [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) to provision and deploy your application.

### Step 1: Provision the resources in Azure
> **Important** This step may require you to login to the Microsoft Teams Toolkit extension first.

In Visual Studio Code, open the command palette and select: `Teams: Provision in the Cloud` from the command palette. 
> This will create a Teams app in Teams Developer Portal.

### Step 2: Update Azure Active Directory applications
1. Go to Azure Portal, select `Azure Active Directory` and then find `App Registrations`.
1. In owned applications, locate the AAD application named after this project (`Meeting App`).
> Note: This project uses a default name `Meeting App`.
1. Navigate to the **Authentication** blade and change the redirect URI to remove the `.html`, these will be: `https://XXXX.z13.web.core.windows.net/auth-end`.
1. Next, enable implicit grant by checking the following boxes:  
    - ID Token  
    - Access Token  
1. Click **Save**.

### Step 3: Update App Service
1. Locate the value of key `siteName` in the file `.fx/env.default.json`. This will be the name of your Azure Resource.
1. Find the Resource in your Subscription in [Azure Portal](https://portal.azure.com).
1. Navigate to the **CORS** blade in your resource (An `Azure Web App` resource). Copy the value of key `fx-resource-frontend-hosting.endpoint` in file `env.default.json`. Paste in the **Allowed Origins** in **CORS** and click **Save**.  
1. Navigate to **Configuration** for your resource. Copy the value of key `remoteTeamsAppId` from the file `.fx/env.default.json`. Click **New application setting**. Add two settings, one is named `TEAMS_APP_ID`, its value is `remoteTeamsAppId` we just copied. Add another named `TEAMSFX_ENDPOINT`, and set its value to the endpoint URL we copied in the previous step. Then click **Save**.

### Step 4: Update env file in project
1. In `tabs/.env`, change the value of `REACT_APP_TEAMSFX_ENDPOINT` to the value of the `siteEndpoint` key in file `.fx/env.default.json`. 
1. Add a new line `REACT_APP_GRAPH_SCOPES=User.Read`

### Step 5: Deploy the resource
1. Go back to Visual Studio Code,Microsoft Teams Toolkit extension, open the command palette and select: `Teams: Deploy to the Cloud`.
1. Select both `Tab` and `Bot` in the next step.

## Use the app in Teams
To use the meeting app, you can schedule a meeting and manually upload your app package.
>Please use the Teams desktop client to load the app.

- Schedule a meeting with at least one other participant.
- Edit the scheduled meeting in the Teams app.
- Press the '+' button in the tabs area of the meeting, then select 'Manage apps'.
- Click the 'Upload custom app' from the bottom right corner.
- Upload the corresponding app package:
    - If built locally: Go to the `manifest/local` folder and zip the three files under local folder. 
        >Ensure the zip file contains only three files, no extra folder layers in the zip file.
    - If deployed to Azure: Go to [Teams Developer Portal](https://dev.teams.microsoft.com/apps), find the app which Teams Toolkit just registered in deployment step. Click `...` in the right and click `Download app package`.
- Select the zip file to upload.
- Once you see it in a meeting's list of managed apps, press the '+' again to add it to the meeting.
- Join the meeting and open the app to see it in action.

## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

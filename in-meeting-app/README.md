# Meeting Apps

> ## WARNING: This repository is under active development and the samples are not guaranteed to work!
> This warning will be removed when the samples are ready for consumption

Meeting apps are Teams-aware webpages embedded in Microsoft Teams. They are scoped to group and teams. Add a meeting to an app from its installation page.

## What you will learn in this sample
- How to build tab app for your Meeting App. 
- How to build a bot for your Meeting App. 
- How to use Microsoft Teams sdk to get Teams user login information. 
- How to use MS graph client to get access to M365 data. 
- How to use Teams Toolkit to provision and deploy your app to Azure. 

## Prerequisites
-  [NodeJS](https://nodejs.org/en/)

-  [ngrok](https://ngrok.com/)

-  [M365 developer account](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant) or access to a Teams account with the appropriate permissions to install an app.

-  An active Azure subscription if you want to hosting the app in Azure. [Activate a free 30-day trial Microsoft Azure account](https://azureinfo.microsoft.com/us-freetrial.html).

### ngrok

Teams needs to access your tab from a publically accessible URL. If you are running your app in localhost, you will need to use a tunneling service like ngrok. Run ngrok and point it to localhost.
  `ngrok http https://localhost:3000`

Note: It may be worth purchasing a basic subscription to ngrok so you can get a fixed subdomain ( see the --subdomain ngrok parameter)

**IMPORTANT**: If you don't have a paid subscription to ngrok, you will need to update your Azure AD app registration application ID URI and redirect URL, env files in this project and manifest file everytime you restart ngrok.

## Running the sample in local

### Step 1: Bot Channel Register in Azure
1. Start an ngrok session as indicated above. Note the ngrok endpoint (Example: `https://f631****.ngrok.io`), as you will use this in the registration steps below.
1. Register your bot using bot channel registration in Azure AD portal, following the instructions [here](docs/azure-bot-channels-registration.md).

### Step 2: Register Azure AD applications
1. Update the AAD app registration for tab SSO, following the instructions [here](docs/auth-aad-sso.md). The "fully qualified domain name" in the instructions will be your ngrok domain (Example: `f631****.ngrok.io`).
1. Replace the placeholders of the following keys with their acutal value, if there is any in the tabs/.env.development.local and bot/.env.development.local files:
    - `"appid"`: Application (client) ID of the bot's Azure AD application
    - `"clientSecret"`: client secret of the bot's Azure AD application
    - `"baseUrl "`: The ngrok endpoint (Example: `https://f631****.ngrok.io`)

### Step 3: Add the following entry to the manifest/local/manifest.json ([schema reference](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema))
1. Replace the placeholders of the following keys with their acutal value in manifest file:
    - `"appid"`: Application (client) ID of the bot's Azure AD application
    - `"baseUrl "`: The ngrok endpoint (Example: `https://f631****.ngrok.io`)
    - `"baseUrlDomain "`: The ngrok domain (Example: `f631****.ngrok.io`)
    - `"applicationIDURI"`: Application ID URI of the AAD (Example: `api://f631****.ngrok.io/00000000-0000-0000-0000-000000000000`)

### Step 4: Build and run the tabs
1. Navigate to the `tabs` folder in a terminal
2. Run `npm install`
3. Run `npm start` to start frontend. 
  
### Step 5: Build and run the bot
1. Navigate to the `bot` folder in a terminal
2. Run `npm install`
3. Run `npm start:local` to start bot and api server. 

## Deploy to Teams
- Schedule a meeting with at least one other participant.
- Edit the scheduled meeting in Teams client or Teams webapp.
- Press the '+' button, then select 'Manage apps'.
- Click the 'Upload custom app' from the bottom right corner.
- Go to manifest/local folder and zip the three files under local folder. Ensure the zip file contains only three files, no extra folder layers in the zip file.
- Select the zip file to upload.
- Once you see it in a meeting's list of managed apps, press the '+' again to add it to meeting.
- Join the meeting and open the app to see it in action. 

### NOTE: First time debug step (such as api server)
- Open a JavaScript Debug Terminal in Visual studio code and navigate to the `bot` folder
- Add a breakpoint (like line 134 in bot/index.js)
- Run `npm install` then `npm start:local`
- Open a Terminal in Visual studio code, navigate to the `tabs` folder and run `npm install` `npm start`
- Follow the steps in `Deploy to Teams` (if already installed the app please unistall it first). Then in action, it will hit the break point.

## Running the sample in Azure

### Step 1: Provision the resource in Azure
1. Click `Provision in the Cloud` in PROJECT panel of Microsoft Teams Toolkit extension. 
    - or select `Teams: Provision in the Cloud` from command palette (invoke command palette by pressing `ctrl + shift + p`). 
    This step will create an app in Teams Developer Portal.
    > **!Important** This step may require you to login Microsoft Teams Toolkit extension first. **Make sure you are using your M365 tenant admin account.** 
    > If it does not ask you to login, the toolkit may cache account information for you. Check your login account and make sure you are using the right account.

### Step 2: Update Azure AD applications
1. Go to Azure Portal -> Azure Active Directory -> App Registrations.
2. In owned applications, select the AAD application which its name is the same with you app name.
3. Navigate to **Authentication**

    Change the redirect URI, remove the '.html', these will be: `https://XXXX.z13.web.core.windows.ne/auth-end`.

    Next, enable implicit grant by checking the following boxes:  
    ? ID Token  
    ? Access Token  

    Then click **Save**.

### Step 3: Update App Service
1. Find the Resource in your Subscription, its name is under `.fx` folder in your project, key `siteName` in file `env.default.json`.
2. Navigate to **CORS**  in your resource

    Copy the endpoint in file `env.default.json`, its key is `endpoint` under `fx-resource-frontend-hosting`. Write down it as endpoint and it will be used.
    Next, paste in the **Allowed Origins** in **CORS**.
    Then click **Save**.  

3. Navigate to **Configuration**  in your resource
     Copy the teamsappid in file `env.default.json`, its key is `remoteTeamsAppId`. Write down it as teamsappid and it will be used.
     Next,click **New application setting**. Add two settings, one is named `TEAMS_APP_ID`, its value is teamsappid we just copied. Another is named `TEAMSFX_ENDPOINT`, its value is endpoint we just copied.
     Then click **Save**.  

### Step 4: Update env file in project
1. In tabs/.env, change the value of `REACT_APP_TEAMSFX_ENDPOINT`, its value is the `siteEndpoint` in file `env.default.json`. Then add a new line `REACT_APP_GRAPH_SCOPES=User.Read`

### Step 5: Deploy the resource
1. Go back to Microsoft Teams Toolkit extension, click `Deploy to the Cloud` in PROJECT panel.
    - or select `Teams: Deploy to the Cloud` from command palette (invoke command palette by pressing `ctrl + shift + p`).  
    Select both `Tab` and `Bot`.

### Step 6: Try it in Teams
1. Go to [Teams Developer Portal](https://dev.teams.microsoft.com/apps), find the app which Teams Toolkit just registered, its `App ID` is the teamsappid we just copied.
2. Click `...` in the left and click `Download app package`.
3. Follow the steps in **Deploy to Teams**, the zip file change to the package we just downloaded.

## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

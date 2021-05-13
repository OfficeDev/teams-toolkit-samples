# Meeting Apps

> ## WARNING: This repository is under active development and the samples are not guaranteed to work!
> This warning will be removed when the samples are ready for consumption

Meeting apps are Teams-aware webpages embedded in Microsoft Teams. They are scoped to group and teams. Add a meeting to an app from its installation page.

## What you will learn in this sample
- How to build tab app for your Meeting App. 
- How to build a bot for your Meeting App. 
- How to use Microsoft Teams sdk to get Teams user login information. 
- How to use MS graph client to get access to M365 data. 

## Prerequisites
-  [NodeJS](https://nodejs.org/en/)

-  [ngrok](https://ngrok.com/)

-  [M365 developer account](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant) or access to a Teams account with the appropriate permissions to install an app.

## ngrok

Teams needs to access your tab from a publically accessible URL. If you are running your app in localhost, you will need to use a tunneling service like ngrok. Run ngrok and point it to localhost.
  `ngrok http https://localhost:3000`

Note: It may be worth purchasing a basic subscription to ngrok so you can get a fixed subdomain ( see the --subdomain ngrok parameter)

**IMPORTANT**: If you don't have a paid subscription to ngrok, you will need to update your Azure AD app registration application ID URI and redirect URL, env files in this project and manifest file everytime you restart ngrok.

## Running the sample

### Step 1: Bot Channel Register in Azure
1. Start an ngrok session as indicated above. Note the ngrok endpoint (Example: `https://f631****.ngrok.io`), as you will use this in the registration steps below.
1. Register your bot using bot channel registration in Azure AD portal, following the instructions [here](docs/azure-bot-channels-registration.md).

### Step 2: Register Azure AD applications
1. Update the AAD app registration for tab SSO, following the instructions [here](docs/auth-aad-sso.md). The "fully qualified domain name" in the instructions will be your ngrok domain (Example: `f631****.ngrok.io`).
1. Replace the placeholders of the following keys with their acutal value, if there is any in the tabs/.env and bot/.env files:
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
3. Run `npm start` to start bot and api server. 

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
- Run `npm install` then `npm start`
- Open a Terminal in Visual studio code, navigate to the `tabs` folder and run `npm install` `npm start`
- Follow the steps in `Deploy to Teams` (if already installed the app please unistall it first). Then in action, it will hit the break point.


## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# How to use this In-meeting app HelloWorld app

> Important: Please be advised that access tokens are stored in sessionStorage for you by default. This can make it possible for malicious code in your app (or code pasted into a console on your page) to access APIs at the same privilege level as your client application. Please ensure you only request the minimum necessary scopes from your client application, and perform any sensitive operations from server side code that your client has to authenticate with.

Microsoft Teams supports the ability to run web-based UI inside "custom tabs" that users can install either for just themselves (personal tabs) or within a team or group chat context. Please be advised that mgt-teamsfx-provider library in this app is currently in preview stage, please expect breaking changes in the future release.

## Prerequisites

- [NodeJS](https://nodejs.org/en/)
- An M365 account. If you do not have M365 account, apply one from [M365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version after 1.55
- [Ngrok]

## Edit the manifest

1. Start Ngrok using command `ngrok http https://localhost:53000`, if the ngrok show error and let you log in to get the feature, please follow the tutorial in its return log. 
2. Get the forwarding endpoint in https, it looks like `https://XX-XX-XX-XX.ngrok.io`
3. You can find the Teams app manifest for local in `templates/appPackage` folder. The folder contains two manifest files:
we need this one `manifest.local.template.json`. Change the `{{{NGROK_ENDPOINT}}}` placholder to the ngrok forwarding endpoint.

## Prepare a meeting
Follow the instruction to [create a meeting in Teams](https://support.microsoft.com/en-us/office/create-a-meeting-in-teams-for-personal-and-small-business-use-eb571219-517b-49bf-afe1-4fff091efa85). Then in the Calendar you could find it, double click the meeting then you could see the meeting detail, this step makes the meetig enable.

## Debug

- From Visual Studio Code: Start debugging the project by hitting the `F5` key in Visual Studio Code. 
- Alternatively use the `Run and Debug Activity Panel` in Visual Studio Code and click the `Run and Debug` green arrow button.
- In the pop up browser, click `Add to a meeting`, select the meeting you created just now. Click `Set up a tab`, Then it will go to the meeting page.
- In the configure page, click `Save`, after a while, you will see the meeting chat tab.
- Click `Join` to join the meeting
- Select the tab (Default name called `My Tab`) in the bar. You will see the meeting side panel tab.

## Deploy to Azure

Deploy your project to Azure by following these steps:

- Open Teams Toolkit, and sign into Azure by clicking the `Sign in to Azure` under the `ACCOUNTS` section from sidebar.
- After you signed in, select a subscription under your account.
- Open the Teams Toolkit and click `Provision in the cloud` from DEVELOPMENT section or open the command palette and select: `Teams: Provision in the cloud`.
- Open the Teams Toolkit and click `Deploy to the cloud` or open the command palette and select: `Teams: Deploy to the cloud`.

> Note: Provisioning and deployment may incur charges to your Azure Subscription.

## Preview

Once the provisioning and deployment steps are finished, you can preview your app:

- From Visual Studio Code

  1. Open the `Run and Debug Activity Panel`.
  1. Select `Launch Remote (Edge)` or `Launch Remote (Chrome)` from the launch configuration drop-down.
  1. Press the Play (green arrow) button to launch your app - now running remotely from Azure.
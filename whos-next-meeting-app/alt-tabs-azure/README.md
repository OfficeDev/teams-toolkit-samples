# Alternate implementation for Azure Fluid Relay Service

## Summary

If you wish to host the Fluid Relay Service in Azure instead of using the Live Share provided Fluid Relay Service,
you can find alternative sources for the /tabs folder here. You'll need to provision your own Fluid Relay Service
in Azure and enter the details into your .env.teamsfx.* file as follows.

This version provisions a new container in the Azure Fluid Relay service when a meeting tab is configured, and that tab will continue to use the same container over time.

This new version is not secure; it uses the `InsecureTokenProvider` to connect to the service in Azure. The LiveShare-hosted service is secure, with access limited to those in the meeting.

## Provision an Azure Fluid Relay Service

This application displays the same list of speakers to all meeting attendees with real-time updates. The Fluid Framework makes this easy, but to use it you need to provision an instance of the Azure Fluid Relay service somewhere in Azure.

For complete instructions, see [this How to article](https://learn.microsoft.com/azure/azure-fluid-relay/how-tos/provision-fluid-azure-portal).

![Access key screen](/assets/AzureFluidRelayService.png)

When you're finished deploying the service, go to the Access Key tab and copy down the tenant ID, primary key, and service endpoint URL and save them for when you configure your application.

> Note: Provision Azure cloud resources and deploy to Azure may cause charges to your Azure Subscription.

## Prepare a meeting

Follow the instruction to [create a meeting in Teams](https://support.microsoft.com/office/create-a-meeting-in-teams-for-personal-and-small-business-use-eb571219-517b-49bf-afe1-4fff091efa85). Then in the Calendar you can find the meeting you just created. Double click the meeting will open the meeting details, and will enable the meeting app to be added in this meeting in later steps.

## Run the app locally

- Add the Fluid Relay Service details into your /src/tabs/.env.teamsfx.local file:

~~~text
REACT_APP_FLUID_CONNECTION_TYPE=remote
REACT_APP_FLUID_REMOTE_TENANT_ID=(your tenant ID)
REACT_APP_FLUID_REMOTE_PRIMARY_KEY=(your primary key)
REACT_APP_FLUID_REMOTE_ENDPOINT=(your endpoint URL)
~~~

- In Visual Studio Code: Start debugging the project by hitting the `F5` key in your keyboard. 
  - Alternatively open the `Run and Debug Activity` panel(Ctrl+Shift+D) in Visual Studio Code and click the `Run and Debug` green arrow button.
- The Teams web client will launch in your browser, click the small arrow sit aside the `Add` button and select `Add to a meeting`, then select the meeting you just created. 
- Click `Set up a tab` in the next step, it will take you to the meeting configuration page.
- In the configuration page, click `Save`, this may take several minutes, and then you will see the meeting chat tab.
- Click `Join` to join the meeting.
- Select the tab (default name is `My Tab`) in the bar, you will see a side panel tab in the meeting.

## Deploy the app to Azure

Deploy your project to Azure by following these steps:

- Add the Fluid Relay Service details into your /src/tabs/.env.teamsfx.dev file:

~~~text
REACT_APP_FLUID_CONNECTION_TYPE=remote
REACT_APP_FLUID_REMOTE_TENANT_ID=(your tenant ID)
REACT_APP_FLUID_REMOTE_PRIMARY_KEY=(your primary key)
REACT_APP_FLUID_REMOTE_ENDPOINT=(your endpoint URL)
~~~

- Open Teams Toolkit in Visual Studio Code, and sign in your Azure account by clicking the `Sign in to Azure` in the `ACCOUNTS` section from sidebar.
- After you signed in, select a subscription under your account. The Teams Toolkit will use this subscription to provision Azure resources to host you app.
- Open the Teams Toolkit and click `Provision in the cloud` in the `DEVELOPMENT` section.
  - Alternatively open the command palette(Ctrl+Shift+P) and type: `Teams: Provision in the cloud` command.
- Open the Teams Toolkit and click `Deploy to the cloud` in the `DEVELOPMENT` section.
  - Alternatively open the command palette(Ctrl+Shift+P) and type: `Teams: Deploy to the cloud` command.

> Note: Provision Azure cloud resources and deploy to Azure may cause charges to your Azure Subscription.

## Preview the app in Teams client

After you have completed the provision and deploy steps in `Deploy the app to Azure` section, you can preview your app in Teams client by following steps below:

- In Visual Studio Code

  1. Open the `Run and Debug Activity` panel from sidebar, or use short key Ctrl+Shift+D.
  1. Select `Launch Remote (Edge)` or `Launch Remote (Chrome)` in the launch configuration (a dropdown selection in the upper-left corner).
  1. Press the `Start Debugging` (small green arrow) button to launch your app, the Teams web client will be automatically opened in your browser, where you will see your app running remotely from Azure.


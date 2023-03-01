# Getting Started with Team Central Dashboard Sample

> Note: We really appreciate your feedback! If you encounter any issue or error, please report issues to us following the [Supporting Guide](./../SUPPORT.md). Meanwhile you can make [recording](https://aka.ms/teamsfx-record) of your journey with our product, they really make the product better. Thank you!
>
> This warning will be removed when the samples are ready for production.

> Important: Please be advised that access tokens are stored in sessionStorage for you by default. This can make it possible for malicious code in your app (or code pasted into a console on your page) to access APIs at the same privilege level as your client application. Please ensure you only request the minimum necessary scopes from your client application, and perform any sensitive operations from server side code that your client has to authenticate with.
Microsoft Teams supports the ability to run web-based UI inside "custom tabs" that users can install either for just themselves (personal tabs) or within a team or group chat context.

Team Central Dashboard shows you how to build a tab with data chats and content from Microsoft Graph to accelerate team collaboration and personal productivity.

![team-central-dashboard](images/team-central-dashboard.gif)

## Prerequisites

- [NodeJS](https://nodejs.org/en/), fully tested on NodeJS 14, 16
- An M365 account. If you do not have M365 account, apply one from [M365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) or [TeamsFx CLI](https://aka.ms/teamsfx-cli)

## What you will learn in this sample:

- How to use TeamsFx to embed a canvas containing multiple cards that provide an overview of data or content in your tab app.
- How to use TeamsFx to build frontend hosting on Azure for your tab app.
- How to use TeamsFx to build backend hosting on Azure for your tab app.
- How to use MS graph client in TeamsFx to get access to M365 data.

## Try the Sample with Visual Studio Code Extension:
> Here are the instructions to run the sample in **Visual Studio Code**. You can also try to run the app using TeamsFx CLI tool, refer to [Try the Sample with TeamsFx CLI](cli.md)
1. Clone the repo to your local workspace or directly download the source code.
2. Download [Visual Studio Code](https://code.visualstudio.com) and install [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit).
3. Open the project in Visual Studio Code.
4. Start debugging the project by hitting the `F5` key in Visual Studio Code.

> The first time you run this sample, you need to login to consent some delegated permissions. If you don't see the consent page, please check if your browser blocks the pop-up window.
<img src="public\popup-block.png">

> Consent `"TeamsActivity.Send"` permission: 
>
> To consent the "TeamsActivity.Send" permission, you should do the following steps after provision or run local debug twice.
> 
> Go to [Azure portal](https://portal.azure.com/) > Click `Azure Active Directory` > Click `App registrations` in the side bar > Click your Dashboard app > Click `API permissions` in the side bar > Click `+Add a permission` > Choose `Microsoft Graph` > Choose `Application permissions` > Find the two permissions `TeamsActivity.Send` and `TeamsAppInstallation.ReadForUser.All` > Click `Add permissions` button in the bottom > Click `✔Grant admin consent for XXX` and then click `Yes` button to finish the admin consent.

## Implemented Features  

### Area Chart
This widget displays a chart and a table with dummy data. You can select a date range to filter the data. 

<img src="public\area-chart.png" style="zoom: 50%"> 

### Team Collaboration
This widget displays some collaboration cards with dummy data.

<img src="public\collaborations.png" style="zoom: 30%">

### Your upcoming events

This widget displays the upcoming events on your calendar. You can click the `Join` button to join a meeting, and click the `View calendar` button to open your calendar app.

<img src="public\join-meeting.png" style="zoom: 50%">


### Your tasks

This widget displays your to-do tasks. Your can input a task name and click the `Add` button to add a new task. You also can click the `View all` button to open your task app.

<img src="public\add-task.png" style="zoom: 45%">

<img src="public\task-notification.png">

### Your documents
This widget displays your content files in OneDrive. You can click one to open it. You can also click the `...` button on the right to choose the way to open the file, download the file or copy the file link.

<img src="public\document.png" style="zoom: 50%">

**Known Issue**: In mobile devices, the feature of open in Teams may not work.

## Edit the manifest

You can find the Teams manifest in [appPackage](appPackage) folder. The templates contains:
* `manifest.json`: Manifest file for Teams app running locally and remotely.

Both file contains template arguments with `{...}` statements which will be replaced at build time. You may add any extra properties or permissions you require to this file. See the [schema reference](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema) for more.

## Deploy to Azure

Deploy your project to Azure by following these steps:

| From Visual Studio Code                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | From TeamsFx CLI                                                                                                                                                                                                                    |
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <ul><li>Open Teams Toolkit, and sign into Azure by clicking the `Sign in to Azure` under the `ACCOUNTS` section from sidebar.</li> <li>After you signed in, select a subscription under your account.</li><li>Open the Teams Toolkit and click `Provision in the cloud` from DEPLOYMENT section or open the command palette and select: `Teams: Provision in the cloud`.</li><li>Open the Teams Toolkit and click `Deploy to the cloud` or open the command palette and select: `Teams: Deploy to the cloud`.</li></ul> | <ul> <li>Run command `teamsfx account login azure`.</li> <li>Run command `teamsfx account set --subscription <your-subscription-id>`.</li> <li> Run command `teamsfx provision`.</li> <li>Run command: `teamsfx deploy`. </li></ul> |

> Note: Provisioning and deployment may incur charges to your Azure Subscription.

## Package

- From Visual Studio Code: open the command palette and select `Teams: Zip Teams metadata package`.
- Alternatively, from the command line run `teamsfx package` in the project directory.

## Publish to Teams

Once deployed, you may want to distribute your application to your organization's internal app store in Teams. Your app will be submitted for admin approval.

- From Visual Studio Code: open the Teams Toolkit and click `Publish to Teams` or open the command palette and select: `Teams: Publish to Teams`.
- From TeamsFx CLI: run command `teamsfx publish` in your project directory.

## Architecture

- The frontend is a react tab app hosted on [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/).
- The Backend server is hosted on [Azure Function](https://docs.microsoft.com/en-us/azure/azure-functions/) for managing posts in the tab app.

### Code structure

- You can check app configuration in `teamsapp.*.yml` files
- You can check app environment information in: [env](env)
- You will find frontend code in: [src](src)
- You will find backend code in: [api/finishTaskNotification](api/finishTaskNotification)

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

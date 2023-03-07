# Getting Started with Developer Assist Dashboard Sample

> Note: We really appreciate your feedback! If you encounter any issue or error, please report issues to us following the [Supporting Guide](./../SUPPORT.md). Meanwhile you can make [recording](https://aka.ms/teamsfx-record) of your journey with our product, they really make the product better. Thank you!
>
> This warning will be removed when the samples are ready for production.

> Important: Please be advised that access tokens are stored in sessionStorage for you by default. This can make it possible for malicious code in your app (or code pasted into a console on your page) to access APIs at the same privilege level as your client application. Please ensure you only request the minimum necessary scopes from your client application, and perform any sensitive operations from server side code that your client has to authenticate with.
Microsoft Teams supports the ability to run web-based UI inside "custom tabs" that users can install either for just themselves (personal tabs) or within a team or group chat context.

Developer Assist Dashboard shows you how to build a tab with Azure DevOps work items, GitHub issues and Planner tasks to accelerate developer team collaboration and productivity. Developer Assist Dashboard is capable of working on Microsoft Teams, Outlook Web and Microsoft 365 app.

<https://user-images.githubusercontent.com/36196437/223398461-e3f5a521-6439-407c-a458-584c769f730b.mp4>

## Prerequisites

* [NodeJS](https://nodejs.org/en/), fully tested on NodeJS 14, 16, 18
* An M365 account. If you do not have M365 account, apply one from [M365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
* [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) or [TeamsFx CLI](https://aka.ms/teamsfx-cli)

## What will you learn in this sample?

* How to use TeamsFx to embed a canvas containing multiple cards that provide an overview of data or content in your tab app.
* How to use TeamsFx to build frontend hosting on Azure for your tab app.
* How to use TeamsFx to build backend hosting on Azure for your tab app.
* How to use DevOps, GitHub, and Microsoft Graph APIs in TeamsFx to get access to variety of data.

## Try the Sample with Visual Studio Code Extension

>Here are the instructions to run the sample in **Visual Studio Code**. You can also try to run the app using TeamsFx CLI tool, refer to [Try the Sample with TeamsFx CLI](cli.md)

1. Clone the repo to your local workspace or directly download the source code.
1. Download [Visual Studio Code](https://code.visualstudio.com) and install [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit).
1. Open the project in Visual Studio Code.
1. Update `./src/configs.ts` file with required DevOps, GitHub and Planner configurations. For more details, read [Implemented Features](https://github.com/aycabas/dev-assist-dashboard#implemented-features) section.

> The first time you run this sample, you need to login to consent some delegated permissions. If you don't see the consent page, please check if your browser blocks the pop-up window.
![pop-up block](images/popup-block.png)

## Implemented Features

### Azure DevOps Work Items

This widget displays DevOps Work Items including the title, type, assigned to and state of the work item.
![devops-widget](/images/devops-backlog.png)

**To integrate DevOps Work Items in the dashboard, follow the instructions:**

1. Login to [Azure DevOps](https://dev.azure.com/) and select the project you want to configure in the Developer Assist Dashboard. Copy the `organization name` and `project name` from the project url.
1. In Azure DevOps, select **User settings** and then select **Personal access token**. Select **+ New token** to create a new personal access token, give a name to your token, select **Read** permission for Work Items and **Create**.
1. Open `./src/configs.ts` file in Developer Assist Dashboard project:
    * Add the values of **ORGANIZATION_NAME** and **PROJECT_NAME** with your `organization name` and `project name`.
    * Add the value of **DEVOPS_PERSONAL_ACCESS_TOKEN** with your personal access token.

### GitHub Issues

This widget displays GitHub issues including the title, status and the url of the GitHub issue. This widget also includes creating a new issue:
![github-widget](/images/github-issues.png)

**To integrate GitHub issues in the dashboard, follow the instructions:**

1. Login to [GitHub](https://github.com/) and select **Settings > Developer settings > Personal access token**. Select **Generate new token** to create new personal access token. Give a name to your token, select the repositories you want to access. Under `Repository permissions`, give **Read and write** access to **Issues**.
1. Open `./src/configs.ts` file in Developer Assist Dashboard project:
    * Add the value of **GITHUB_PERSONAL_ACCESS_TOKEN** with your personal access token.
    * Add the values of **REPOSITORY_OWNER_NAME** and **REPOSITORY_NAME** with your GitHub username and your repository name.

### Planner Tasks

This widget displays Planner tasks including the title of the task. This widget also includes creating a new task functionality:
![planner-widget](/images/planner-task.png)

**To integrate Planner tasks in the dashboard, follow the instructions:**

1. Visit [Microsoft Graph Explorer](aka.ms/ge), select profile icon on the right side and login with your Microsoft 365 developer account.
    1. Type `https://graph.microsoft.com/v1.0/planner/plans` in Graph Explorer query box and select **Run query**. Copy the id of the plan you wish to use.
    1. Type `https://graph.microsoft.com/v1.0/planner/plans/{Plan-Id}/buckets` in Graph Explorer query box and replace {Plan-Id} with your **plan-id** and select **Run query**. Copy the id of the bucket you'd like to see in your dashboard.
1. Open `./src/configs.ts` file in Developer Assist Dashboard project:
    * Add the value of **PLAN_ID** with your plan id.
    * Add the value of **BUCKET_ID** with your bucket id.

## Edit the Manifest

You can find the Teams manifest in `appPackage` folder. The templates contains:

* `manifest.json`: Manifest file for Teams app running locally and remotely.

Both file contains template arguments with `{...}` statements which will be replaced at build time. You may add any extra properties or permissions you require to this file. See the [schema reference](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema) for more.

## Deploy to Azure

Deploy your project to Azure by following these steps:

| From Visual Studio Code                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | From TeamsFx CLI                                                                                                                                                                                                                    |
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <ul><li>Open Teams Toolkit, and sign into Azure by clicking the `Sign in to Azure` under the `ACCOUNTS` section from sidebar.</li> <li>After you signed in, select a subscription under your account.</li><li>Open the Teams Toolkit and click `Provision in the cloud` from DEPLOYMENT section or open the command palette and select: `Teams: Provision in the cloud`.</li><li>Open the Teams Toolkit and click `Deploy to the cloud` or open the command palette and select: `Teams: Deploy to the cloud`.</li></ul> | <ul> <li>Run command `teamsfx account login azure`.</li> <li>Run command `teamsfx account set --subscription <your-subscription-id>`.</li> <li> Run command `teamsfx provision`.</li> <li>Run command: `teamsfx deploy`. </li></ul> |

> Note: Provisioning and deployment may incur charges to your Azure Subscription.

## Package

* From Visual Studio Code: open the command palette and select `Teams: Zip Teams metadata package`.
* Alternatively, from the command line run `teamsfx package` in the project directory.

## Publish to Microsoft Teams

Once deployed, you may want to distribute your application to your organization's internal app store in Teams. Your app will be submitted for admin approval.

* From Visual Studio Code: open the Teams Toolkit and click `Publish to Teams` or open the command palette and select: `Teams: Publish to Teams`.
* From TeamsFx CLI: run command `teamsfx publish` in your project directory.

## Architecture

* The frontend is a react tab app hosted on [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/).
* The Backend server is hosted on [Azure Function](https://docs.microsoft.com/en-us/azure/azure-functions/) for managing posts in the tab app.

### Code Structure

* You can check app configuration in `teamsapp.*.yml` files
* You can check app environment information in: [env](env)
* You will find frontend code in: [src/views/widgets](src/views/widgets)
* You will find backend code in: [src/services](src/services)

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

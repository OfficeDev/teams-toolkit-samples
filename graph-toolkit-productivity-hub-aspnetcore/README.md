# Getting Started with One Productivity Hub ASP.NET Core Sample

> Note: We really appreciate your feedback! If you encounter any issue or error, please report issues to us following the [Supporting Guide](./../SUPPORT.md). Meanwhile you can make [recording](https://aka.ms/teamsfx-record) of your journey with our product, they really make the product better. Thank you!
>  
> This warning will be removed when the samples are ready for production.

One Productivity Hub sample shows you how to build a tab for viewing your calendar events, to-do tasks and files by using [Microsoft Graph Toolkit](https://docs.microsoft.com/en-us/graph/toolkit/overview) components and [MSAL2 Provider](https://docs.microsoft.com/en-us/graph/toolkit/providers/msal2).

![One Productivity Hub Overview](images/oneproductivityhub-overview-proxy.gif)

## Prerequisite

- [Visual Studio 2022](https://visualstudio.microsoft.com/), version 17.3 or higher.
- Latest [Teams Toolkit for Visual Studio](https://docs.microsoft.com/en-us/microsoftteams/platform/toolkit/teams-toolkit-overview-visual-studio).
- An M365 account. If you do not have M365 account, apply one from [M365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program).

## What you will learn in this sample

- How to use TeamsFx to build frontend hosting on Azure for your tab app.
- How to integration TeamsFx with Microsoft Graph Toolkit library.

## Try the Sample with Visual Studio Extension

### Local Debug the Sample

1. Clone the repo to your local workspace or directly download the source code.
1. Download [Visual Studio](https://visualstudio.microsoft.com/) and install [Teams Toolkit for Visual Studio Extension](https://docs.microsoft.com/en-us/microsoftteams/platform/toolkit/visual-studio-overview).
1. Open the project in Visual Studio.
1. Right click to the project, select **Teams Toolkit > Prepare Teams App Dependencies**.
1. Press "F5" to open a browser window and then select your package to view one productivity hub app.

### Provision and Deploy the Sample to Azure

> If you don't have an Azure subscription, create [a free account](https://azure.microsoft.com/en-us/free/) before you begin

You can create and automatically configure cloud resources for hosting your app in Azure using Teams Toolkit.

1. Select the **OneProductivityHubNetCore > Teams Toolkit > Provision in the Cloud** menu.
1. In the Select your subscription window, choose the Azure subscription you want to use to create resources with.

Teams Toolkit will create Azure resources in this subscription but no code is deployed during this step. To deploy your project to these new resources:

1. Select the **OneProductivityHubNetCore > Teams Toolkit > Deploy in the Cloud** menu.

## Use the app in Teams

1. If you are running the for the first time, you need to consent the required permissions for Microsoft Graph. Select **Accept** to consent permissions.

    ![Consent](images/consent.png)

1. Scroll down to review your calendar events, to-do tasks and file folders in One Productivity Hub tab.

    ![Select](images/oneproductivityhub-proxy.png)
## Code structure

- You can check app configuration and environment information in: [OneProductivityHubNetCore/.fx](OneProductivityHubNetCore/.fx)
- You will find Microsoft Graph Toolkit SDK code in: [OneProductivityHubNetCore/_Host.cshtml](OneProductivityHubNetCore/_Host.cshtml)
- You will find frontend code in: [OneProductivityHubNetCore/Pages/Tab.razor](OneProductivityHubNetCore/Pages/tab.razor)

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
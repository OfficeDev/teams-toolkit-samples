# Getting Started with Stocks Update Notification Bot Sample

Stocks Update Notifcation Bot is a an application that can be installed in different Microsoft Teams contexts, personal, group chat, or teams channel, which sends a message on a pre-defined schedule as an Adaptive Card to locations where it is installed.

![Stocks Update Notification Bot Overview](images/app.gif)

## Prerequisite

- [Visual Studio 2022](https://visualstudio.microsoft.com/), version 17.3 or higher.
- Latest [Teams Toolkit for Visual Studio](https://docs.microsoft.com/en-us/microsoftteams/platform/toolkit/teams-toolkit-overview-visual-studio).
- A Microsoft 365 account. If you do not have Microsoft 365 account, apply one from [Microsoft 365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program).

## What you will learn in this sample

- How to launch and debug an app using "F5" using Teams Toolkit for Visual Studio.
- How to use a bot in different contexts

## Try the Sample with Visual Studio Extension

### Local Debug the Sample

1. Clone the repo to your local workspace or directly download the source code.
1. Download [Visual Studio](https://visualstudio.microsoft.com/) and install [Teams Toolkit for Visual Studio Extension](https://docs.microsoft.com/en-us/microsoftteams/platform/toolkit/visual-studio-overview).
1. Open the project in Visual Studio.
1. Right click to the project, select **Teams Toolkit > Prepare Teams App Dependencies**.
1. Press "F5" to launch the bot 
1. Sideloading your app to view into Microsoft Teams to view the Stocks Update Notification bot.

### Provision and Deploy the Sample to Azure

> If you don't have an Azure subscription, create [a free account](https://azure.microsoft.com/en-us/free/) before you begin

You can create and automatically configure cloud resources for hosting your app in Azure using Teams Toolkit.

1. Select the **StocksUpdateNotificationBot > Teams Toolkit > Provision in the Cloud** menu.
1. In the Select your subscription window, choose the Azure subscription you want to use to create resources with.

Teams Toolkit will create Azure resources in this subscription but no code is deployed during this step. To deploy your project to these new resources:

1. Select the **StocksUpdateNotificationBot > Teams Toolkit > Deploy in the Cloud** menu.

## Use the app in Teams

1. When you install the app into Microsoft Teams, it will immediately begin to send messages every thirty seconds into the location where you have installed it. There is no additional configuration required.

## Code structure

- You can check app configuration and environment information in: [StocksUpdateNotificationBot/.fx](StocksUpdateNotificationBot/.fx)
- You will the bot code in: [StocksUpdateNotificationBot/NotifyTimerTrigger.cs](StocksUpdateNotificationBot/NotifyTimerTrigger.cs)
- You will fine the adaptive card template in: [StocksUpdateNotificationBot/Resources/notificationDefault.json](StocksUpdateNotificationBot/Resources/notificationDefault.json)

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
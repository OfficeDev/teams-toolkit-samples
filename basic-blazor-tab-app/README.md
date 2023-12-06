---
page_type: sample
languages:
- csharp
products:
- office-teams
- office
name: Basic Blazor Tab App using .NET
urlFragment: officedev-teamsfx-samples-tab-basic-blazor-tab-app
description: A Teams tab app built using the Blazor web framework
extensions:
  createdDate: "2023-06-06"
---
# Getting Started with Basic Blazor Tab App

Blazor is a feature of ASP.NET for building interactive web UIs. The Basic Blazor Tab App is a Teams Tab App built using the Blazor web framework, which supports both personal tab and configurable tab functionalities.

## This sample illustrates
- How to create, debug and deploy a Blazor Teams tab app.

## Prerequisite to use this sample
- [Visual Studio 2022](https://visualstudio.microsoft.com/), version 17.7 or higher.
- Latest [Teams Toolkit for Visual Studio](https://docs.microsoft.com/en-us/microsoftteams/platform/toolkit/teams-toolkit-overview-visual-studio).
- A Microsoft 365 account. If you do not have Microsoft 365 account, apply one from [Microsoft 365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program).


## Minimal path to awesome
### Run the app locally
1. Clone the repo to your local workspace or directly download the source code.
1. Open the project in Visual Studio.
1. Right click to the project, select **Teams Toolkit > Prepare Teams App Dependencies**.
1. Press "F5" to launch the bot
1. Sideloading your app to view into Microsoft Teams to view the Basic Blazor Tab App.

### Deploy the app to Azure
You can create and automatically configure cloud resources for hosting your app in Azure using Teams Toolkit.
1. If you don't have an Azure subscription, create [a free account](https://azure.microsoft.com/en-us/free/) before you begin
1. Select the **BasicBlazorTabApp > Teams Toolkit > Provision** menu. In the Select your subscription window, choose the Azure subscription you want to use to create resources with. Teams Toolkit will create Azure resources in this subscription but no code is deployed during this step.
1. Select the **BasicBlazorTabApp > Teams Toolkit > Deploy in the Cloud** menu to deploy your project to these new resources.

### Preview the app in Teams
1. When you install the app into Microsoft Teams, it will immediately begin to send messages every thirty seconds into the location where you have installed it. There is no additional configuration required.

## Version History
| Date         | Author        | Comments                               |
| ------------ | ------------- | -------------------------------------- |
| Jun 6, 2023  | ZhijieHuang   | Onboard sample in Teams Toolkit V5.0.0 |

## Feedback
We really appreciate your feedback! If you encounter any issue or error, please report issues to us following the [Supporting Guide](https://github.com/OfficeDev/TeamsFx-Samples/blob/dev/SUPPORT.md). Meanwhile you can make [recording](https://aka.ms/teamsfx-record) of your journey with our product, they really make the product better. Thank you!
---
page_type: sample
languages:
- typescript
products:
- office-teams
- office
name: Contact Exporter using Graph Toolkit
urlFragment: officedev-teamsfx-samples-tab-graph-toolkit-contact-exporter
description: Contact Exporter app of Microsoft Teams Tab app.
extensions:
  createdDate: "2021-11-30"
---
# Getting Started with Graph Toolkit Contact Exporter

Graph Toolkit Contact Exporter sample APP provides an easy way to export your teams contact info to Excel file. This APP is using [Microsoft Graph Toolkit](https://docs.microsoft.com/en-us/graph/toolkit/overview) as UI component.

![Contact Exporter Overview](assets/sampleDemo.gif)

> Note: This sample will only provision [single tenant](https://learn.microsoft.com/azure/active-directory/develop/single-and-multi-tenant-apps#who-can-sign-in-to-your-app) Azure Active Directory app. For multi-tenant support, please refer to this [wiki](https://aka.ms/teamsfx-multi-tenant).

## This sample illustrates

- How to use TeamsFx to build frontend hosting on Azure for your tab app.
- How to integration TeamsFx with Microsoft Graph Toolkit library.

## Prerequisite to use this sample

- [Node.js](https://nodejs.org/) version 16, 18
- A Microsoft 365 tenant in which you have permission to upload Teams apps. You can get a free Microsoft 365 developer tenant by joining the [Microsoft 365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program).
- [Microsoft 365 Agents Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [Microsoft 365 Agents Toolkit CLI](https://aka.ms/teams-toolkit-cli)

## Minimal path to awesome

### Run the app locally

- From VSCode

  1. Clone the repo to your local workspace or directly download the source code.
  1. Open the project in Visual Studio Code.
  1. Open Debug View (`Ctrl+Shift+D`) and select "Debug in Teams (Edge)" or "Debug in Teams (Chrome)" in dropdown list.
  1. Press "F5" to open a browser window and then select your package to view contact exporter sample app.

- From Microsoft 365 Agents Toolkit CLI
  1. Run command: `atk provision --env local` .
  1. Run command: `atk deploy --env local` .
  1. Run command: `atk preview --env local` .

### Deploy the app to Azure

> If you don't have an Azure subscription, create [a free account](https://azure.microsoft.com/en-us/free/) before you begin

- From VSCode

  1. Sign in to Azure by clicking `Sign in to Azure` under the `ACCOUNTS` section from sidebar.
  1. Click `Provision` from `LIFECYCLE` section or open the command palette and select: `Microsoft 365 Agents: Provision`.
  1. Click `Deploy` or open the command palette and select: `Microsoft 365 Agents: Deploy`.

- From Microsoft 365 Agents Toolkit CLI
  1. Run command: `atk auth login azure`.
  1. Run command: `atk provision --env dev`.
  1. Run command: `atk deploy --env dev`.

### Preview the app in Teams

- From VSCode:
  1. Once deployment is completed, you can preview the APP running in Azure. In Visual Studio Code, open `Run and Debug` and select `Launch Remote (Edge)` or `Launch Remote (Chrome)` in the dropdown list and Press `F5` or green arrow button to open a browser.
- From Microsoft 365 Agents Toolkit CLI:
  1. Run command: `atk preview --env dev`.

### Run the app locally with proxy
In some scenarios, it is helpful to skip the login and authentication flow and then provide mocked Graph API responses for development and test purpose. This sample provides a new way to debug it with proxy for mocking Graph API responses. You can customize the desired Graph API responses.
1. Refer to [Get started with Dev Proxy](https://learn.microsoft.com/en-us/microsoft-cloud/dev/dev-proxy/get-started?tabs=powershell&pivots=client-operating-system-windows) to install devproxy first.
1. Open the project with VS Code, open the `Run and Debug Activity` Panel and select `Debug in Teams with proxy (Edge)`. 
1. Please refer to [Proxy Mode](proxy/README.md) for more information.

## Advanced usage of this sample

1. The APP will look like this when it runs for the first time.

   ![Login Page](images/start.png)

1. For the first time to run the app, you need to consent the APP to use Microsoft Graph API and Graph Toolkit. Click on "Accept" button to accept the Authorization.

   ![Consent](images/consent.png)

1. You could try to typing name to select person to view the contact info.

   ![Select](images/select.png)

1. You could try to move your mouse to user name to view the personal card of the user.

   ![Card](images/card.png)

1. You could try to click 'Export Contact Table to Excel' button to export contact info to Excel.

## Known issues

- This template has adopted [Authorization Code Flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow) to implement SSO. There's a known limitation with mobile platforms such as iOS and a few Android versions where users have to sign in again as the state was not stored due to [third party cookie being blocked by the browser](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more).

- Due to system webview limitations, users in the tenant with conditional access policies applied cannot consent permissions when conduct an OAuth flow within the Teams mobile clients, it would show error: "xxx requires you to secure this device...".

To achieve full SSO experience, we will recommend you to implement OBO flow to pass your token to a server. See more [here](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/tab-sso-code#pass-the-access-token-to-server-side-code).

## Version History

| Date         | Author | Comments                               |
| ------------ | ------ | -------------------------------------- |
| May 18, 2022 | rentu  | update to support Teams Toolkit v4.0.0 |
| Mar 17, 2023 | rentu  | update to support Teams Toolkit v5.0.0 |

## Feedback

We really appreciate your feedback! If you encounter any issue or error, please report issues to us following the [Supporting Guide](https://github.com/OfficeDev/TeamsFx-Samples/blob/dev/SUPPORT.md). Meanwhile you can make [recording](https://aka.ms/teamsfx-record) of your journey with our product, they really make the product better. Thank you!

# Getting Started with Stocks Update Notification Bot

Bots can be used to deliver pro-active messages into different Microsoft Teams contexts, such as a personal bot chat, one to one or group chat, or a channel conversation.

The Stocks Update Notification bot shows you how to request data on a pretermined schedule from a public API using API Key authentication and render that data using an Adaptive Card in different Microsoft Teams contexts.

![Stocks Update Notification Bot](images/app.gif)

## This sample illustrates
- Use API client in TeamsFx to get access data in public API using the API Key provider.
- Render data in an Adaptive Card.

## Prerequisite to use this sample
- [Node.js](https://nodejs.org/), supported versions: 14, 16, 18 (preview)
- A Microsoft 365 account. If you do not have Microsoft 365 account, apply one from [Microsoft 365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) or [TeamsFx CLI](https://aka.ms/teamsfx-cli)


## Minimal path to awesome
### Run the app locally
1. Clone the repo to your local workspace or directly download the source code.
1. Download [Visual Studio Code](https://code.visualstudio.com) and install [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit).
1. Open the project in Visual Studio Code.
1. Update local environment variables in `env/.env.local` and `env/.env.local.user`
	
	 For the HTTP request to the public API to be succesful, the following environment variables need to be configured in the `env/.env.local` and `env/.env.local.user` files.

	 ```sh
	 # env/.env.local
	 TEAMSFX_API_ALPHAVANTAGE_ENDPOINT=https://www.alphavantage.co
	 # env/.env.local.user for secret
	 TEAMSFX_API_ALPHAVANTAGE_API_KEY=demo
	 ```
   > The demo key will not update values, you can [sign up for a free key](https://www.alphavantage.co/support/#api-key) for the Alpha Vantage service and update the `TEAMSFX_API_ALPHAVANTAGE_API_KEY` setting with your own key.
1. Start debugging the project by hitting the `F5` key in Visual Studio Code.

### Deploy the app to Azure
1. Open Teams Toolkit, and sign into Azure by clicking the `Sign in to Azure` under the `ACCOUNTS` section from sidebar.
1. Open the Teams Toolkit and click `Provision in the cloud` from DEPLOYMENT section or open the command palette and select: `Teams: Provision in the cloud`.
1. Open the Teams Toolkit and click `Deploy to the cloud` or open the command palette and select: `Teams: Deploy to the cloud`.
> Note: Provisioning and deployment may incur charges to your Azure Subscription.

### Preview the app in Teams
1. Once deployment is completed, you can preview the app running in Azure. In Visual Studio Code, open `Run and Debug` and select `Launch Remote (Edge)` or `Launch Remote (Chrome)` in the dropdown list and Press `F5` or green arrow button to open a browser.
  
## Version History
| Date         | Author        | Comments                               |
| ------------ | ------------- | -------------------------------------- |
| Aug 19, 2022 | garrytrinder  | update to support Teams Toolkit V4.0.0 |
| Dec 5, 2022  | XiaofuHuang   | update to support Teams Toolkit v5.0.0 |

## Feedback
We really appreciate your feedback! If you encounter any issue or error, please report issues to us following the [Supporting Guide](https://github.com/OfficeDev/TeamsFx-Samples/blob/dev/SUPPORT.md). Meanwhile you can make [recording](https://aka.ms/teamsfx-record) of your journey with our product, they really make the product better. Thank you!
## Try the Sample with TeamsFx CLI
1. Install [Node.js](https://nodejs.org/en/download/) (use the latest v14 LTS release)
1. To install the TeamsFx CLI, use the npm package manager:
    ```
    npm install -g @microsoft/teamsfx-cli
    ```
1. Create npm-search-connector-m365 project.
    ```
    teamsfx new template npm-search-connector-m365
    ```
1. Provision the project to Azure.
    ```
    teamsfx provision
    ```
1. Deploy.
    ```
    teamsfx deploy
    ```
1. Execute `teamsfx preview --remote --m365-host <m365-host>` in your project directory to launch your application, where `m365-host` is `teams` or `outlook`. If you select `m365-host` as `outlook`, during preview, a dialog will be popped up as the image below. Please select "Install in Teams" first to install the app in Teams, then select "Configure Outlook" to connect the bot to Outlook channel, then select "Continue" to continue to debug the app in Outlook.
  ![Install in Teams CLI Remote](./images/install-in-teams-cli-remote.png)

## (Optional) Debug
1. Start debugging the project by executing the command `teamsfx preview --local --m365-host <m365-host>` in your project directory, where `m365-host` is `teams` or `outlook`. If you select `m365-host` as `outlook`, during debugging, a dialog will be popped up as the image below. Please select "Install in Teams" first to install the app in Teams, then select "Configure Outlook" to connect the bot to Outlook channel, then select "Continue" to continue to debug the app in Outlook.
  ![Install in Teams CLI Local](./images/install-in-teams-cli-local.png)
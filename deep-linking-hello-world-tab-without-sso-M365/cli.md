## Try sample with TeamsFx CLI

1. Install [Node.js](https://nodejs.org/en/download/) (use the latest v14 LTS release)
1. To install the TeamsFx CLI, use the npm package manager:
    ```
    npm install -g @microsoft/teamsfx-cli
    ```
1. Create deep-linking-hello-world-tab-without-sso-M365 project.
    ```
    teamsfx new template deep-linking-hello-world-tab-without-sso-M365
    ```
1. Provision the project to Azure.
    ```
    teamsfx provision
    ```
1. Deploy.
    ```
    teamsfx deploy
    ```
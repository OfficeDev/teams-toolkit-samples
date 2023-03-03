## Try the Sample with TeamsFx CLI
1. Install [Node.js](https://nodejs.org/en/download/)
1. To install the TeamsFx CLI, use the npm package manager:
    ```
    npm install -g @microsoft/teamsfx-cli
    ```
1. Create npm-search-connector-m365 project.
    ```
    teamsfx new template npm-search-connector-m365
    ```
1. Provision.
    ```
    teamsfx provision --env <env>
    ```
1. Deploy.
    ```
    teamsfx deploy --env <env>
    ```
1. Execute `teamsfx preview --env <env> --m365-host <m365-host>` in your project directory to launch your application, where `m365-host` is `teams` or `outlook`.
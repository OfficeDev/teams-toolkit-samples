## Minimal path to awesome
1. Install TeamsFx CLI using the npm package manager:
    ```
    npm install -g @microsoft/teamsfx-cli
    ```
1. Create todo-list-with-azure-backend-m365 project.
    ```
    teamsfx new sample todo-list-with-azure-backend-m365 --interactive false
    ```
1. Provision.
    ```
    teamsfx provision --env <env>
    ```
1. Deploy.
    ```
    teamsfx deploy --env <env>
    ```
1. Execute `teamsfx preview --env <env> --m365-host <m365-host>` in your project directory to launch your application, where `m365-host` is `teams`, `outlook` or `office`.

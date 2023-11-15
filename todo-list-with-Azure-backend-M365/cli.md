## Minimal path to awesome
1. Install TeamsFx CLI using the npm package manager:
    ```
    npm install -g @microsoft/teamsapp-cli
    ```
1. Create todo-list-with-azure-backend-m365 project.
    ```
    teamsapp new sample todo-list-with-azure-backend-m365 --interactive false
    ```
1. Provision.
    ```
    teamsapp provision --env <env>
    ```
1. Deploy.
    ```
    teamsapp deploy --env <env>
    ```
1. Execute `teamsapp preview --env <env> --m365-host <m365-host>` in your project directory to launch your application, where `m365-host` is `teams`, `outlook` or `office`.

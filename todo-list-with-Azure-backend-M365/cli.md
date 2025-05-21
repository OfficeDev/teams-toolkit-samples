## Minimal path to awesome
1. Install Microsoft 365 Agents Toolkit CLI using the npm package manager:
    ```
    npm install -g @microsoft/m365agentstoolkit-cli
    ```
1. Create todo-list-with-azure-backend-m365 project.
    ```
    atk new sample todo-list-with-azure-backend-m365 --interactive false
    ```
1. Provision.
    ```
    atk provision --env <env>
    ```
1. Deploy.
    ```
    atk deploy --env <env>
    ```
1. Execute `atk preview --env <env> --m365-host <m365-host>` in your project directory to launch your application, where `m365-host` is `teams`, `outlook` or `office`.

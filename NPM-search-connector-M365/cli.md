## Minimal path to awesome
1. Install TeamsFx CLI using the npm package manager:
    ```
    npm install -g @microsoft/teamsapp-cli
    ```
1. Create npm-search-connector-m365 project.
    ```
    teamsapp new sample npm-search-connector-m365 --interactive false
    ```
1. For local env, start your local tunnel service.
    1. Install [dev tunnel cli](https://aka.ms/teamsfx-install-dev-tunnel).
    1. Login with your M365 Account using the command `devtunnel user login`.
    1. Start your local tunnel service by running the command `devtunnel host -p 3978 --protocol http --allow-anonymous`.
    1. In the `env/.env.local` file, fill in the values for `BOT_DOMAIN` and `BOT_ENDPOINT` with your dev tunnel URL.
       ```
       BOT_DOMAIN=sample-id-3978.devtunnels.ms
       BOT_ENDPOINT=https://sample-id-3978.devtunnels.ms
       ```
1. Provision.
    ```
    teamsapp provision --env <env>
    ```
1. Deploy.
    ```
    teamsapp deploy --env <env>
    ```
1. Execute `teamsapp preview --env <env> --m365-host <m365-host>` in your project directory to launch your application, where `m365-host` is `teams` or `outlook`.
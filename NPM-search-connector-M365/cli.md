## Minimal path to awesome
1. Install TeamsFx CLI using the npm package manager:
    ```
    npm install -g @microsoft/teamsfx-cli
    ```
1. Create npm-search-connector-m365 project.
    ```
    teamsfx new template npm-search-connector-m365
    ```
1. For local env, install [ngrok](https://ngrok.com/download) and start your local tunnel service by running the command `ngrok http 3978`.
1. For local env, fill in the values for `BOT_DOMAIN` and `BOT_ENDPOINT` with your ngrok URL in the `env/.env.local` file.
   ```
   BOT_DOMAIN=sample-id.ngrok.io
   BOT_ENDPOINT=http://sample-id.ngrok.io
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
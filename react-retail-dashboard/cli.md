## Try sample with TeamsFx CLI

1. Install [Node.js](https://nodejs.org/en/download/) (Recommend LTS 18.x)
2. To install the TeamsFx CLI, use the npm package manager:

    ```
    npm install -g @microsoft/teamsapp-cli
    ```

3. Create react-retail-dashboard project.

    ```
    teamsapp new sample react-retail-dashboard --interactive false
    ```

4. Provision the project to create an app in Teams App Studio.

    ```
    teamsapp provision
    ```

5. Deploy your project.
    > This step will generate a SharePoint package (*.sppkg) under `sharepoint/solution` folder. The cli will automatically upload and deploy it to your tenant App Catalog site. Only tenant App Catalog site admin has permission to do it. If you are not the admin, you can create your test tenant following [Setup your Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant).

    ```
    teamsapp deploy
    ```

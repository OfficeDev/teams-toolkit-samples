## Try sample with TeamsFx CLI

1. Install [Node.js](https://nodejs.org/en/download/) (Recommend LTS 16.x)
2. To install the TeamsFx CLI, use the npm package manager:

    ```
    npm install -g @microsoft/teamsfx-cli
    ```

3. Create spfx-productivity-dashboard project.

    ```
    teamsfx new template spfx-productivity-dashboard
    ```

4. Provision the project to create an app in Teams App Studio.

    ```
    teamsfx provision
    ```

5. Deploy your project.
    > This step will generate a SharePoint package (*.sppkg) under `sharepoint/solution` folder. The cli will automatically upload and deploy it to your tenant App Catalog site. Only tenant App Catalog site admin has permission to do it. If you are not the admin, you can create your test tenant following [Setup your Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant).

    ```
    teamsfx deploy
    ```

6. Go to your [SharePoint Admin center](https://{yourtenant}-admin.sharepoint.com). In the left-hand navigation, select `Advanced` and then `API Access`. You should see pending requests for each of the permissions requested in src\config\package-solution.json file. Select and approve each permission.

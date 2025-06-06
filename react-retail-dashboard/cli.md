## Try sample with Microsoft 365 Agents Toolkit CLI

1. Install [Node.js](https://nodejs.org/en/download/) (Recommend LTS 18.x)
2. To install the Microsoft 365 Agents Toolkit CLI, use the npm package manager:

    ```
    npm install -g @microsoft/m365agentstoolkit-cli
    ```

3. Create react-retail-dashboard project.

    ```
    atk new sample react-retail-dashboard --interactive false
    ```

4. Provision the project to create an app in Teams App Studio.

    ```
    atk provision
    ```

5. Deploy your project.
    > This step will generate a SharePoint package (*.sppkg) under `sharepoint/solution` folder. The cli will automatically upload and deploy it to your tenant App Catalog site. Only tenant App Catalog site admin has permission to do it. If you are not the admin, you can create your test tenant following [Setup your Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant).

    ```
    atk deploy
    ```

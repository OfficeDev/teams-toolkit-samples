## Try sample with TeamsFx CLI
1. Install [Node.js](https://nodejs.org/en/download/) (Recommend LTS 18.x)
2. To install the TeamsFx CLI, use the npm package manager:
    ```
    npm install -g @microsoft/teamsapp-cli
    ```
3. Create todo-list-SPFx project.
    ```
    teamsapp new sample todo-list-SPFx --interactive false
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
6. Publish your app to Teams App Studio.
    ```
    teamsapp publish
    ```
7. Check the published app in [Microsoft Teams admin center](https://admin.teams.microsoft.com/policies/manage-apps) by searching "todoList" in the search box.
![TeamsAppAdminCenter](images/TeamsAppAdminCenter.png)
1. Click the 'TodoList' app you just published and select `Publish` in the Publishing status.

    ![Publish](images/Publish.png)

    It may take a few minutes to publish the Teams app.
1. Login to Teams using your M365 tenant admin account, same account you are using to create SharePoint environment and logging to VS Code extension. You will see your app in the `Apps - Built for your org`. 
![addapp](images/addapp.png)
1. Add the app to your Teams.
![addtoateam](images/addtoateam.png)
1. You should see the app running in your Teams.
![appdisplay](images/appdisplay.png)
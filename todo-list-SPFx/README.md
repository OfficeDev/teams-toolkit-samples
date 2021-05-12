# Getting Started with Todo List Sample - React Tab on SPFx

### Todo List is a personal tab used to manage To-do List

- The frontend is a React Tab hosted on [SharePoint](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview).
- Backend server(including the database) is provided by [SharePoint List](https://support.microsoft.com/en-us/office/introduction-to-lists-0a1c3ace-def0-44af-b225-cfa8d92c52d7) 

### Architecture

![Tab App Flow](images/TabAppFlow.jpg)

### What you will learn in this sample

- How to call Microsoft Graph client in SPFx context to get access to M365 data.
- How to create SharePoint List in the website and how to do CRUD operations on SharePoint List in SPFx context.
- How to deploy your app to SharePoint App Catalog and sync the solution to Teams App Catalog.

### Prerequist
1. Install the latest version of [Node.js LTS 14.x](https://nodejs.org/en/download/releases/)
    >  The SharePoint Framework v1.12.1 is supported on the following Node.js versions:
    >- Node.js v10.13.0+ (Dubnium)
    >- Node.js v12.13.0+ (Erbium)
    >- Node.js v14.15.0+ (Fermium) 
1. Set up SharePoint Environment
   Set up M365 tenant and crate SharePoint App Catalog site follow the guide [here](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant).
1. Use the root site in SharePoint to create a List.
    - Navigate to the SharePoint root site, in `Home` tab, click `New` and select `List`. 
    > *Note: You must nagivate to root site instead of any other subsite. Root site URL ends with xx.sharepoint.com.* eg. `https://{your-tenant-name}.sharepoint.com/`. 
    > *This is because Teams App automatically detect SharePoint root site only. If you want to create a List in other subsite, manual steps to change the site url in* *[./SPFx/src/webparts/TodoList/components/SharePointListManager.ts](./SPFx/src/webparts/TodoList/components/SharePointListManager.ts) are required.*
    - Name the List 'To Do List'
    - Click `Add Column`, select `Single line of text`, name the column 'description'
    - Click `Add Column`, select `Yes/No`, name the column 'isCompleted'
1. [Optional] If you want your users see only the items created by themselves, add access control to your List.
    - In List Page, click `setting` button and then choose `list setting`.
    ![ListSetting1](images/ListSetting1.png)
    - In `Advanced Settings`, Set the `Read Access` to `Read items that were created by the user`, and Set the `Create and Edit access` to `Create items and edit items that were created by the user`.
    ![ListSetting2](images/ListSetting2.png)
    - Click 'Ok' to save your setting.

### Running the Sample App
1. Clone the repo to your local workspace or directly download the source code. 
1. Download [Visual Studio Code](https://code.visualstudio.com) and install Microsoft Teams Toolkit extension. Or download TeamsFx CLI.
1. Open [./SPFx/src/webparts/TodoList/components/SharePointListManager.ts](./SPFx/src/webparts/TodoList/components/SharePointListManager.ts), navigate to line:16, set the listname variable to your SharePoint List name.
1. Open the project from VS Code, click `Provision in the Cloud` in PROJECT panel of Microsoft Teams Toolkit extension. 
    - or select `Teams: Provision in the Cloud` from command palette (invoke command palette by pressing `ctrl + shift + p`). 
    - you can also use TeamsFx CLI, running cmd `teamsfx provision` under your project path.
    This step will create an app in Teams App Studio.
    > **!Important** This step may require you to login Microsoft Teams Toolkit extension first. **Make sure you are using your M365 tenant admin account.** 
    > If it does not ask you to login, the toolkit may cache account information for you. Check your login account and make sure you are using the right account.

1. Go back to Microsoft Teams Toolkit extension, click `Deploy to the Cloud` in PROJECT panel.
    - or select `Teams: Deploy to the Cloud` from command palette (invoke command palette by pressing `ctrl + shift + p`). 
    - or you can use TeamsFx CLI, running cmd `teamsfx deploy` under your project path.   
    This step will generate a SharePoint package (*.sppkg) under `sharepoint/solution` folder.
  
1. Upload or drag-and-drop the *.sppkg file under `sharepoint/solution` folder to the SharePoint App Catalog site, follow the instruction [Deploy the HelloWorld package to App Catalog](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page#deploy-the-helloworld-package-to-app-catalog)
1. Go back to Microsoft Teams Toolkit extension, in in PROJECT panel, click `Publish to Teams`. 
    - or select `Teams: Publish to Teams` from command palette (invoke command palette by pressing `ctrl + shift + p`).
    - or you can use TeamsFx CLI, running cmd `teamsfx publish` under your project path.

1. Check pubilshed app in [Microsoft Teams admin center](https://admin.teams.microsoft.com/policies/manage-apps) by searching "todoList" in the search box.
![TeamsAppAdminCenter](images/TeamsAppAdminCenter.png)
1. Click the 'todoList' app you just published and select `Publish` in the Publishing status.
![Publish](images/Publish.png)
It may take a few minutes to publish the Teams app.
1. Login to Teams using your M365 tenant admin account, same account you are using to create SharePoint environment and logging to VS Code extension. You will see your app in the `Apps - Built for your org`. Add the app to your Teams client.
![addapp](images/addapp.png)
1. You should see the app running in your Teams.

### Debug[optional]
Debug the app with SharePoint WorkBench in VSCode.
    - Navigate to [launch.json](.vscode/launch.json), replace `enter-your-SharePoint-site` with your SharePoint site.
    - In Debug mode, select "Hosted workbench" and press start button. The Hosted Workbench will be opened and you may need to sign in with your M365 account.
    - Click the plus button in the middle, and select `TodoList`, the webpart will show up in the workbench.
    - ![HostedWokbench](images/Workbench.png)

### How to use this Sample App:
1. Since SharePoint can get the context so app user doesn't need to do consent/login operation.
2. You could add new todo item by clicking "Add Task" button.
3. You could complete todo item by choosing the checkbox before the item.
4. You could update todo item by typing text in todo item list.
5. You could delete todo item by clicking "..." and then choose "Delete" button.
    ![TodoList](images/ToDoListCRUD.gif)


### References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

### Known Issue:
1.Importing [msteams-ui-components-react](https://www.npmjs.com/package/msteams-ui-components-react) package will cause issues during package build:
![Issue](images/knownissue.png)

## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

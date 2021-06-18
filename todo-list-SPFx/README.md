# Getting Started With Todo List Sample (SPFx)

> ## WARNING: This repository is under active development and the samples are not guaranteed to work!
> This warning will be removed when the samples are ready for consumption

Todo List with SPFx is a Todo List for individuals to manage his/her personal to-do items. This app is hosted on SharePoint. There is no requirements to deploy Azure resources.

![TodoList](images/ToDoListCRUD.gif)

### What you will learn in this sample

- How to call Microsoft Graph client in SPFx context to get access to M365 data.
- How to create SharePoint List in the website and how to do CRUD operations on SharePoint List in SPFx context.
- How to deploy your app to SharePoint App Catalog and sync the solution to Teams App Catalog.

## Prerequisites
* [NodeJS](https://nodejs.org/en/download/releases/) (Recommend LTS 14.x)
    >  The SharePoint Framework v1.12.1 is supported on the following Node.js versions:
    >- Node.js v10.13.0+ (Dubnium)
    >- Node.js v12.13.0+ (Erbium)
    >- Node.js v14.15.0+ (Fermium) 
* Setup SharePoint Environment by following the [instructions](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant).
* Use the team site in SharePoint to create a List.
    - Navigate to the [SharePoint team site](https://support.microsoft.com/en-us/office/create-a-team-site-in-sharepoint-ef10c1e7-15f3-42a3-98aa-b5972711777d), in `Home` tab, click `New` and select `List`.
    > *Note: You must nagivate to team site instead of any other subsite. Team site URL ends with xx.sharepoint.com/sites/xx* eg. `https://{your-tenant-name}.sharepoint.com/sites/{your-team-site-name}`. 
    > *This is because Teams Group Tab automatically detect SharePoint team site only. If you want to create a List in other subsite, manual steps to change the site url in* *[./SPFx/src/webparts/TodoList/components/SharePointListManager.ts](./SPFx/src/webparts/TodoList/components/SharePointListManager.ts) are required.*
    - Name the List 'To Do List'
    - Click `Add Column`, select `Single line of text`, name the column 'description'
    - Click `Add Column`, select `Yes/No`, name the column 'isCompleted'
* [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit)
* [Optional] If you want your users see only the items created by themselves, add access control to your List.
    - In List Page, click `setting` button and then choose `list setting`.
    ![ListSetting1](images/ListSetting1.png)
    - In `Advanced Settings`, Set the `Read Access` to `Read items that were created by the user`, and Set the `Create and Edit access` to `Create items and edit items that were created by the user`.
    ![ListSetting2](images/ListSetting2.png)
    - Click 'Ok' to save your setting.
* [Optional] If you want your guest users use the To-Do-list when using Teams Desktop app, add access permission to your app catlog.
    - In the App Catlog page, click `setting` button, and then choose `shared with`.
    ![AppCatlogSetting1](images/AppCatlogSetting1.png)
    - Invite the guest user and click `Share` button.
    ![invitepeople](images/invitepeople.png)

## Try the Sample
1. Clone the repo to your local workspace or directly download the source code. 
1. Download [Visual Studio Code](https://code.visualstudio.com) and install [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit).
1. Open [./SPFx/src/webparts/TodoList/components/SharePointListManager.ts](./SPFx/src/webparts/TodoList/components/SharePointListManager.ts), navigate to line:16, set the `listname` variable to your SharePoint List name.
1. Open the project in Visual Studio Code, click `Provision in the Cloud` in PROJECT panel of Microsoft Teams Toolkit extension or open the command palette and select `Teams: Provision in the Cloud`. This step will create an app in Teams App Studio.
1. Go back to Microsoft Teams Toolkit extension, click `Deploy to the Cloud` in PROJECT panel or open the command palette and select `Teams: Deploy to the Cloud`. 
    > This step will generate a SharePoint package (*.sppkg) under `sharepoint/solution` folder.
1. Upload or drag-and-drop the *.sppkg file under `sharepoint/solution` folder to the SharePoint App Catalog site, follow the instruction [Deploy the HelloWorld package to App Catalog](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page#deploy-the-helloworld-package-to-app-catalog)
    > Note: Tick the "Make this solution available to all sites in the organization" option to make the solution available in Teams.
1. After Deploy, you may need to go to the SharePoint Admin Site. In Advanced - API Access, approve you API request.
![APIAccess](images/APIAccess.png)
1. Go back to Microsoft Teams Toolkit extension, in in PROJECT panel, click `Publish to Teams` or open the command palette and select `Teams: Publish to Teams`.
1. Check the published app in [Microsoft Teams admin center](https://admin.teams.microsoft.com/policies/manage-apps) by searching "todoList" in the search box.
![TeamsAppAdminCenter](images/TeamsAppAdminCenter.png)
1. Click the 'todoList' app you just published and select `Publish` in the Publishing status.
![Publish](images/Publish.png)
It may take a few minutes to publish the Teams app.
1. Login to Teams using your M365 tenant admin account, same account you are using to create SharePoint environment and logging to VS Code extension. You will see your app in the `Apps - Built for your org`. Add the app to your Teams client.
![addapp](images/addapp.png)
1. You should see the app running in your Teams.

## (Optional) Debug
Debug the app with SharePoint WorkBench in VSCode.
1. Navigate to [launch.json](.vscode/launch.json), replace `enter-your-SharePoint-site` with your SharePoint site, eg. `https://{your-tenant-name}.sharepoint.com/sites/{your-team-site-name}/_layouts/workbench.aspx`.
1. In Debug mode, select "Hosted workbench" and press start button. The Hosted Workbench will be opened and you may need to sign in with your M365 account.
1. Click the plus button in the middle, and select `TodoList`, the webpart will show up in the workbench.
- ![HostedWokbench](images/Workbench.png)

## Use the App in Teams
1. Since SharePoint can get the context so app user doesn't need to do consent/login operation.
2. You could add new todo item by clicking "Add Task" button.
3. You could complete todo item by choosing the checkbox before the item.
4. You could update todo item by typing text in todo item list.
5. You could delete todo item by clicking "..." and then choose "Delete" button.

## Architecture

![Tab App Flow](images/TabAppFlow.jpg)
- The frontend is a React Tab hosted on [SharePoint](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview).
- Backend server(including the database) is provided by [SharePoint List](https://support.microsoft.com/en-us/office/introduction-to-lists-0a1c3ace-def0-44af-b225-cfa8d92c52d7) 

## Further Reading

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

## Known Issue:
Importing [msteams-ui-components-react](https://www.npmjs.com/package/msteams-ui-components-react) package will cause issues during package build:
![Issue](images/knownissue.png)

When using Teams desktop app, guest users may be unable to load the profile picture of the creator in the To-Do-List.

## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

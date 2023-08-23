# Getting Started with Contoso Retail Dashboard Sample

This is a dashboard sample based on demo sample data that shows you how to create a Microsoft Teams personal app with SharePoint Framework, hosting the solution also in Outlook.com and in the Microsoft 365 Portal as a Microsoft 365 app.

![RetailDashboard](assets/teams-hosted.png)

## This sample illustrate

- How to leverage existing react component to set up a dashboard with SharePoint Framework
- How to create a Microsoft Teams personal app with SharePoint Framework, hosting the solution also in Outlook.com and in the Microsoft 365 Portal as a Microsoft 365 app

## Prerequisite to use this sample

- [Set up SharePoint Framework development environment](https://aka.ms/teamsfx-spfx-dev-environment-setup)（Recommend to use SPFx v1.17.4）
- A Microsoft 365 tenant in which you have permission to upload Teams apps. You can get a free Microsoft 365 developer tenant by joining the [Microsoft 365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program).
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [TeamsFx CLI](https://aka.ms/teamsfx-cli)

## Minimal path to awesome

### Run the app locally

1. In Debug mode, select one of the debug configurations (`Hosted workbench`, `Teams workbench`, `Outlook workbench` and `The Microsoft 365 app workbench` are supported) and press start button. The browser will be opened and you need to sign in with your Microsoft 365 account.
2. Click `Add` if you selected `Teams workbench` in previous step.
3. You should see the app running in your selected hub.
![teams-hosted](assets/teams-hosted.png)
![outlook-hosted](assets/outlook-hosted.png)
![office-hosted](assets/office-hosted.png)

## Advanced usage of this sample

You could set up your own back-end REST API project as Azure Function to use real data instead of faked one. We'll also add back-end support to update this sample later.

## Version History

|Date| Author| Comments|
|---|---|---|
|Sep 15, 2023| huihuiwu | Onboard to Teams Toolkit|

## Feedback

We really appreciate your feedback! If you encounter any issue or error, please report issues to us following the [Supporting Guide](https://github.com/OfficeDev/TeamsFx-Samples/blob/dev/SUPPORT.md). Meanwhile you can make [recording](https://aka.ms/teamsfx-record) of your journey with our product, they really make the product better. Thank you!
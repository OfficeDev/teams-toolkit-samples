# Getting Started with FAQ Plus Sample

> ## WARNING: This repository is under active development and the samples are not guaranteed to work!
> This warning will be removed when the samples are ready for consumption

Chatbots on Microsoft Teams are an easy way to provide answers to frequently asked questions by users. However, most chatbots fail to engage with users in a meaningful way because there is no human in the loop when the chatbot fails to answer a question well.

FAQ Plus bot is a friendly Q&A bot that brings a human in the loop when it is unable to help. A user can ask the bot a question and the bot responds with an answer if it's in the knowledge base. If not, the bot offers the user an option to "Ask an expert", which posts the question to a pre-configured team of experts to provide support. An expert can assign the question to themself, chat with the user to gain more context.

**Here are some screenshots showing FAQ Plus in action:**

*	A user interacting with FAQ Plus through chat:

![FAQ Plus in action (user view)](docs/images/FAQPlusEndUser.gif)

*	Expert using FAQ Plus:

![FAQ Plus in action (experts view)](docs/images/FAQPlusExperts.gif)

## Getting Started

### Prerequisites

- [NodeJS](https://nodejs.org/en/)
- An M365 account. If you do not have M365 account, apply one from [M365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit)
- An [Azure subscription](https://azure.microsoft.com/en-us/free/)

### What you will learn in this sample:

- How to use TeamsFx to build a bot app.
- How to connect a Teams bot to an external system.
- How to use the Teams Toolkit to provision and deploy your app to Azure.

### Try the Sample

1. FAQ Plus Bot relies on the 'QnA Maker' Azure services. Before you start, follow the [instructions](docs/deploy-qna-maker-services.md) to deploy QnA Maker to Azure. You will get configurations of QnA Maker service on completion. Make sure to record them down and you will need this later. 
2. Open project in [Visual Studio Code](https://code.visualstudio.com/), ensure you have installed [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit)
3. Open the command palette by pressing `Ctrl+Shift+P / ⌘⇧-P or View -> Command - Palette` and select: `Teams: Provision in the Cloud`. If you have not logged in with your Azure Account, you will be asked to login and select a subscription to provision resources for this Bot.
4. Once provision is completed, open `.fx/env.default.json` file. Notice the value of `siteName` in `fx-resource-bot` section, this is the name of Azure Web App service provisioned by Teams Toolkit. You will need this value in step 5.
5. From [Azure Portal](https://ms.portal.azure.com/#home), navigate to resource group named `FaqPlus-rg`. This resource group is created by Teams Toolkit during provision. Find the Azure Web App service named after the value of `siteName` parameter you got from step 4 and open this Azure Web App service.
6. Click `Configuration` in left panel. Add the following application settings with configuration values you got from step 1 and click `Save` button.
    | Application Setting Name | Expected Value | Note |
    | ---- | ---- | ---- |
    | SCORETHRESHOLD | 0.5 | The expected value works fine for the sample. You can adjust this threshold per your requirement. |
    | STORAGECONNECTIONSTRING | `StorageConnectionString` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services.md) step | Example: DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[Key] |
    | QNAMAKERAPIENDPOINTURL | `QnAMakerApiEndpointUrl` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services.md) step | Example: https://[Location].api.cognitive.microsoft.com |
    | QNAMAKERHOSTURL | `QnAMakerHostUrl` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services.md) step | Example: https://[BaseResourceName]-qnamaker.azurewebsites.net |
    | QNAMAKERSUBSCRIPTIONKEY | `QnAMakerSubscriptionKey` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services.md) step | Usually a 32 alphanumeric characters string |
7. Open the command palette and select: `Teams: Deploy to the Cloud`.
8. To install and run the app, in Visual Studio Code, open `Run and Debug` tab and select `Launch Remote (Edge)` or `Launch Remote (Chrome)` in the dropdown list. Then press `F5` or click green arrow button to launch Teams client in browser. Log in to Teams and click `Add` button to install the app to your Teams client.
9. Your app is successfully running in your Teams client now, refer to ['Use the App' section](#use-the-app) below to interact with the app.

### (Optional) Debug

1. FAQ Plus Bot relies on the 'QnA Maker' Azure services. Before you start, follow the [instructions](docs/deploy-qna-maker-services.md) to deploy QnA Maker to Azure. You will get configurations of QnA Maker service on completion. Make sure to record them down and you will need this later. 
2. Open project in [Visual Studio Code](https://code.visualstudio.com/), ensure you have installed [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit)
2. Open `.fx/local.env` file. Fill values for following environment variables.
    | Application Setting Name | Expected Value | Note |
    | ---- | ---- | ---- |
    | BOT_SCORETHRESHOLD | 0.5 | The expected value works fine for the sample. You can adjust this threshold per your requirement. |
    | BOT_STORAGECONNECTIONSTRING | `StorageConnectionString` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services.md) step | Example: DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[Key] |
    | BOT_QNAMAKERAPIENDPOINTURL | `QnAMakerApiEndpointUrl` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services.md) step | Example: https://[Location].api.cognitive.microsoft.com |
    | BOT_QNAMAKERHOSTURL | `QnAMakerHostUrl` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services.md) step | Example: https://[BaseResourceName]-qnamaker.azurewebsites.net |
    | BOT_QNAMAKERSUBSCRIPTIONKEY | `QnAMakerSubscriptionKey` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services.md) step | Usually a 32 alphanumeric characters string |
3. To install and run the app, in Visual Studio Code, open `Run and Debug` tab and select `Launch Remote (Edge)` or `Launch Remote (Chrome)` in the dropdown list. Then press `F5` or click green arrow button to launch Teams client in browser. Log in to Teams and click `Add` button to install the app to your Te
4. Your app is successfully running in your Teams client now, refer to ['Use the App' section](#use-the-app) below to interact with the app.

### Use the App

#### User interacting with FAQ Plus:

1. The Bot will send out Welcome Message to kick off the conversation.
2. You can just ask any question.
3. Once receive questions, the Bot wil search the QnA knowledge base to find answers. You can click 'Ask an expert' if Bot doesn't solve your questions well.
4. Click "Ask an expert" button to escalate your question to an expert, fill in required information and click "Ask an expert" again to create a ticket.
    > #### WARNING: To enable "Ask an expert" feature, you will need to install the app to a Teams Channel for expert to receive ticket creation notification. Note that this Teams Channel must be a Channel of the Team configured in your FAQ Plus configuration app in [this](docs/deploy-qna-maker-services.md) doc.
    > To install the FAQ Plus app to Teams Channel, you can terminate the current F5 session (just close the web browser), and launch a new F5 session to install app to Teams Channel by clicking "Add to a team".. 
    >  ![addToTeam](docs/images/addToTeam.png)

#### Expert interacting with FAQ Plus in Teams channel:

Experts can receive Bot notifications from Teams Channel. An expert can assign the questions to themselves, initiate chat with the user to gain more context.
1. To enable the feature for expert, add the Bot to a Teams Channel for expert group.
2. When user 'Ask an expert', a support ticket is created and posted to experts Teams Channel.
    ![notification](docs/images/notificationCard.png)
4. Click "Chat with xxx" to initiate a chat with the user who asked for help. Note: if the support ticket is created by yourself, you cannot use this feature to chat with yourself.
5. Click "Change status" button to change the status of the support ticket. The user who created the ticket will receive status change notification from the bot.
6. Click 'View article' to search related answers from Knowledge base for some reference.


## Feedback

Thoughts? Questions? Ideas? Bugs and other code issues? Share them with us on [GitHub Issues](https://github.com/OfficeDev/TeamsFx-Samples/issues)!

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit [https://cla.microsoft.com](https://cla.microsoft.com/).

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/FAQ/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

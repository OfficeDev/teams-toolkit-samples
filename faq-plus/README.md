# Getting Started with FAQ Plus Sample

> ## WARNING: This repository is under active development and the samples are not guaranteed to work!
> This warning will be removed when the samples are ready for consumption

Chatbots on Microsoft Teams are an easy way to provide answers to frequently asked questions by users. However, most chatbots fail to engage with users in a meaningful way because there is no human in the loop when the chatbot fails to answer a question well.

FAQ Plus bot is a friendly Q&A bot that brings a human in the loop when it is unable to help. A user can ask the bot a question and the bot responds with an answer if it's in the knowledge base. If not, the bot offers the user an option to "Ask an expert", which posts the question to a pre-configured team of experts to provide support. An expert can assign the question to themself, chat with the user to gain more context.

**Here are some screenshots showing FAQ Plus in action:**

*	A user interacting with FAQ Plus through chat:

![FAQ Plus in action (user view)](https://github.com/OfficeDev/microsoft-teams-faqplusplus-app/wiki/images/FAQPlusEndUser.gif)

*	Expert using FAQ Plus:

![FAQ Plus in action (experts view)](https://github.com/OfficeDev/microsoft-teams-faqplusplus-app/wiki/images/FAQPlusExperts.gif)

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

1. Follow the instructions [here](docs/deploy-qna-maker-services) to deploy QnA Maker to Azure and get corresponding endpoints and credentials for provisioned services.
2. Open the project in [Visual Studio Code](https://code.visualstudio.com/), ensure you have installed [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit)
3. Open the command palette and select: `Teams: Provision in the Cloud`.
4. Once provision is completed, open `.fx/env.default.json` file. Find the name of Azure Web App service for bot provisioned by Teams Toolkit in `siteName` of `fx-resource-bot` property.
5. Go to [Azure Portal](https://ms.portal.azure.com/#home), and navigate to the Azure Web App instance provisioned for bot.
6. Click `Configuration` in left panel. Add following application settings. After added the settings, click `Save` button on the top.
    | Application Setting Name | Expected Value | Note |
    | ---- | ---- | ---- |
    | SCORETHRESHOLD | 0.5 | The expected value works fine for the sample. You can adjust this threshold per your requirement. |
    | STORAGECONNECTIONSTRING | `StorageConnectionString` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services) step | Example: DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[Key] |
    | QNAMAKERAPIENDPOINTURL | `QnAMakerApiEndpointUrl` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services) step | Example: https://[Location].api.cognitive.microsoft.com |
    | QNAMAKERHOSTURL | `QnAMakerHostUrl` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services) step | Example: https://[BaseResourceName]-qnamaker.azurewebsites.net |
    | QNAMAKERSUBSCRIPTIONKEY | `QnAMakerSubscriptionKey` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services) step | Usually a 32 alphanumeric characters string |
7. Open the command palette and select: `Teams: Deploy to the Cloud`.
8. Once deployment is completed, you can preview the app running in Azure. In Visual Studio Code, open `Run and Debug` and select `Launch Remote (Edge)` or `Launch Remote (Chrome)` in the dropdown list. Then press `F5` or click green arrow button to open the app in Teams web client.

### (Optional) Debug

1. Follow the instructions [here](docs/deploy-qna-maker-services) to deploy QnA Maker to Azure and get corresponding endpoints and credentials for provisioned services.
2. Open `.fx/local.env` file. Fill values for following environment variables.
    | Application Setting Name | Expected Value | Note |
    | ---- | ---- | ---- |
    | SCORETHRESHOLD | 0.5 | The expected value works fine for the sample. You can adjust this threshold per your requirement. |
    | STORAGECONNECTIONSTRING | `StorageConnectionString` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services) step | Example: DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[Key] |
    | QNAMAKERAPIENDPOINTURL | `QnAMakerApiEndpointUrl` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services) step | Example: https://[Location].api.cognitive.microsoft.com |
    | QNAMAKERHOSTURL | `QnAMakerHostUrl` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services) step | Example: https://[BaseResourceName]-qnamaker.azurewebsites.net |
    | QNAMAKERSUBSCRIPTIONKEY | `QnAMakerSubscriptionKey` got in [deploy-qna-maker-services](docs/deploy-qna-maker-services) step | Usually a 32 alphanumeric characters string |
3. In Visual Studio Code, open `Run and Debug` and select `Debug (Edge)` or `Debug (Chrome)` in the dropdown list. Then press `F5` or click green arrow button to start local debug and open the app in Teams web client.

### Use the App in Teams

#### User interacting with FAQ Plus through chat:

The bot will search the QnA knowledge base to answer user's questions. And users can ask an expert if the answer doesn't solve their questions well.
1. Add the bot to personal chat.
2. Input your question and send to the bot.
3. Click "Ask an expert" button to ask an expert, fill required information and click "Ask an expert" again to create a ticket to experts.

#### Expert using FAQ Plus in Teams channel:

Experts can receive notifications when a user asks an expert for help. An expert can assign the question to themself, chat with the user to gain more context.
1. Add the bot to personal chat, then add the bot to a Teams Channel (references as experts channel below). The Teams Channel must under the Team configured in [this](docs/deploy-qna-maker-services) doc.
2. "Ask an expert" in personal chat, you will see the support ticket is posted to experts channel.
3. Click "Chat with xxx" to chat with the user who asked for help. Note: if the support ticket is created by yourself, you cannot use this feature to chat with yourself.
4. Click "Change status" button to change the status of the support ticket. The user who created the ticket will receive status change notification from the bot.

## Legal Notice

This app template is provided under the [MIT License](https://github.com/OfficeDev/TeamsFx-Samples/blob/main/LICENSE) terms.  In addition to these terms, by using this app template you agree to the following:

- You, not Microsoft, will license the use of your app to users or organization. 

- This app template is not intended to substitute your own regulatory due diligence or make you or your app compliant with respect to any applicable regulations, including but not limited to privacy, healthcare, employment, or financial regulations.

- You are responsible for complying with all applicable privacy and security regulations including those related to use, collection and handling of any personal data by your app. This includes complying with all internal privacy and security policies of your organization if your app is developed to be sideloaded internally within your organization. Where applicable, you may be responsible for data related incidents or data subject requests for data collected through your app.

- Any trademarks or registered trademarks of Microsoft in the United States and/or other countries and logos included in this repository are the property of Microsoft, and the license for this project does not grant you rights to use any Microsoft names, logos or trademarks outside of this repository. Microsoft’s general trademark guidelines can be found [here](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general.aspx).

- If the app template enables access to any Microsoft Internet-based services (e.g., Office365), use of those services will be subject to the separately-provided terms of use. In such cases, Microsoft may collect telemetry data related to app template usage and operation. Use and handling of telemetry data will be performed in accordance with such terms of use.

- Use of this template does not guarantee acceptance of your app to the Teams app store. To make this app available in the Teams app store, you will have to comply with the [submission and validation process](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/appsource/publish), and all associated requirements such as including your own privacy statement and terms of use for your app.

## Feedback

Thoughts? Questions? Ideas? Bugs and other code issues? Share them with us on [GitHub Issues](https://github.com/OfficeDev/TeamsFx-Samples/issues)!

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit [https://cla.microsoft.com](https://cla.microsoft.com/).

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/FAQ/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
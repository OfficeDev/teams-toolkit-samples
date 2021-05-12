// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Import required packages
import * as restify from "restify";

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import {
    BotFrameworkAdapter,
    TurnContext
} from "botbuilder";

// This is the activity handler of this bot.
import { TeamsBot } from "./teamsBot";

// Import required QnA Maker components
import { QnaServiceProvider } from "./providers/qnaServiceProvider";
import { ConfigurationDataProvider } from "./providers/configurationProvider";
import { QnAMakerClient } from "@azure/cognitiveservices-qnamaker";
import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js";

async function main() {
    const configProvider = new ConfigurationDataProvider(process.env.STORAGECONNECTIONSTRING);
    const qnaMakerClient = new QnAMakerClient(new CognitiveServicesCredentials(process.env.QNAMAKERSUBSCRIPTIONKEY),
        process.env.QNAMAKERAPIENDPOINTURL);
    const endpointKeys = await qnaMakerClient.endpointKeys.getKeys();
    const qnaServiceProvider = new QnaServiceProvider(configProvider, endpointKeys.primaryEndpointKey, process.env.QNAMAKERHOSTURL);

    // Create adapter.
    // See https://aka.ms/about-bot-adapter to learn more about adapters.
    const adapter = new BotFrameworkAdapter({
        appId: process.env.BOT_ID,
        appPassword: process.env.BOT_PASSWORD
    });

    // Catch-all for errors.
    const onTurnErrorHandler = async (context: TurnContext, error: Error) => {
        // This check writes out errors to console log .vs. app insights.
        // NOTE: In production environment, you should consider logging this to Azure
        //       application insights.
        console.error(`\n [onTurnError] unhandled error: ${error}`);

        // Send a trace activity, which will be displayed in Bot Framework Emulator
        await context.sendTraceActivity(
            "OnTurnError Trace",
            `${error}`,
            "https://www.botframework.com/schemas/error",
            "TurnError"
        );

        // Send a message to the user
        await context.sendActivity("The bot encountered an error or bug.");
        await context.sendActivity("To continue to run this bot, please fix the bot source code.");
    };

    // Set the onTurnError for the singleton BotFrameworkAdapter.
    adapter.onTurnError = onTurnErrorHandler;

    // Create the bot that will handle incoming messages.
    const bot = new TeamsBot(qnaServiceProvider);

    // Create HTTP server.
    const server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 3978, () => {
        console.log(`\nBot Started, ${server.name} listening to ${server.url}`);
    });

    // Listen for incoming requests.
    server.post("/api/messages", (req, res) => {
        adapter.processActivity(req, res, async (context) => {
            await bot.run(context);
        });
    });
}

main().catch((reason) => {
    console.log(`Failed to start bot server. Reason: ${reason}`);
});
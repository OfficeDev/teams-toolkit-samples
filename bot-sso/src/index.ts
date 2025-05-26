// Import required packages
import express from "express";
import path from "path";
import send from "send";

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import {
  ConfigurationServiceClientCredentialFactory,
  TurnContext,
  MemoryStorage,
  CardFactory,
} from "botbuilder";

import config from "./config";
import { GraphClient } from "./graphClient";
import { ApplicationBuilder, AuthError, TurnState, TeamsAdapter } from '@microsoft/teams-ai';

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new TeamsAdapter(
    {},
    new ConfigurationServiceClientCredentialFactory({
        MicrosoftAppId: config.MicrosoftAppId,
        MicrosoftAppPassword: config.MicrosoftAppPassword,
        MicrosoftAppType: config.MicrosoftAppType,
    })
);

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
  await context.sendActivity(
    `The bot encountered unhandled error:\n ${error.message}`
  );
  await context.sendActivity(
    "To continue to run this bot, please fix the bot source code."
  );
};

// Set the onTurnError for the singleton CloudAdapter
adapter.onTurnError = onTurnErrorHandler;

// Create HTTP server.
const expressApp = express();
expressApp.use(express.json());

const server = expressApp.listen(
  process.env.port || process.env.PORT || 3978,
  () => {
    console.log(
      `\nBot Started, ${expressApp.name} listening to`,
      server.address()
    );
  }
);

interface ConversationState {
    count: number;
}
type ApplicationTurnState = TurnState<ConversationState>;

// Define storage and application
const storage = new MemoryStorage();
const app = new ApplicationBuilder<ApplicationTurnState>()
    .withStorage(storage)
    .withAuthentication(adapter, {
        settings: {
            graph: {
                scopes: ['User.Read'],
                msalConfig: {
                    auth: {
                        clientId: config.clientId,
                        clientSecret: config.clientSecret,
                        authority: `${config.authorityHost}/${config.tenantId}`
                    }
                },
                signInLink: `https://${config.botDomain}/auth-start.html`,
                endOnInvalidMessage: true
            }
        },
        autoSignIn: true,
    })
    .build();

// Listen for user to say '/reset' and then delete conversation state
app.message('/reset', async (context: TurnContext, state: ApplicationTurnState) => {
    state.deleteConversationState();
    await context.sendActivity(`Ok I've deleted the current conversation state.`);
});

app.message('/signout', async (context: TurnContext, state: ApplicationTurnState) => {
    await app.authentication.signOutUser(context, state);

    // Echo back users request
    await context.sendActivity(`You have signed out`);
});

app.message("show", async (context: TurnContext, state: ApplicationTurnState) => {
    const token = state.temp.authTokens['graph'];
    if (!token) {
        await context.sendActivity('No auth token found in state. Authentication failed.');
        return;
    }
    await context.sendActivity(
      "Retrieving user information from Microsoft Graph ..."
    );

    const graphClient = new GraphClient(token);
    const profile = await graphClient.GetMyProfile();
    await context.sendActivity(
        `You're logged in as ${profile.displayName} (${profile.userPrincipalName})${
          profile.jobTitle ? `; your job title is: ${profile.jobTitle}` : ""
        }.`
      );
    const profilePhoto = await graphClient.GetPhotoAsync();
    const card = CardFactory.adaptiveCard({
        type: "AdaptiveCard",
        body: [
          {
            type: "TextBlock",
            text: "User Picture",
            weight: "Bolder",
            size: "Medium"
          },
          {
            type: "Image",
            url: profilePhoto,
            size: "Large",
            horizontalAlignment: "Left"
          }
        ],
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.4"
      });
      await context.sendActivity({ attachments: [card] });
});

app.authentication.get('graph').onUserSignInSuccess(async (context: TurnContext, state: ApplicationTurnState) => {
    // Successfully logged in
    await context.sendActivity('Successfully logged in');
    await context.sendActivity(`Token string length: ${state.temp.authTokens['graph']!.length}`);
    await context.sendActivity(`This is what you said before the AuthFlow started: ${context.activity.text}`);
});

app.authentication
    .get('graph')
    .onUserSignInFailure(async (context: TurnContext, _state: ApplicationTurnState, error: AuthError) => {
        // Failed to login
        await context.sendActivity('Failed to login');
        await context.sendActivity(`Error message: ${error.message}`);
    });

app.conversationUpdate("membersAdded", async (context: TurnContext, state: ApplicationTurnState) => {
  await context.sendActivity("Welcome to the sso bot sample!");
});

// Listen for incoming requests.
expressApp.post("/api/messages", async (req, res) => {
  await adapter
    .process(req, res, async (context) => {
      await app.run(context);
    })
    .catch((err) => {
      // Error message including "412" means it is waiting for user's consent, which is a normal process of SSO, shouldn't throw this error.
      if (!err.message.includes("412")) {
        throw err;
      }
    });
});

expressApp.get(["/auth-start.html", "/auth-end.html"], async (req, res) => {
  send(
    req,
    path.join(
      __dirname,
      "../public",
      req.url.includes("auth-start.html") ? "auth-start.html" : "auth-end.html"
    )
  ).pipe(res);
});

import {
  TeamsActivityHandler,
  TurnContext,
  SigninStateVerificationQuery,
  BotState,
  AdaptiveCardInvokeValue,
  AdaptiveCardInvokeResponse,
  MemoryStorage,
  ConversationState,
  UserState,
} from "botbuilder";
import { Utils } from "./helpers/utils";
import { SSODialog } from "./helpers/ssoDialog";
import { CommandsHelper } from "./helpers/commandHelper";
const rawWelcomeCard = require("./adaptiveCards/welcome.json");
const rawLearnCard = require("./adaptiveCards/learn.json");

export class TeamsBot extends TeamsActivityHandler {
  likeCountObj: { likeCount: number };
  conversationState: BotState;
  userState: BotState;
  dialog: SSODialog;
  dialogState: any;
  commandsHelper: CommandsHelper;

  constructor() {
    super();

    // record the likeCount
    this.likeCountObj = { likeCount: 0 };

    // Define the state store for your bot.
    // See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
    // A bot requires a state storage system to persist the dialog and user state between messages.
    const memoryStorage = new MemoryStorage();

    // Create conversation and user state with in-memory storage provider.
    this.conversationState = new ConversationState(memoryStorage);
    this.userState = new UserState(memoryStorage);
    this.dialog = new SSODialog(new MemoryStorage());
    this.dialogState = this.conversationState.createProperty("DialogState");

    this.onMessage(async (context, next) => {
      console.log("Running with Message Activity.");

      let txt = context.activity.text;
      // remove the mention of this bot
      const removedMentionText = TurnContext.removeRecipientMention(
        context.activity
      );
      if (removedMentionText) {
        // Remove the line break
        txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
      }

      // Trigger command by IM text
      await CommandsHelper.triggerCommand(txt, {
        context: context,
        ssoDialog: this.dialog,
        dialogState: this.dialogState,
        likeCount: this.likeCountObj,
      });

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id) {
          const card = Utils.renderAdaptiveCard(rawWelcomeCard);
          await context.sendActivity({ attachments: [card] });
          break;
        }
      }
      await next();
    });
  }

  // Invoked when an action is taken on an Adaptive Card. The Adaptive Card sends an event to the Bot and this
  // method handles that event.
  async onAdaptiveCardInvoke(
    context: TurnContext,
    invokeValue: AdaptiveCardInvokeValue
  ): Promise<AdaptiveCardInvokeResponse> {
    // The verb "userlike" is sent from the Adaptive Card defined in adaptiveCards/learn.json
    if (invokeValue.action.verb === "userlike") {
      this.likeCountObj.likeCount++;
      const card = Utils.renderAdaptiveCard(rawLearnCard, this.likeCountObj);
      await context.updateActivity({
        type: "message",
        id: context.activity.replyToId,
        attachments: [card],
      });
      return { statusCode: 200, type: undefined, value: undefined };
    }
  }

  async run(context: TurnContext) {
    await super.run(context);

    // Save any state changes. The load happened during the execution of the Dialog.
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }

  async handleTeamsSigninVerifyState(
    context: TurnContext,
    query: SigninStateVerificationQuery
  ) {
    console.log(
      "Running dialog with signin/verifystate from an Invoke Activity."
    );
    await this.dialog.run(context, this.dialogState);
  }

  async handleTeamsSigninTokenExchange(
    context: TurnContext,
    query: SigninStateVerificationQuery
  ) {
    await this.dialog.run(context, this.dialogState);
  }

  async onSignInInvoke(context: TurnContext) {
    await this.dialog.run(context, this.dialogState);
  }
}

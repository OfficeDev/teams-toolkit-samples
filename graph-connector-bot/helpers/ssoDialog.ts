import {
  Dialog,
  DialogSet,
  DialogTurnStatus,
  WaterfallDialog,
  ComponentDialog,
} from "botbuilder-dialogs";
import {
  Activity,
  ActivityTypes,
  Storage,
  tokenExchangeOperationName,
  TurnContext,
} from "botbuilder";
import { TeamsBotSsoPrompt } from "@microsoft/teamsfx";
import "isomorphic-fetch";
import oboAuthConfig from "../authConfig";
import config from "../config";

const DIALOG_NAME = "SSODialog";
const MAIN_WATERFALL_DIALOG = "MainWaterfallDialog";
const TEAMS_SSO_PROMPT_ID = "TeamsFxSsoPrompt";

export class SSODialog extends ComponentDialog {
  private requiredScopes: string[] = ["User.Read"]; // hard code the scopes for demo purpose only
  private storage: Storage;
  private dedupStorageKeys: string[];
  private operationWithSSO: (
    arg0: any,
    text: string,
    ssoToken: string
  ) => Promise<any> | undefined;

  // Developer controlls the lifecycle of credential provider, as well as the cache in it.
  // In this sample the provider is shared in all conversations
  constructor(storage: Storage) {
    super(DIALOG_NAME);
    const initialLoginEndpoint = `https://${config.botDomain}/auth-start.html`;
    const dialog = new TeamsBotSsoPrompt(oboAuthConfig, 
      initialLoginEndpoint,
      TEAMS_SSO_PROMPT_ID,
      {
        scopes: this.requiredScopes,
        endOnInvalidMessage: true,
      }
    );
    this.addDialog(dialog);

    this.addDialog(
      new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
        this.ssoStep.bind(this),
        this.dedupStep.bind(this),
        this.executeOperationWithSSO.bind(this),
      ])
    );

    this.initialDialogId = MAIN_WATERFALL_DIALOG;
    this.storage = storage;
    this.dedupStorageKeys = [];
  }

  setSSOOperation(
    handler: (arg0: any, text: string, arg1: string) => Promise<any> | undefined
  ) {
    this.operationWithSSO = handler;
  }

  resetSSOOperation() {
    this.operationWithSSO = undefined;
  }

  /**
   * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
   * If no dialog is active, it will start the default dialog.
   * @param {*} dialogContext
   */
  async run(context: TurnContext, dialogState: any) {
    const dialogSet = new DialogSet(dialogState);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(context);
    let dialogTurnResult = await dialogContext.continueDialog();
    if (dialogTurnResult && dialogTurnResult.status === DialogTurnStatus.empty) {
      dialogTurnResult = await dialogContext.beginDialog(this.id);
    }
  }

  async ssoStep(stepContext: any) {
    return await stepContext.beginDialog(TEAMS_SSO_PROMPT_ID);
  }

  async dedupStep(stepContext: any) {
    const tokenResponse = stepContext.result;
    // Only dedup after ssoStep to make sure that all Teams client would receive the login request
    if (tokenResponse && (await this.shouldDedup(stepContext.context))) {
      return Dialog.EndOfTurn;
    }
    return await stepContext.next(tokenResponse);
  }

  async setText(context: TurnContext, text: string) {
    const key = this.getTextStorageKey(context)
    await this.storage.write({ [key]: { text } });
  }

  async executeOperationWithSSO(stepContext: any) {
    const tokenResponse = stepContext.result;
    if (!tokenResponse || !tokenResponse.ssoToken) {
      await stepContext.context.sendActivity(
        "There is an issue while trying to sign you in, please type \"query\" command to login and consent permissions again."
      );
    } else {
      // Once got ssoToken, run operation that depends on ssoToken
      if (this.operationWithSSO) {
        const key = this.getTextStorageKey(stepContext.context)
        const text = (await this.storage.read([key]))[key].text;
        await this.operationWithSSO(stepContext.context, text, tokenResponse.ssoToken);
      }
    }
    return await stepContext.endDialog();
  }

  async onEndDialog(context: TurnContext) {
    const conversationId = context.activity.conversation.id;
    const currentDedupKeys = this.dedupStorageKeys.filter(
      (key) => key.indexOf(conversationId) > 0
    );
    await this.storage.delete(currentDedupKeys);
    this.dedupStorageKeys = this.dedupStorageKeys.filter(
      (key) => key.indexOf(conversationId) < 0
    );
    this.resetSSOOperation();
  }

  // If a user is signed into multiple Teams clients, the Bot might receive a "signin/tokenExchange" from each client.
  // Each token exchange request for a specific user login will have an identical activity.value.Id.
  // Only one of these token exchange requests should be processed by the bot.  For a distributed bot in production,
  // this requires a distributed storage to ensure only one token exchange is processed.
  async shouldDedup(context: TurnContext): Promise<boolean> {
    const storeItem = {
      eTag: context.activity.value.id,
    };

    const key = this.getStorageKey(context);
    const storeItems = { [key]: storeItem };

    try {
      await this.storage.write(storeItems);
      this.dedupStorageKeys.push(key);
    } catch (err) {
      if (err instanceof Error && err.message.indexOf("eTag conflict")) {
        return true;
      }
      throw err;
    }
    return false;
  }

  getStorageKey(context: TurnContext): string {
    if (!context || !context.activity || !context.activity.conversation) {
      throw new Error("Invalid context, can not get storage key!");
    }
    const activity = context.activity;
    const channelId = activity.channelId;
    const conversationId = activity.conversation.id;
    if (
      activity.type !== ActivityTypes.Invoke ||
      activity.name !== tokenExchangeOperationName
    ) {
      throw new Error(
        "TokenExchangeState can only be used with Invokes of signin/tokenExchange."
      );
    }
    const value = activity.value;
    if (!value || !value.id) {
      throw new Error(
        "Invalid signin/tokenExchange. Missing activity.value.id."
      );
    }
    return `${channelId}/${conversationId}/${value.id}`;
  }

  getTextStorageKey(context: TurnContext): string {
    const activity: Activity = context.activity;
    const channelId: string = activity.channelId;
    const conversationId: string =
      activity && activity.conversation && activity.conversation.id ? activity.conversation.id : undefined;

    if (!channelId) {
      throw new Error('missing activity.channelId');
    }

    if (!conversationId) {
      throw new Error('missing activity.conversation.id');
    }

    return `${channelId}/conversations/${conversationId}`;
  }
}

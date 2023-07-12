import { TurnContext, StatePropertyAccessor } from "botbuilder";
import { SSODialog } from "../ssoDialog";


export abstract class SSOCommand {
  public commandMessage: string;
  public async operationWithSSOToken(
    context: TurnContext, ssoToken: string
  ): Promise<any> | undefined {

  }

  async run(context: TurnContext, dialog: SSODialog, dialogState: StatePropertyAccessor<any>): Promise<any> {
    await dialog.run(context, dialogState);
  }
}

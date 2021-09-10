import { BotCommand } from "./botCommand";


export class SSOCommand implements BotCommand {
  public commandKey: string;
  public operationWithSSOToken: (arg0: any, ssoToken: string) => Promise<any> | undefined;

  async run(parameters: any): Promise<any> {
    const ssoDialog = parameters.ssoDialog;
    ssoDialog.setSSOOperation(this.operationWithSSOToken);
    await ssoDialog.run(parameters.context, parameters.dialogState);
  }
}

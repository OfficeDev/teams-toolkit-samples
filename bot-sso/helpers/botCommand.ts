export abstract class BotCommand {
  public matchPatterns: string;

  abstract run(parameters: any): any;

  public validateParameters(parameters: any): boolean {
    return true;
  }

  public expressionMatchesText(userInput: string): boolean {
    return userInput === this.matchPatterns;
  }

}

export class SSOCommand extends BotCommand {
  public operationWithSSOToken: (
    arg0: any,
    ssoToken: string
  ) => Promise<any> | undefined;

  validateParameters(parameters: any): boolean {
    if (!parameters.ssoDialog) {
      throw new Error(`SSOCommand failed: missing input "ssoDialog".`);
    }
    if (!parameters.context) {
      throw new Error(`SSOCommand failed: missing input "context".`);
    }
    if (!parameters.dialogState) {
      throw new Error(`SSOCommand failed: missing input "dialogState".`);
    }
    return true;
  }

  async run(parameters: any): Promise<any> {
    this.validateParameters(parameters);
    const ssoDialog = parameters.ssoDialog;
    await ssoDialog.run(parameters.context, parameters.dialogState);
  }
}

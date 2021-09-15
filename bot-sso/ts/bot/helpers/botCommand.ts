export type PredicateFunc<T> = (v: T) => boolean;
export type MatchTerm = string | RegExp | PredicateFunc<string>;

export abstract class BotCommand {
  public matchPatterns: MatchTerm[];

  abstract run(parameters: any): any;

  public expressionMatchesText(userInput: string): RegExpExecArray | boolean {
    let matchResult: RegExpExecArray | boolean;
    for (const pattern of this.matchPatterns) {
      if (typeof pattern == "string") {
        matchResult = new RegExp(pattern).exec(userInput);
      } else if (pattern instanceof RegExp) {
        matchResult = pattern.exec(userInput);
      } else {
        matchResult = pattern(userInput);
      }
      if (matchResult) {
        return matchResult;
      }
    }
    return false;
  }
}

export class SSOCommand extends BotCommand {
  public operationWithSSOToken: (
    arg0: any,
    ssoToken: string
  ) => Promise<any> | undefined;

  async run(parameters: any): Promise<any> {
    const ssoDialog = parameters.ssoDialog;
    ssoDialog.setSSOOperation(this.operationWithSSOToken);
    await ssoDialog.run(parameters.context, parameters.dialogState);
  }
}

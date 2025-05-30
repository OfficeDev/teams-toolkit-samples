import { TurnContext } from "@microsoft/agents-hosting";

export interface SSOCommand {
  commandMessage: string;
  operationWithSSOToken(
    context: TurnContext, ssoToken: string
  ): Promise<any> | undefined;
}

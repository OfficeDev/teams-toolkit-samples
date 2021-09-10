import { SSOCommand } from "../helplers/ssoCommand";
import { ResponseType } from "@microsoft/microsoft-graph-client";
import { CardFactory, TurnContext } from "botbuilder";
import {
  createMicrosoftGraphClient,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";

export class ShowUserProfile extends SSOCommand {
  constructor() {
    super();
    this.commandKey = "show";
    this.operationWithSSOToken = this.showUserInfo;
  }

  async showUserInfo(context: TurnContext, ssoToken: string) {
    await context.sendActivity("Call Microsoft Graph on behalf of user...");

    // Call Microsoft Graph on behalf of user
    const oboCredential = new OnBehalfOfUserCredential(ssoToken);
    const graphClient = createMicrosoftGraphClient(oboCredential, [
      "User.Read",
    ]);
    const me = await graphClient.api("/me").get();
    if (me) {
      await context.sendActivity(
        `You're logged in as ${me.displayName} (${me.userPrincipalName})${
          me.jobTitle ? `; your job title is: ${me.jobTitle}` : ""
        }.`
      );

      // show user picture
      let photoBinary: ArrayBuffer;
      try {
        photoBinary = await graphClient
          .api("/me/photo/$value")
          .responseType(ResponseType.ARRAYBUFFER)
          .get();
      } catch {
        return;
      }

      const buffer = Buffer.from(photoBinary);
      const imageUri = "data:image/png;base64," + buffer.toString("base64");
      const card = CardFactory.thumbnailCard(
        "User Picture",
        CardFactory.images([imageUri])
      );
      await context.sendActivity({ attachments: [card] });
    } else {
      await context.sendActivity(
        "Getting profile from Microsoft Graph failed! "
      );
    }
  }
}

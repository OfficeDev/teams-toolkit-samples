import { ResponseType } from "@microsoft/microsoft-graph-client";
import { CardFactory, TurnContext } from "botbuilder";
import {
  createMicrosoftGraphClientWithCredential,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import "isomorphic-fetch";
import { SSOCommand } from "./SSOCommand";
import oboAuthConfig from "../authConfig";

export class ShowUserProfile implements SSOCommand {
  commandMessage = 'show';

  async operationWithSSOToken(context: TurnContext, ssoToken: string) {
    await context.sendActivity("Retrieving user information from Microsoft Graph ...");

    // Call Microsoft Graph half of user
    const oboCredential = new OnBehalfOfUserCredential(ssoToken, oboAuthConfig);
    const graphClient = createMicrosoftGraphClientWithCredential(oboCredential, [
      "User.Read",
    ]);
    const me = await graphClient.api("/me").get();
    if (me) {
      await context.sendActivity(
        `You're logged in as ${me.displayName} (${me.userPrincipalName})${me.jobTitle ? `; your job title is: ${me.jobTitle}` : ""
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
        "Could not retrieve profile information from Microsoft Graph."
      );
    }
  }

}

import { ResponseType, Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { CardFactory, TurnContext } from "@microsoft/agents-hosting";
import { OnBehalfOfCredential } from "@azure/identity";
import { SSOCommand } from "./SSOCommand";
import oboAuthConfig from "../authConfig";
import { Activity } from "@microsoft/agents-activity";

export class ShowUserProfile implements SSOCommand {
  commandMessage = "show";

  async operationWithSSOToken(context: TurnContext, ssoToken: string) {
    await context.sendActivity(
      "Retrieving user information from Microsoft Graph ..."
    );

    // Call Microsoft Graph half of user
    const oboCredential = new OnBehalfOfCredential({...oboAuthConfig, userAssertionToken: ssoToken });

    // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
    const authProvider = new TokenCredentialAuthenticationProvider(
      oboCredential,
      {
        scopes: ["User.Read"],
      }
    );

    // Initialize Graph client instance with authProvider
    const graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
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
            url: imageUri,
            size: "Large",
            horizontalAlignment: "Left"
          }
        ],
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.4"
      });
      await context.sendActivity(Activity.fromObject({ attachments: [card], type: "message" }));
    } else {
      await context.sendActivity(
        "Could not retrieve profile information from Microsoft Graph."
      );
    }
  }
}

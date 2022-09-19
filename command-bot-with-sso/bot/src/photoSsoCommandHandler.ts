import { Activity, ActivityTypes, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TriggerPatterns,
  TeamsFx,
  createMicrosoftGraphClient,
  TeamsFxBotSsoCommandHandler,
  TeamsBotSsoPromptTokenResponse,
} from "@microsoft/teamsfx";

export class PhotoSsoCommandHandler implements TeamsFxBotSsoCommandHandler {
  triggerPatterns: TriggerPatterns = "photo";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage,
    tokenResponse: TeamsBotSsoPromptTokenResponse,
  ): Promise<string | Partial<Activity> | void> {
    await context.sendActivity("Retrieving user information from Microsoft Graph ...");

    // Init TeamsFx instance with SSO token
    const teamsfx = new TeamsFx().setSsoToken(tokenResponse.ssoToken);

    // Add scope for your Azure AD app. For example: Mail.Read, etc.
    const graphClient = createMicrosoftGraphClient(teamsfx, ["User.Read"]);
    // You can add following code to get your photo:
    let photoUrl = "";
    try {
      const photo = await graphClient.api("/me/photo/$value").get();
      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer, 'binary');
      photoUrl = "data:image/png;base64," + buffer.toString("base64");
    } catch {
      // Could not fetch photo from user's profile, return empty string as placeholder.
    }
    if (photoUrl) {
      const photoMessage: Partial<Activity> = {
        type: ActivityTypes.Message,
        text: 'This is your photo:',
        attachments: [
          {
            name: 'photo.png',
            contentType: 'image/png',
            contentUrl: photoUrl
          }
        ]
      };
      return photoMessage;
    } else {
      return "Could not retrieve your photo from Microsoft Graph. Please make sure you have uploaded your photo.";
    }
  }
}
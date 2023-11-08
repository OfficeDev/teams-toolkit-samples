import { Activity, TeamsInfo, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";

export class MembersCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "members";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    const result = await TeamsInfo.getPagedMembers(context);
    return result.members.map(m => m.name).join(", ");
  }
}

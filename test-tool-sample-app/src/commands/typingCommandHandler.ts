import { Activity, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";

export class TypingCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "typing";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    await context.sendActivity({type: "typing"});
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await context.sendActivity({type: "typing"});
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await context.sendActivity({type: "message", text: "Your message here"});
  }
}

import { Activity, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";

export class MarkdownCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "markdown";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);
    return `#### Markdown example

**bold text**

*italic text*

~~strikethrough text~~

1. ordered list item 1
1. ordered list item 2
1. ordered list item 3

- unordered list item 1
- unordered list item 2
- unordered list item 3

> blockquote

[hyperlink](https://www.botframework.com)

<strong>HTML strong tag</strong>
    `
  }
}

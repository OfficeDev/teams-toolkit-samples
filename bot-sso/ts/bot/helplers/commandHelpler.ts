import { LearnCommand } from "../commands/learn";
import { ShowUserProfile } from "../commands/showUserProfile";
import { WelcomeCommand } from "../commands/welcome";


export const CommandClasses = [ShowUserProfile, WelcomeCommand, LearnCommand];

export class CommandsHandler {
  commandInstanceMap: Map<string, any> = new Map();
  constructor() {
    this.registerCommand();
  }

  registerCommand() {
    CommandClasses.forEach(commandClass => {
      const commandInstance = new commandClass();
      this.commandInstanceMap.set(commandInstance.commandKey, commandInstance);
    });
  }

  async triggerCommand(commandKey: string, parameters: any) {    
    if(!this.commandInstanceMap.has(commandKey)){
      return;
    }
    const commandInstance = this.commandInstanceMap.get(commandKey);
    await commandInstance.run(parameters);
  }
}
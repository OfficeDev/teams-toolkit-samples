export interface BotCommand {
  commandKey: string;

  run(parameters: any): any;
}

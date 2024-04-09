export enum ActionCommandId {
  Default = "default",
  StaticCard = "staticCard",
  MultipleCards = "multipleCards",
  CardNotInsert = "cardNotInsert",
  EmbeddedWebview = "webview",
  InvalidFetchTask = "invalidFetchTask",
  InvalidSubmitAction = "invalidSubmitAction",
  PreviewEditCard = "previewEditCard",
  FetchTaskMessage = "fetchTaskMessage",
}

export interface ActionCommand {
  id: ActionCommandId;
  description: string;
  hide?: boolean;
}

export const ActionCommands: Array<ActionCommand> = [{
  id: ActionCommandId.Default,
  description: "Create ME action dialog with adaptive card dynamically",
}, {
  id: ActionCommandId.StaticCard,
  description: "Create ME action dialog with static list of parameters <br/>(**ensure 'Static list of parameters' is selected while creating the dialog**)",
}, {
  id: ActionCommandId.MultipleCards,
  description: "Display multiple cards in a ME action dialog",
}, {
  id: ActionCommandId.CardNotInsert,
  description: "Submit ME action without inserting card into input box",
}, {
  id: ActionCommandId.EmbeddedWebview,
  description: "Display warning if ME action dialog is created with embedded webview",
  hide: true,
}, {
  id: ActionCommandId.InvalidFetchTask,
  description: "Display warning if invalid fetch task response is returned from ME app",
  hide: true,
}, {
  id: ActionCommandId.InvalidSubmitAction,
  description: "Display warning if invalid submit action response is returned from ME app",
  hide: true,
}, {
  id: ActionCommandId.PreviewEditCard,
  description: "Display warning if bot preview edit card is returned from ME app",
  hide: true,
}, {
  id: ActionCommandId.FetchTaskMessage,
  description: "Display warning if message type of fetch task response is returned from ME app",
  hide: true,
}]

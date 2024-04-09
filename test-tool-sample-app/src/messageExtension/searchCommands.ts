export enum SearchCommandId {
  Default = "default",
  Text = "text",
  HeroPreviewCard = "hero",
  ThumbnailPreviewCard = "thumbnail",
  HeroCard = "heroCard",
  O365 = "o365",
  Grid = "grid",
  Tap = "tap",
}

export interface SearchCommand {
  id: SearchCommandId;
  description: string;
  hide?: boolean;
}

export const SearchCommands: Array<SearchCommand> = [{
  id: SearchCommandId.Default,
  description: "Search npm package by name",
}, {
  id: SearchCommandId.Text,
  description: "Return a message as search result",
}, {
  id: SearchCommandId.HeroPreviewCard,
  description: "Return hero card as preview card in search result",
}, {
  id: SearchCommandId.ThumbnailPreviewCard,
  description: "Return thumbnail card as preview card in search result",
}, {
  id: SearchCommandId.HeroCard,
  description: "Return hero card as search result",
  hide: true,
}, {
  id: SearchCommandId.O365,
  description: "Return O365 card as search result",
  hide: true,
}, {
  id: SearchCommandId.Grid,
  description: "Return search result with grid layout",
  hide: true,
}, {
  id: SearchCommandId.Tap,
  description: "Return hero card with tap action as search result",
  hide: true,
}]
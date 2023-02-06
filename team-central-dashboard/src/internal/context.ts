import { TeamsFx } from "@microsoft/teamsfx";
import { createContext } from "react";

export const TeamsFxContext = createContext<{
  themeString: string,
  teamsfx?: TeamsFx,
}>({
  themeString: "",
  teamsfx: undefined
});

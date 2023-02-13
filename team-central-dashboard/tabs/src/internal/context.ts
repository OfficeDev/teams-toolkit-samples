import { TeamsUserCredential } from "@microsoft/teamsfx";
import { createContext } from "react";

export const TeamsFxContext = createContext<{
  themeString: string,
  credential?: TeamsUserCredential,
}>({
  themeString: "",
  credential: undefined
});

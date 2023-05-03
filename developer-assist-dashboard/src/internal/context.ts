import { createContext } from "react";

import { Theme } from "@fluentui/react-components";
import { TeamsUserCredential } from "@microsoft/teamsfx";

/**
 * This context provides a way to share data between components in the app.
 * It contains the theme, themeString, and teamsUserCredential.
 */
export const TeamsFxContext = createContext<{
  theme?: Theme;
  themeString: string;
  teamsUserCredential?: TeamsUserCredential;
}>({
  theme: undefined,
  themeString: "",
  teamsUserCredential: undefined,
});

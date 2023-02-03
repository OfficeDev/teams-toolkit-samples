import { HashRouter as Router, Redirect, Route } from "react-router-dom";

import {
  FluentProvider,
  teamsDarkTheme,
  teamsHighContrastTheme,
  teamsLightTheme,
} from "@fluentui/react-components";
import { useTeamsFx } from "@microsoft/teamsfx-react";

import { TeamsFxContext } from "./internal/context";
import MyDashboard from "./views/dashboards/MyDashboard";
import Privacy from "./views/Privacy";
import TabConfig from "./views/TabConfig";
import TermsOfUse from "./views/TermsOfUse";

export default function App() {
  const { themeString, teamsfx } = useTeamsFx();
  return (
    <TeamsFxContext.Provider value={{ themeString, teamsfx }}>
      <FluentProvider
        theme={
          themeString === "dark"
            ? teamsDarkTheme
            : themeString === "contrast"
            ? teamsHighContrastTheme
            : teamsLightTheme
        }
        style={{
          height: "100vh",
          background: "var(--Background)",
        }}
      >
        <Router>
          <Route exact path="/">
            <Redirect to="/tab" />
          </Route>
          <>
            <Route exact path="/privacy" component={Privacy} />
            <Route exact path="/termsofuse" component={TermsOfUse} />
            <Route exact path="/tab" component={MyDashboard} />
            <Route exact path="/config" component={TabConfig} />
          </>
        </Router>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}

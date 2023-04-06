import "./App.css";

import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

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
  const { themeString } = useTeamsFx();
  return (
    <TeamsFxContext.Provider value={{ themeString }}>
      <FluentProvider
        theme={
          themeString === "dark"
            ? teamsDarkTheme
            : themeString === "contrast"
            ? teamsHighContrastTheme
            : teamsLightTheme
        }
        className="app"
      >
        <Router>
          <Routes>
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/termsofuse" element={<TermsOfUse />} />
            <Route path="/tab" element={<MyDashboard />} />
            <Route path="/config" element={<TabConfig />} />
            <Route path="*" element={<Navigate to={"/tab"} />}></Route>
          </Routes>
        </Router>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}

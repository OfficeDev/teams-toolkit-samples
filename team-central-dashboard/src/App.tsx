import "./App.css";

import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import {
  FluentProvider,
  teamsDarkTheme,
  teamsHighContrastTheme,
  teamsLightTheme,
} from "@fluentui/react-components";
import { useTeamsFx } from "@microsoft/teamsfx-react";

import MyDashboard from "./dashboards/MyDashboard";
import { TeamsFxContext } from "./internal/context";
import Privacy from "./Privacy";
import TabConfig from "./TabConfig";
import TermsOfUse from "./TermsOfUse";

export default function App() {
  const { themeString } = useTeamsFx();
  return (
    <TeamsFxContext.Provider value={{ themeString }}>
      <FluentProvider
        id="fluent-provider"
        theme={
          themeString === "dark"
            ? teamsDarkTheme
            : themeString === "contrast"
            ? teamsHighContrastTheme
            : teamsLightTheme
        }
      >
        <Router>
          <Routes>
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/termsofuse" element={<TermsOfUse />} />
            <Route path="/tab" element={<MyDashboard />} />
            <Route path="/config" element={<TabConfig />} />
            <Route path="*" element={<Navigate to={"/tab"} />} />
          </Routes>
        </Router>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}

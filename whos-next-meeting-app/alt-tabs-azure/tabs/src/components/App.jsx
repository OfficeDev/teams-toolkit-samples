import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from "./WhosNext";
import WhosNextConfig from "./WhosNextConfig";
import "./App.css";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/termsofuse" element={<TermsOfUse />} />
        <Route path="/tab" element={<Tab />} />
        <Route path="/config" element={<WhosNextConfig />} />
      </Routes>
    </Router>
  );
}

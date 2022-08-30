// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import Resources from "./constants/resources";
import { app } from "@microsoft/teams-js";
import { Provider, themes } from "@fluentui/react-northstar";
import DiscoverWrapperPage from "./components/card-view/discover-wrapper-page";
import ErrorPage from "./components/error-page";
import "./styles/site.css";
import "./i18n";
import { HashRouter as Router, Route } from "react-router-dom";
import { Suspense } from "react";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Website from "./Website";

export interface IAppState {
    theme: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default class App extends React.Component<{}, IAppState> {
    theme?: string | null;

    constructor(props: {[key:string]:unknown}) {
      super(props);
      const search = window.location.search;
      const params = new URLSearchParams(search);
      this.theme = params.get("theme");

      this.state = {
        theme: this.theme ? this.theme : Resources.default,
      }
    }

    componentDidMount():void {
      app.initialize().then(() => {
        app.registerOnThemeChangeHandler((theme: string) => {
          this.setState({ theme: theme }, () => {
            this.forceUpdate();
          });
        });
      });
    }

    public setThemeComponent:() => JSX.Element = () => {
      if (this.state.theme === Resources.dark) {
        return (
          <Provider theme={themes.teamsDark}>
            <div className="dark-container">
              {this.getAppDom()}
            </div>
          </Provider>
        );
      }
      else if (this.state.theme === Resources.contrast) {
        return (
          <Provider theme={themes.teamsHighContrast}>
            <div className="high-contrast-container">
              {this.getAppDom()}
            </div>
          </Provider>
        );
      } else {
        return (
          <Provider theme={themes.teams}>
            <div className="default-container">
              {this.getAppDom()}
            </div>
          </Provider>
        );
      }
    }

    public getAppDom: () => JSX.Element = () => {
      return (
        <div className="appContainer">
          <Suspense fallback={<div className="container-div"><div className="container-subdiv"></div></div>}>
            <Router>
              <Route exact path="/" component={DiscoverWrapperPage} />
              <Route exact path="/tab" component={DiscoverWrapperPage} />
              <Route exact path="/discover" component={DiscoverWrapperPage} />
              <Route exact path="/errorpage/:message?" component={ErrorPage} />
              <Route exact path="/privacy" component={Privacy} />
              <Route exact path="/termsofuse" component={TermsOfUse} />
              <Route exact path="/website" component={Website} />
            </Router>
          </Suspense>
        </div>);
    }

    /**
	* Renders the component
	*/
    public render(): JSX.Element {
      return (
        <div>
          {this.setThemeComponent()}
        </div>
      );
    }
}
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from "react";
import "./App.css";
import { TeamsUserCredential } from "@microsoft/teamsfx";
import { Button } from "@fluentui/react-components";
import { Providers, ProviderState } from "@microsoft/mgt-element";
import {
  Agenda,
  Todo,
  FileList,
  Person,
  PersonViewType,
} from "@microsoft/mgt-react";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import { CacheService } from "@microsoft/mgt";
import config from "./lib/config";

class Tab extends React.Component {
  constructor(props) {
    super(props);
    const cacheId = Providers.getCacheId();
    CacheService.clearCacheById(cacheId);
    this.state = {
      showLoginPage: undefined,
    };
  }
  async componentDidMount() {
    /*Define scope for the required permissions*/
    this.scope = [
      "User.Read",
      "User.ReadBasic.All",
      "Calendars.Read",
      "Files.Read.All",
      "Sites.Read.All",
      "Tasks.ReadWrite",
      "People.Read",
    ];

    /*Initialize TeamsFX provider*/
    this.credential = new TeamsUserCredential({
      initiateLoginEndpoint: config.initiateLoginEndpoint,
      clientId: config.clientId,
    });
    const provider = new TeamsFxProvider(this.credential, this.scope);
    Providers.globalProvider = provider;

    /*Check if consent is needed*/
    let consentNeeded = false;
    try {
      await this.credential.getToken(this.scope);
    } catch (error) {
      consentNeeded = true;
    }
    this.setState({
      showLoginPage: consentNeeded,
    });
    Providers.globalProvider.setState(
      consentNeeded ? ProviderState.SignedOut : ProviderState.SignedIn
    );
    return consentNeeded;
  }

  async loginBtnClick() {
    try {
      await this.credential.login(this.scope);
      Providers.globalProvider.setState(ProviderState.SignedIn);
      this.setState({
        showLoginPage: false,
      });
    } catch (err) {
      if (err.message?.includes("CancelledByUser")) {
        const helpLink = "https://aka.ms/teamsfx-auth-code-flow";
        err.message +=
          '\nIf you see "AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application" ' +
          "in the popup window, you may be using unmatched version for TeamsFx SDK (version >= 0.5.0) and Teams Toolkit (version < 3.3.0) or " +
          `cli (version < 0.11.0). Please refer to the help link for how to fix the issue: ${helpLink}`;
      }
      alert("Login failed: " + err);
      return;
    }
  }
  render() {
    return (
      <div>
        {this.state.showLoginPage === false && (
          <div>
            <div className="features-avatar">
              <Person
                personQuery="me"
                view={PersonViewType.threelines}
              ></Person>
            </div>

            <div className="features">
              <div className="header">
                <div className="title">
                  <h2>One Productivity Hub</h2>

                  <div class="row">
                    <div class="column">
                      <h3>Calendar events</h3>
                    </div>
                    <div class="column">
                      <h3>To-do tasks</h3>
                    </div>
                    <div class="column">
                      <h3>Files</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row" className="content">
                <div class="column" className="mgt-col">
                  <Agenda></Agenda>
                </div>
                <div class="column" className="mgt-col">
                  <Todo></Todo>
                </div>
                <div class="column" className="mgt-col">
                  <FileList></FileList>
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.showLoginPage === true && (
          <div className="auth">
            <h3>Welcome to One Productivity Hub app!</h3>
            <p>
              Please click on "Start One Productivity Hub" and consent
              permissions to use the app.
            </p>
            <Button appearance="primary" onClick={() => this.loginBtnClick()}>
              Start One Productivity Hub
            </Button>
          </div>
        )}
      </div>
    );
  }
}
export default Tab;

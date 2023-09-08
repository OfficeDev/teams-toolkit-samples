// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from "react";
import "./App.css";
import "./Tab.css";
import { Button } from "@fluentui/react-components";

import { Providers, ProviderState } from "@microsoft/mgt-element";
import {
  Person,
  PersonViewType,
} from "@microsoft/mgt-react";
import { CacheService } from "@microsoft/mgt";
import config from "./lib/config";

import { TeamsUserCredential } from "@microsoft/teamsfx";

class Tab extends React.Component {
  constructor(props) {
    super(props);
    CacheService.clearCaches();

    this.state = {
      showLoginPage: undefined,
    };
  }

  async componentDidMount() {
    await this.initTeamsFx();
    await this.initGraphToolkit(this.credential);
    await this.checkIsConsentNeeded(this.credential);
  }

  async initGraphToolkit(credential) {
    const ssoToken = (await credential.getToken("")).token;
    Providers.globalProvider = new ProxyProvider(
      config.apimEndpoint,
      async () => {
        return {
          Authorization: `Bearer ${ssoToken}`,
        }
      }
    );
  }

  async initTeamsFx() {
    this.credential = new TeamsUserCredential({
      initiateLoginEndpoint: config.initiateLoginEndpoint,
      clientId: config.clientId,
    });
    this.scope = ["User.Read"];
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

  async checkIsConsentNeeded(credential) {
    let consentNeeded = false;
    const ssoToken = (await credential.getToken("")).token;
    try {
      await axios.get(`${config.apimEndpoint}/v1.0/me`, {
        headers: {
          Authorization: `Bearer ${ssoToken}`,
        }
      });
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

  render() {
    return (
      <div>
        {this.state.showLoginPage === false && (
          <div className="flex-container">
            <div className="features-col">
              <div className="features">
                <div className="header">
                  <div className="title">
                    <h2>Current Login Account</h2>
                  </div>
                </div>

                <div className="my-account-area">
                  <Person
                    personQuery="me"
                    view={PersonViewType.threelines}
                  ></Person>
                </div>
              </div>
            </div>
          </div>
        )}

        {this.state.showLoginPage === true && (
          <div className="auth">
            <h2>Welcome to Contact Exporter App!</h2>
            <Button appearance="primary" onClick={() => this.loginBtnClick()}>
              Start
            </Button>
          </div>
        )}
      </div>
    );
  }
}
export default Tab;

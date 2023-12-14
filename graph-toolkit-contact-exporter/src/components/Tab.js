// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from "react";
import "./App.css";
import "./Tab.css";
import {
  Button,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHeaderCell,
  TableCell,
  TableCellLayout,
} from "@fluentui/react-components";

import { Providers, ProviderState } from "@microsoft/mgt-element";
import {
  PeoplePicker,
  Person,
  PersonViewType,
  PersonCardInteraction,
} from "@microsoft/mgt-react";
import { CSVLink } from "react-csv";

import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import { CacheService } from "@microsoft/mgt";
import config from "./lib/config";

import { TeamsUserCredential } from "@microsoft/teamsfx";

class Tab extends React.Component {
  constructor(props) {
    super(props);
    const cacheId = Providers.getCacheId();
    CacheService.clearCacheById(cacheId);

    this.state = {
      showLoginPage: undefined,
      selectedPeople: undefined,
      tableHeader: ["Name", "Email", "User Principal Name"],
      tableRows: [],
      csvData: [],
    };
  }

  async componentDidMount() {
    await this.initTeamsFx();
    await this.initGraphToolkit(this.credential, this.scope);
    await this.checkIsConsentNeeded();
  }

  async initGraphToolkit(credential, scope) {
    const provider = new TeamsFxProvider(credential, scope);
    Providers.globalProvider = provider;
  }

  async initTeamsFx() {
    this.credential = new TeamsUserCredential({
      initiateLoginEndpoint: config.initiateLoginEndpoint,
      clientId: config.clientId,
    });

    // Only these two permission can be used without admin approval in microsoft tenant
    this.scope = ["User.Read", "User.ReadBasic.All"];
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

  async checkIsConsentNeeded() {
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

  render() {
    const handleInputChange = (e) => {
      this.setState({
        selectedPeople: e.target.selectedPeople,
      });

      const rows = e.target.selectedPeople.map((person, index) => {
        return {
          key: index,
          items: [
            {
              content: (
                <Person
                  userId={person.id}
                  view={PersonViewType.oneline}
                  personCardInteraction={PersonCardInteraction.hover}
                ></Person>
              ),

              title: person.displayName,
            },
            { content: person.mail, title: person.mail },
            {
              content: person.userPrincipalName,
              title: person.userPrincipalName,
            },
          ],
        };
      });

      this.setState({
        tableRows: rows,
      });
    };

    const handleDownloadExcel = (e) => {
      if (this.state.selectedPeople?.length > 0) {
        this.setState({
          csvData: [
            this.state.tableHeader,
            ...this.state.selectedPeople.map((person) => [
              person.displayName,
              person.userPrincipalName,
              person.mail,
            ]),
          ],
        });
        return true;
      }

      alert("Please select at least one person to export contact info");
      return false;
    };

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

                <div className="header">
                  <div className="title">
                    <h2>Contact Table</h2>
                  </div>
                </div>

                <div className="people-picker-area">
                  <PeoplePicker
                    userType="user"
                    selectionChanged={handleInputChange}
                  ></PeoplePicker>
                </div>

                <div className="table-area">
                  <Table aria-label="Static table">
                    <TableHeader>
                      <TableRow>
                        {this.state.tableHeader.map((column) => (
                          <TableHeaderCell key={column}>
                            {column}
                          </TableHeaderCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {this.state.tableRows.map((rows) => (
                        <TableRow key={rows.key}>
                          {rows.items.map((item) => (
                            <TableCell key={item.title}>
                              <TableCellLayout truncate>
                                {item.content}
                              </TableCellLayout>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="export-btn-container">
                  <div className="export-btn">
                    <CSVLink
                      data={this.state.csvData}
                      onClick={handleDownloadExcel}
                      filename="contact.csv"
                    >
                      <Button appearance="primary">
                        Export Contact Table to Excel
                      </Button>
                    </CSVLink>
                  </div>
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

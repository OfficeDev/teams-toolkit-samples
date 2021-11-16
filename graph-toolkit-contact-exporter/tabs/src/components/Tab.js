// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import './Tab.css'
import {
  TeamsUserCredential,
  loadConfiguration,
} from "@microsoft/teamsfx";
import { Button, Table } from "@fluentui/react-northstar"

import { Providers, ProviderState, SimpleProvider } from '@microsoft/mgt-element';
import { PeoplePicker, Person, PersonViewType, PersonCardInteraction } from '@microsoft/mgt-react';
import { CSVLink } from "react-csv";
class Tab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showLoginPage: undefined,
      selectedPeople: undefined,
      tableHeader:['Name', 'Email', 'User Principal Name'],
      tableRows:[],
      csvData: []
    }
  }

  async componentDidMount() {
    await this.initTeamsFx();
    await this.initGraphToolkit(this.credential, this.scope);
    await this.checkIsConsentNeeded();
  }

  async initGraphToolkit(credential, scope) {

    async function getAccessToken(scopes) {
      let tokenObj = await credential.getToken(scopes);
      return tokenObj.token;
    }
  
    async function login() {
      try {
        await credential.login(scopes);
      } catch (err) {
        alert("Login failed: " + err);
        return;
      }
      Providers.globalProvider.setState(ProviderState.SignedIn);
    }
  
    async function logout() {}

    Providers.globalProvider = new SimpleProvider(getAccessToken, login, logout);
    Providers.globalProvider.setState(ProviderState.SignedIn);
  }

  async initTeamsFx() {
    loadConfiguration({
      authentication: {
        initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
        simpleAuthEndpoint: process.env.REACT_APP_TEAMSFX_ENDPOINT,
        clientId: process.env.REACT_APP_CLIENT_ID
      }
    });
    const credential = new TeamsUserCredential();

    this.credential = credential;
    // Only these two permission can be used without admin approval in microsoft tenant
    this.scope = [
      "User.Read",
      "User.ReadBasic.All",
    ];
  }

  async loginBtnClick() {
    try {
      await this.credential.login(this.scope);
      this.setState({
        showLoginPage: false
      });
    } catch (err) {
      alert("Login failed: " + err);
      return;
    }
  }

  async checkIsConsentNeeded() {
    try {
      await this.credential.getToken(this.scope);
    } catch (error) {
      this.setState({
        showLoginPage: true
      });
      return true;
    }
    this.setState({
      showLoginPage: false
    });
    return false;
  }

  
  render() {

    const handleInputChange = (e) => {
      this.setState({
        selectedPeople: e.target.selectedPeople
      })

      const rows = e.target.selectedPeople.map((person, index) => {
        return {
          key: index,
          truncateContent: true,
          items: [
            {
              content: <Person userId={person.id} view={PersonViewType.oneline} personCardInteraction={PersonCardInteraction.hover}></Person>,
              truncateContent: true,
              title: person.displayName,
            },
            { content: person.mail, truncateContent: true, title: person.mail },
            {
              content: person.userPrincipalName,
              title: person.userPrincipalName,
              truncateContent: true,
            },
          ],
        };
      });

      this.setState({
        tableRows: rows
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
        {this.state.showLoginPage === false && <div className="flex-container">
          <div className="features-col">
            <div className="features">
                <div className="header">
                  <div className="title">
                    <h2>Current Login Account</h2>
                  </div>
                </div>

              <div className="my-account-area">
                <Person personQuery="me" view={PersonViewType.threelines}></Person>
              </div>

              <div className="header">
                <div className="title">

                  <h2>Contact Table</h2>

                </div>
              </div>


              <div className="people-picker-area">
                <PeoplePicker selectionChanged={handleInputChange} placeholder="Typing name to select people to view contact info"></PeoplePicker>
              </div>

              <div className="table-area">
                <Table  variables={{cellContentOverflow: 'none'}} header={this.state.tableHeader} rows={this.state.tableRows} aria-label="Static table" />
              </div>
              <div className="export-btn-container">
                <div className="export-btn">
                    <CSVLink data={this.state.csvData} onClick={handleDownloadExcel} filename="contact.csv">
                      <Button primary>Export Contact Table to Excel</Button>
                    </CSVLink>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {this.state.showLoginPage === true && <div className="auth">
          <h2>Welcome to Contact Exporter App!</h2>
          <Button primary onClick={() => this.loginBtnClick()}>Start</Button>
        </div>}
      </div>
    );
  }
}
export default Tab;

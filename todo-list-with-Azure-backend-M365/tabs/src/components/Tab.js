// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import './Tab.css'
import { BearerTokenAuthProvider, createApiClient, TeamsUserCredential } from "@microsoft/teamsfx";
import Profile from "./Profile";
import Creator from "./Creator";
import { Checkbox, Button, Input, MenuButton } from "@fluentui/react-northstar"
import noItemimage from '../images/no-item.png'
import { app } from '@microsoft/teams-js';

class Tab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      items: [],
      newItemDescription: "",
      showLoginPage: undefined,
      isAddingItem: false,
      initialized: false,
      platformInfo: {},
    }
  }

  async componentDidMount() {
    await this.initTeamsFx();
    await this.initData();
  }

  async initTeamsFx() {
    const authConfig = {
      clientId: process.env.REACT_APP_CLIENT_ID,
      initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
    };
    
    const credential = new TeamsUserCredential(authConfig);
    const userInfo = credential.getUserInfo();

    this.setState({
      userInfo: userInfo
    });

    this.credential = credential;
    this.scope = ["User.Read", "User.ReadBasic.All"];
    this.channelOrChatId = await this.getChannelOrChatId();
    const platformInfo = await this.getPlatformInfo();
    this.setState({
      platformInfo: platformInfo,
    });

    const apiBaseUrl = process.env.REACT_APP_FUNC_ENDPOINT + "/api/";
    // createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
    const apiClient = createApiClient(
      apiBaseUrl,
      new BearerTokenAuthProvider(async () => (await credential.getToken("")).token));
    this.apiClient = apiClient;
  }

  async initData() {
    if (!await this.checkIsConsentNeeded()) {
      await this.getItems();
    }
  }

  async loginBtnClick() {
    try {
      // Popup login page to get user's access token
      await this.credential.login(this.scope);
    } catch (err) {
      if (err instanceof Error && err.message?.includes("CancelledByUser")) {
        const helpLink = "https://aka.ms/teamsfx-auth-code-flow";
        err.message +=
          "\nIf you see \"AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application\" " +
          "in the popup window, you may be using unmatched version for TeamsFx SDK (version >= 0.5.0) and Teams Toolkit (version < 3.3.0) or " +
          `cli (version < 0.11.0). Please refer to the help link for how to fix the issue: ${helpLink}` ;
      }

      alert("Login failed: " + err);
      return;
    }
    await this.initData();
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

  async getChannelOrChatId() {
    return new Promise((resolve) => {
      app.getContext().then((context) => {
        if (context.channelId) {
          resolve(context.channelId);
        } else if (context.chatId) {
          resolve(context.chatId);
        } else {
          resolve(this.state.userInfo.objectId);
        }
      });
    });
  }

  async callFunctionWithErrorHandling(command, method, options, params) {
    var message = [];
    var funcErrorMsg = "";
    try {
      const response = await this.apiClient.request({
        method: method,
        url: command,
        data: options,
        params
      });
      message = response.data;
    } catch (err) {
      if (err.response && err.response.status && err.response.status === 404) {
        funcErrorMsg =
          'There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "TeamsFx - Deploy Package") first before running this App';
      } else if (err.message === "Network Error") {
        funcErrorMsg =
          "Cannot call Azure Function due to network error, please check your network connection status and ";
        if (err.config.url.indexOf("localhost") >= 0) {
          funcErrorMsg +=
            'make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App';
        } else {
          funcErrorMsg +=
            'make sure to provision and deploy Azure Function (Run command palette "TeamsFx - Provision Resource" and "TeamsFx - Deploy Package") first before running this App';
        }
      } else {
        funcErrorMsg = err.toString();
        if (err.response?.data?.error) {
          funcErrorMsg += ": " + err.response.data.error;
        }
        alert(funcErrorMsg);
      }
    }
    return message;
  }

  async getItems() {
    // Use client TeamsFx SDK to call "todo" Azure Function in "get" method to get all todo list which belong to user oid
    let result = await this.callFunctionWithErrorHandling("todo", "get", undefined, { channelOrChatId: this.channelOrChatId });
    if ("Error" === result) {
      throw new Error("todo Function failed, please check Azure Functions log for details!");
    } else {
      this.setState({
        items: result,
        initialized: true,
      });
    }
  }

  async onAddItem() {
    const newItems = JSON.parse(JSON.stringify(this.state.items));
    newItems.push({
      description: this.state.newItemDescription,
      objectId: this.state.userInfo.objectId
    })
    this.setState({
      newItemDescription: "",
      items: newItems
    });

    // Use client TeamsFx SDK to call "todo" Azure Function in "post" method to insert a new todo item under user oid
    await this.callFunctionWithErrorHandling("todo", "post", {
      description: this.state.newItemDescription, isCompleted: false, channelOrChatId: this.channelOrChatId
    });
    this.refresh();
  }

  async onUpdateItem(id, description) {
    // Use client TeamsFx SDK to call "todo" Azure Function in "put" method to update a todo item
    await this.callFunctionWithErrorHandling("todo", "put", { id, description });
  }

  async onDeleteItem(id) {
    const newItems = this.state.items.filter(item => item.id !== id);
    this.setState({
      items: newItems
    })
    // Use client TeamsFx SDK to call "todo" Azure Function in "delete" method to delete a todo item
    await this.callFunctionWithErrorHandling("todo", "delete", { id });
  }

  async onCompletionStatusChange(id, index, isCompleted) {
    this.handleInputChange(index, "isCompleted", isCompleted);
    // Use client TeamsFx SDK to call "todo" Azure Function in "put" method to update a todo item to completed
    await this.callFunctionWithErrorHandling("todo", "put", { id, isCompleted });
  }

  async getPlatformInfo() {
    return new Promise((resolve, reject) => {
      app.getContext().then((context) => {
        const name = context.app.host?.name;
        resolve({name: name});
      })
    })
  }

  handleInputChange(index, property, value) {
    const newItems = JSON.parse(JSON.stringify(this.state.items))
    newItems[index][property] = value;
    this.setState({
      items: newItems
    })
  }

  async refresh() {
    await this.getItems();
  }

  render() {
    const items = this.state.items?.map((item, index) =>
      <div key={index} className="item">
        <div className="complete">
          <Checkbox
            checked={this.state.items[index].isCompleted}
            onChange={(e, { checked }) => this.onCompletionStatusChange(item.id, index, checked)}
            className="is-completed-input"
          />
        </div>
        <div className="description">
          <Input
            value={this.state.items[index].description}
            onChange={(e) => this.handleInputChange(index, "description", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                this.onUpdateItem(item.id, this.state.items[index].description);
                e.target.blur();
              }
            }}
            onBlur={() => this.onUpdateItem(item.id, this.state.items[index].description)}
            className={"text" + (this.state.items[index].isCompleted ? " is-completed" : "")}
          />
        </div>
        <Creator objectId={item.objectId} credential={this.credential} scope={this.scope} />
        <div className="action">
          <MenuButton
            trigger={<Button content="..." />}
            menu={[
              {
                content: 'Delete',
                onClick: () => this.onDeleteItem(item.id)
              }
            ]}
            on="click"
          />
        </div>
      </div>
    );

    return (
      <div>
        {this.state.showLoginPage === false && <div className="flex-container">
          <div className="todo-col">
            <div className="todo">
              <div className="header">
                <div className="title">
                  <h2>To Do List {this.state.platformInfo?.name ? `(Running on ${this.state.platformInfo.name})` : ""} </h2>
                  <span>{this.state.items.length} item{this.state.items.length === 1 ? "" : "s"}</span>
                </div>

                <div className="add-button">
                  <Button primary onClick={() => this.setState({ isAddingItem: true })}>+ Add task</Button>
                </div>
              </div>

              {this.state.items.length > 0 && <div className="header-container">
                <div className="note">
                  <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.0312 1.00781H12V16H0V1.00781H0.984375V0H1.98438V1.00781H4V0H5V1.00781H7.01562V0H8.01562V1.00781H10.0312V0H11.0312V1.00781ZM11 15V2.00781H1V15H11ZM9 4.00781V5.00781H3V4.00781H9ZM3 13.0156V12.0156H9V13.0156H3ZM3 9.00781V8.00781H9V9.00781H3Z" fill="black" />
                  </svg>
                  <span>Note</span>
                </div>
                <div className="created-by">
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4.5C6 5.32843 5.32843 6 4.5 6C3.67157 6 3 5.32843 3 4.5C3 3.67157 3.67157 3 4.5 3C5.32843 3 6 3.67157 6 4.5Z" fill="#242424" />
                    <path d="M2 7.69879C2 7.17479 2.42479 6.75 2.94879 6.75H6.05121C6.57521 6.75 7 7.17479 7 7.69879C7 8.54603 6.42338 9.28454 5.60144 9.49003L5.54243 9.50478C4.85801 9.67589 4.14199 9.67589 3.45757 9.50478L3.39856 9.49003C2.57661 9.28454 2 8.54603 2 7.69879Z" fill="#242424" />
                    <path d="M9.5 4C9.22386 4 9 4.22386 9 4.5C9 4.77614 9.22386 5 9.5 5H12.5C12.7761 5 13 4.77614 13 4.5C13 4.22386 12.7761 4 12.5 4H9.5Z" fill="#242424" />
                    <path d="M9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8H12.5C12.7761 8 13 7.77614 13 7.5C13 7.22386 12.7761 7 12.5 7H9.5Z" fill="#242424" />
                    <path d="M0 1.75C0 0.783502 0.783502 0 1.75 0H14.25C15.2165 0 16 0.783502 16 1.75V10.25C16 11.2165 15.2165 12 14.25 12H1.75C0.783501 12 0 11.2165 0 10.25V1.75ZM1.75 1C1.33579 1 1 1.33579 1 1.75V10.25C1 10.6642 1.33579 11 1.75 11H14.25C14.6642 11 15 10.6642 15 10.25V1.75C15 1.33579 14.6642 1 14.25 1H1.75Z" fill="#242424" />
                  </svg>
                  <span>Created By</span>
                </div>
              </div>}

              {items}

              {this.state.isAddingItem && <div className="item add">
                <div className="complete">
                  <Checkbox
                    disabled
                    className="is-completed-input"
                  />
                </div>
                <div className="description">
                  <Input
                    autoFocus
                    type="text"
                    value={this.state.newItemDescription}
                    onChange={(e) => this.setState({ newItemDescription: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        this.onAddItem();
                      }
                    }}
                    onBlur={() => {
                      if (this.state.newItemDescription) {
                        this.onAddItem();
                      }
                      this.setState({
                        isAddingItem: false,
                      });
                    }}
                    className="text"
                  />
                </div>
              </div>}

              {this.state.initialized && !this.state.items.length && !this.state.isAddingItem && <div className="no-item">
                <div>
                  <img src={noItemimage} alt="no item" />
                </div>
                <div>
                  <h2>No tasks</h2>
                  <p>Add more tasks to make you day productive.</p>
                </div>
              </div>}
            </div>
          </div>
        </div>}

        {this.state.showLoginPage === true && <div className="auth">
          <Profile userInfo={this.state.userInfo} />
          <h2>Welcome to To Do List App!</h2>
          <Button primary onClick={() => this.loginBtnClick()}>Start</Button>
        </div>}
      </div>
    );
  }
}
export default Tab;

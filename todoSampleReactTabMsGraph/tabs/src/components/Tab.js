// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import './Tab.css';
import Profile from "./Profile";
import { StorageClient } from './StorageClient';
import { Checkbox, Dropdown, getContext, Input, PrimaryButton, TeamsThemeContext, ThemeStyle } from 'msteams-ui-components-react';
import noItemimage from '../images/no-item.png'
import {
  TeamsUserCredential,
  createMicrosoftGraphClient,
  loadConfiguration,
  ResourceType
} from "@microsoft/teamsfx";

/**
 * The 'PersonalTab' component renders the main tab content
 * of your app.
 */
class Tab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      profile: {},
      items: [],
      newItemDescription: "",
      showLoginPage: false,
      photoObjectURL: "",
      isAddingItem: false,
      initialized: false
    }
  }

  //React lifecycle method that gets called once a component has finished mounting
  //Learn more: https://reactjs.org/docs/react-component.html#componentdidmount
  async componentDidMount() {
    // Next steps: Error handling using the error object
    await this.initTeamsFx();
    await this.getData();
    this.setState({
      initialized: true
    });
  }

  async initTeamsFx() {
    loadConfiguration({
      authentication: {
        initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
        simpleAuthEndpoint: process.env.REACT_APP_MODS_ENDPOINT,
        clientId: ""
      },
      resources: [
        {
          type: ResourceType.API,
          name: "default",
          properties: {
            endpoint: process.env.REACT_API_ENDPOINT || "http://localhost:7071/"
          }
        }
      ]
    });
    const credential = new TeamsUserCredential();
    const userInfo = await credential.getUserInfo();

    this.setState({
      userInfo: userInfo
    });

    this.credential = credential;
    this.scope = ['User.Read', 'Sites.Read.All', 'Sites.ReadWrite.All'];
  }

  async getData() {
    try {
      // Get Microsoft Graph client
      const graphClient = await createMicrosoftGraphClient(this.credential, this.scope);

      try {
        var photoBlob = await graphClient.api("/me/photo/$value").get();
        this.setState({
          photoObjectURL: URL.createObjectURL(photoBlob)
        });
      } catch (error) {
        this.setState({
          fetchPhotoErrorMessage: 'Could not fetch photo from your profile, you need to add photo in the profile settings first: ' + error.message
        });
      }

      this.storageClient = new StorageClient(graphClient);
      this.setState({
        items: await this.storageClient.getItems(),
        profile: await graphClient.api("/me").get(),
        showLoginPage: false
      });
    }
    catch (err) {
      this.setState({
        showLoginPage: true
      });
    }
  }

  async loginBtnClick() {
    try {
      await this.credential.login(this.scope);
    }
    catch (err) {
      alert('Login failed: ' + err);
      return;
    }

    await this.getData();
  }

  async onAddItem() {
    const newItems = JSON.parse(JSON.stringify(this.state.items));
    newItems.push({
      description: this.state.newItemDescription
    })
    this.setState({
      newItemDescription: "",
      items: newItems
    });
    await this.storageClient.addItem(this.state.newItemDescription);
    this.refresh();
  }

  async onUpdateItem(id, description) {
    await this.storageClient.updateItemDescription(id, description);
  }

  async onDeleteItem(id) {
    await this.storageClient.deleteItem(id);
    this.refresh();
  }

  async onCompletionStatusChange(id, index, isCompleted) {
    this.handleInputChange(index, "isCompleted", isCompleted);
    await this.storageClient.updateItemCompletionStatus(id, isCompleted);
  }

  handleInputChange(index, property, value) {
    const newItems = JSON.parse(JSON.stringify(this.state.items))
    newItems[index][property] = value;
    this.setState({
      items: newItems
    })
  }

  async refresh() {
    this.setState({
      items: await this.storageClient.getItems(),
    });
  }

  render() {
    const context = getContext({
      baseFontSize: 16,
      style: ThemeStyle.Light
    });

    const items = this.state.items?.map((item, index) =>
      <div key={item.id} className="item">
        <div className="is-completed">
          <Checkbox
            checked={this.state.items[index].isCompleted}
            onChecked={(checked) => this.onCompletionStatusChange(item.id, index, checked)}
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
        <div className="action">
          <Dropdown
            mainButtonText="..."
            items={[
              {
                text: 'Delete',
                onClick: () => this.onDeleteItem(item.id)
              }
            ]}
            className="action-dropdown"
          />
        </div>
      </div>
    );

    return (
      <TeamsThemeContext.Provider value={context}>
        {!this.state.showLoginPage && <div className="flex-container">
          <div className="profile-col">
            <Profile userInfo={this.state.userInfo} profile={this.state.profile} photoObjectURL={this.state.photoObjectURL} />
          </div>

          <div className="todo-col">
            <div className="todo">
              <div className="header">
                <div className="title">
                  <h2>To Do List</h2>
                  <span>{this.state.items.length} item{this.state.items.length === 1 ? "" : "s"}</span>
                </div>

                <div className="add-button">
                  <PrimaryButton onClick={() => this.setState({ isAddingItem: true })}>+ Add task</PrimaryButton>
                </div>
              </div>

              {items}

              {this.state.isAddingItem && <div className="item add">
                <div className="is-completed">
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
                <div className="action">
                  <Dropdown
                    mainButtonText="..."
                    disabled
                    items={[]}
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

        {this.state.showLoginPage && <div className="auth">
          <Profile userInfo={this.state.userInfo} profile={this.state.profile} photoObjectURL={this.state.photoObjectURL} />
          <h2>Welcome to To Do List App!</h2>
          <PrimaryButton onClick={() => this.loginBtnClick()}>Start</PrimaryButton>
        </div>}
      </TeamsThemeContext.Provider>
    );
  }
}
export default Tab;

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { AadHttpClient } from '@microsoft/sp-http';
import { ITodoListProps } from './ITodoListProps';
import { ISPItem, ITodoListState } from './ITodoListState';
import { SharePointListManager } from './SharePointListManager';
import { Checkbox, ContextualMenu, PrimaryButton, TextField, DirectionalHint, DefaultButton } from 'office-ui-fabric-react';
import Profile from './Profile';
import './TodoList.module.css';

export default class TodoList extends React.Component<ITodoListProps, ITodoListState> {
  private sharePointListManager: SharePointListManager;

  constructor(props: ITodoListProps) {
    super(props);

    // Initialize the state of the component
    this.state = {
      selectItemID: -1,    // unique select item id passing to delete function in ContextualMenu.
      isAddingItem: false, // if user is adding item.
      photoObjectURL: '',  // user photo icon url
      userPhoneNumber: '', // user photo description
      items: [],           // contains SharePoint List items
      newItemDescription: '', // user input text
      siteURL: this.props.context.pageContext.web.absoluteUrl, // the absolute url for your sharepoint website.
    };

    // Initialize SharePoint List Manager
    this.sharePointListManager = new SharePointListManager(this.props.context);
  }

  private async getUserData() {
    // Call Microsoft Graph API to get user photo and user profile with the SharePoint context
    const graphclient: AadHttpClient = await this.props.context.aadHttpClientFactory.getClient('https://graph.microsoft.com');
    if (graphclient) {
      try {
        const photoResponse = await graphclient.get("https://graph.microsoft.com/v1.0/me/photo/$value", AadHttpClient.configurations.v1);
        if (photoResponse.ok) {
          const responsedata = await photoResponse.blob();
          const photoURL = URL.createObjectURL(responsedata);
          this.setState({
            photoObjectURL: photoURL,
          });
        }
      } catch (error) {
      }

      const response = await graphclient.get("https://graph.microsoft.com/v1.0/me", AadHttpClient.configurations.v1);
      if (response.ok) {
        const responsedata = await response.json();
        this.setState({
          userPhoneNumber: responsedata.mobilePhone,
        });
      }
      else {
        alert(await response.text());
      }
    } else {
      alert('Could not get client');
    }
  }

  private async getItems() {
    let items: ISPItem[] = await this.sharePointListManager.getItems();
    this.setState({
      items,
    });
  }

  public async componentDidMount() {
    // Get user photo and get to-do list items after the component is mounted.
    Promise.all([this.getUserData(), this.getItems()]);
  }

  private handleInputChange(index: number, property: string, value: string | boolean) {
    const tmp = JSON.parse(JSON.stringify(this.state.items));
    tmp[index][property] = value;
    this.setState({
      items: tmp,
    });
  }

  private async onDeleteItem(id: number) {
    await this.sharePointListManager.DeleteItem(id);
    this.getItems();
  }

  private async onAddItem() {
    await this.sharePointListManager.AddItem(this.state.newItemDescription);
    this.setState({
      newItemDescription: '',
    });
    this.getItems();
  }

  private async onCompletionStatusChange(id: number, index: number, isCompleted: boolean) {
    // Change the "isCompleted" status on page and update it to the Sharepoint List database
    this.handleInputChange(index, 'isCompleted', isCompleted);
    await this.sharePointListManager.updateSPItem(id, { isCompleted: isCompleted });
  }

  private async onUpdateItem(id: number, description: string) {
    // Update the SharePoint database according to the user input.
    await this.sharePointListManager.updateSPItem(id, { description: description });
  }

  public render(): React.ReactElement<ITodoListProps> {
    const items = this.state.items.map((item, index) =>
      <div key={item.Id} className="item">
          <div className="is-completed">
          <Checkbox
            checked={this.state.items[index].isCompleted}
            onChange={(e, selectedOption) => {
              this.onCompletionStatusChange(item.Id, index, selectedOption);
            }}
            className="is-completed-input"
          />
        </div>
        <div className="description">
          <TextField
            value={this.state.items[index].description}
            onChange={(e, v) => this.handleInputChange(index, "description", v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                this.onUpdateItem(item.Id, this.state.items[index].description);
                (e.target as HTMLInputElement).blur();
              }
            }}
            onBlur={() => this.onUpdateItem(item.Id, this.state.items[index].description)}
            className={"text" + (this.state.items[index].isCompleted ? " is-completed" : "")}
          />
        </div>
        <div className="action">
          <DefaultButton onClick={(event) => {
            this.setState({ target: { x: event.clientX, y: event.clientY }, selectItemID: item.Id });
          }}
          > ... </DefaultButton>
          {this.state.selectItemID >= 0 &&
            <ContextualMenu
              shouldFocusOnMount={true}
              target={this.state.target}
              directionalHint={DirectionalHint.bottomLeftEdge}
              items={[
                {
                  key: 'Delete',
                  icon: 'Delete',
                  name: 'Delete',
                  onClick: () => {
                    this.onDeleteItem(this.state.selectItemID);
                    this.setState({ selectItemID: -1 });
                  },
                  onBlur: () => this.setState({ selectItemID: -1 })
                },
              ]}
              className="action-ContextualMenu"
            />}
        </div>
      </div>
    );

    return (
      <div className="flex-container">
        <div className="profile-col">
          <Profile
            userName={this.props.context.pageContext.user.displayName}
            userEmail={this.props.context.pageContext.user.email}
            userPhoneNumber={this.state.userPhoneNumber}
            photoObjectURL={this.state.photoObjectURL}
          />
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
                <TextField
                  autoFocus
                  type="text"
                  value={this.state.newItemDescription}
                  onChange={(e, v) => this.setState({ newItemDescription: v })}
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
                <DefaultButton disabled> ... </DefaultButton>
              </div>
            </div>}

            {!this.state.items.length && !this.state.isAddingItem && <div className="no-item">
              <div>
                <img src={require('../images/no-item.png')} alt="no item" />
              </div>
              <div>
                <h2>No tasks</h2>
                <p>Add more tasks to make you day productive.</p>
              </div>
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

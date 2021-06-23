// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
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
      items: [],           // contains SharePoint List items
      newItemDescription: '', // user input text
      siteURL: this.props.context.pageContext.web.absoluteUrl, // the absolute url for your sharepoint website.
    };

    // Initialize SharePoint List Manager
    this.sharePointListManager = new SharePointListManager(this.props.context);
  }

  private async getItems() {
    let items: ISPItem[] = await this.sharePointListManager.getItems();
    this.setState({
      items,
    });
  }

  public async componentDidMount() {
    // Get user photo and get to-do list items after the component is mounted.
    Promise.all([this.getItems()]);
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
                (e.target as HTMLInputElement).blur();
                this.onUpdateItem(item.Id, this.state.items[index].description);
              }
            }}
            onBlur={() => this.onUpdateItem(item.Id, this.state.items[index].description)}
            className={"text" + (this.state.items[index].isCompleted ? " is-completed" : "")}
          />
        </div>
        <Profile
          photoObjectURL={this.state.items[index].photoObjectURL}
          userName={this.state.items[index].userDisplayName}
        />
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

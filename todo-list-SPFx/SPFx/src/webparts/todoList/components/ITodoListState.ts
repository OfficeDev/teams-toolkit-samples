// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export interface ISPItem {
  Id: number;
  description: string;
  isCompleted: boolean;
}

export interface ITodoListState {
    selectItemID: number;
    selection?: { [ key: string]: boolean };
    target?: {x: number, y: number};
    isAddingItem: boolean;
    siteURL: string;
    photoObjectURL: string;
    userDisplayName: string;
    items: ISPItem[];
    newItemDescription: string;
  }

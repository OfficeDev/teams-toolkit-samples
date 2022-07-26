// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  HttpClientResponse,
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ISPItem } from "./ITodoListState";

export class SharePointListManager {
  private _spContext: WebPartContext;
  private _siteURL: string;
  private _listname: string = "To%20Do%20List";
  private _previousUpdateItem = null;
  private _previousUpdateId: number = -1;
  private _UserInfoMap: Map<number, string[]> = new Map();

  public constructor(spContext: WebPartContext) {
    this._spContext = spContext;
    this._siteURL = spContext.pageContext.web.absoluteUrl;
  }

  public static async processResponseError(response: HttpClientResponse): Promise<void> {
    const resdata = await response.json();
    if (resdata.error?.message) {
      alert(resdata.error?.message);
    } else {
      alert(await response.text());
    }
  }

  private async _getUserInfo(authorId: number): Promise<string[]> {
    if (this._UserInfoMap.has(authorId)) {
      return this._UserInfoMap.get(authorId);
    }
    const userinfo: SPHttpClientResponse =
      await this._spContext.spHttpClient.get(
        `${this._siteURL}/_api/web/GetUserById(` + authorId.toString() + `)`,
        SPHttpClient.configurations.v1
      );

    if (userinfo.ok) {
      const userinfojson = await userinfo.json();
      const username: string = userinfojson.UserPrincipalName;
      const userDisplayName: string = userinfojson.Title;
      const photoObjectURL: string = `${this._siteURL}/_layouts/15/userphoto.aspx?size=S&username=${username}`;
      this._UserInfoMap.set(authorId, [userDisplayName, photoObjectURL]);

      return this._UserInfoMap.get(authorId);
    } else {
      SharePointListManager.processResponseError(userinfo);
    }
  }
  /**
   * Returns SharePoint list items with REST.
   *
   * @returns the item list containing three columns/members:id, description and isCompleted flag.
   *
   */
  public async getItems(): Promise<ISPItem[]> {
    const response: SPHttpClientResponse =
      await this._spContext.spHttpClient.get(
        `${this._siteURL}/_api/web/lists/GetByTitle('${this._listname}')/Items`,
        SPHttpClient.configurations.v1
      );

    if (response.ok) {
      const responsejson = await response.json();
      const items: ISPItem[] = responsejson.value;
      for (const item of items) {
        const AuthorId: number = item.AuthorId;

        const userinfo: string[] = await this._getUserInfo(AuthorId);
        item.userDisplayName = userinfo[0];
        item.photoObjectURL = userinfo[1];
      }

      return items;
    } else {
      SharePointListManager.processResponseError(response);
    }
  }

  /**
   * Update SharePoint list item with REST.
   *
   * @param id the unique id of item(automatically assigned by SharePoint list).
   * @param item the object({columnname:columnvalue}) that need to be updated.
   *
   */
  public async updateSPItem(id: number, item: any): Promise<void> {
    // If the update one is the same as previous, just return to prevent duplicate call
    if (
      this._previousUpdateId === id &&
      this._previousUpdateItem?.description === item.description
    ) {
      return;
    }
    this._previousUpdateId = id;
    this._previousUpdateItem = item;
    const options: ISPHttpClientOptions = {
      body: JSON.stringify(item),
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "X-HTTP-Method": "MERGE",
        "IF-MATCH": "*",
      },
    };
    const response: SPHttpClientResponse =
      await this._spContext.spHttpClient.post(
        `${this._siteURL}/_api/web/lists/GetByTitle('${this._listname}')/Items(${id})`,
        SPHttpClient.configurations.v1,
        options
      );

    if (response.ok) {
      console.log(`Update Succeed for item${id}`);
    } else {
      SharePointListManager.processResponseError(response);
    }
  }

  /**
   * Insert a SharePoint list item with REST
   *
   * @param description the description of the new item that need to be added.
   *
   */
  public async AddItem(description: string): Promise<void> {
    const options: ISPHttpClientOptions = {
      body: JSON.stringify({ description: description, isCompleted: false }),
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
    };
    const response: SPHttpClientResponse =
      await this._spContext.spHttpClient.post(
        `${this._siteURL}/_api/web/lists/GetByTitle('${this._listname}')/Items`,
        SPHttpClient.configurations.v1,
        options
      );

    if (response.ok) {
      console.log(`Insertion Succeed for item:${description}`);
    } else {
      SharePointListManager.processResponseError(response);
    }
  }

  /**
   * Delete a SharePoint list item with REST
   *
   * @param id the unique id of item(automatically assigned by SharePoint list).
   *
   */
  public async DeleteItem(id: number): Promise<void> {
    const options: ISPHttpClientOptions = {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "X-HTTP-Method": "DELETE",
        "IF-MATCH": "*",
      },
    };
    const response: SPHttpClientResponse =
      await this._spContext.spHttpClient.post(
        `${this._siteURL}/_api/web/lists/GetByTitle('${this._listname}')/Items(${id})`,
        SPHttpClient.configurations.v1,
        options
      );

    if (response.ok) {
      console.log(`Deletion Succeed for item${id}`);
    } else {
      SharePointListManager.processResponseError(response);
    }
  }
}

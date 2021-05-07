// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    SPHttpClient,
    SPHttpClientResponse,
    ISPHttpClientOptions,
  } from '@microsoft/sp-http';

import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISPItem } from './ITodoListState';

export class SharePointListManager{
    private spContext: WebPartContext;
    private siteURL: string;
    private listname:string = "To%20Do%20List";

    constructor(spContext: WebPartContext) {
        this.spContext = spContext;
        this.siteURL = spContext.pageContext.web.absoluteUrl;
    }

    /**
     * Returns SharePoint list items with REST.
     *
     * @returns the item list containing three columns/members:id, description and isCompleted flag.
     *
     */
    public async getItems(): Promise<ISPItem[]> {
        const response: SPHttpClientResponse = await this.spContext.spHttpClient.get(
          `${this.siteURL}/_api/web/lists/GetByTitle('${this.listname}')/Items`,
          SPHttpClient.configurations.v1,
        );
    
        if (response.ok) {
          const responsejson = await response.json();
          const items: ISPItem[] = responsejson.value;
          return items;
        } else {
          alert(await response.text());
        }
    }

    /**
     * Update SharePoint list item with REST.
     *
     * @param id the unique id of item(automatically assigned by SharePoint list).
     * @param item the object({columnname:columnvalue}) that need to be updated.
     *
     */
    public async updateSPItem(id: number, item: object) {
        const options: ISPHttpClientOptions = {
          body: JSON.stringify(item),
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'X-HTTP-Method': 'MERGE',
            'IF-MATCH': '*',
          },
        };
        const response: SPHttpClientResponse = await this.spContext.spHttpClient.post(
          `${this.siteURL}/_api/web/lists/GetByTitle('${this.listname}')/Items(${id})`,
          SPHttpClient.configurations.v1,
          options,
        );
    
        if (response.ok) {
          console.log(`Update Succeed for item${id}`);
        } else {
          alert(await response.text());
        }
    }

    /**
     * Insert a SharePoint list item with REST
     *
     * @param description the description of the new item that need to be added.
     *
     */
    public async AddItem(description: string) {
        const options: ISPHttpClientOptions = {
          body: JSON.stringify({ description: description }),
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
        };
        const response: SPHttpClientResponse = await this.spContext.spHttpClient.post(
          `${this.siteURL}/_api/web/lists/GetByTitle('${this.listname}')/Items`,
          SPHttpClient.configurations.v1,
          options,
        );
    
        if (response.ok) {
          console.log(`Insertion Succeed for item:${description}`);
        } else {
          alert(await response.text());
        }
    }

    /**
     * Delete a SharePoint list item with REST
     *
     * @param id the unique id of item(automatically assigned by SharePoint list).
     *
     */
    public async DeleteItem(id: number) {
        const options: ISPHttpClientOptions = {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'X-HTTP-Method': 'DELETE',
            'IF-MATCH': '*',
          },
        };
        const response: SPHttpClientResponse = await this.spContext.spHttpClient.post(
          `${this.siteURL}/_api/web/lists/GetByTitle('${this.listname}')/Items(${id})`,
          SPHttpClient.configurations.v1,
          options,
        );
    
        if (response.ok) {
          console.log(`Deletion Succeed for item${id}`);
        } else {
          alert(await response.text());
        }
      }
}
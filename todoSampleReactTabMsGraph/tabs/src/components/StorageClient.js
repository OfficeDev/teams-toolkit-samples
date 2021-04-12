// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const siteId = "";
const listId = "";

export class StorageClient {
    constructor(graphClient) {
        this.graphClient = graphClient
    }

    /**
     * Retrieve Sharepoint list items
     * 
     * @return array of To-do list items
     */
    async getItems() {
        return (await this.graphClient.api(`/sites/${siteId}/lists/${listId}/items?expand=fields`).get()).value.map(item => item.fields);
    }

    /**
     * Insert a Sharepoint list item
     * 
     * @param {string} description 
     */
    async addItem(description) {
        await this.graphClient.api(`/sites/${siteId}/lists/${listId}/items`).post({
            fields: {
                description: description
            }
        });
    }

    /**
     * Update description of Sharepoint list item
     * 
     * @param {number} id 
     * @param {string} description 
     */
    async updateItemDescription(id, description) {
        await this.graphClient.api(`/sites/${siteId}/lists/${listId}/items/${id}/fields`).patch({
            description: description
        });
    }

    /**
     * Delete Sharepoint list item
     * 
     * @param {number} id 
     */
    async deleteItem(id) {
        await this.graphClient.api(`/sites/${siteId}/lists/${listId}/items/${id}`).delete();
    }

    /**
     * Update completion status of Sharepoint list item
     *  
     * @param {number} id 
     * @param {boolean} isCompleted 
     */
    async updateItemCompletionStatus(id, isCompleted) {
        await this.graphClient.api(`/sites/${siteId}/lists/${listId}/items/${id}/fields`).patch({
            isCompleted: isCompleted
        });
    }
}

import { ConversationReference } from "botbuilder";

import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";
import {
  ConversationReferenceStore,
  ConversationReferenceStoreAddOptions,
  PagedData,
} from "@microsoft/teamsfx";

import {
  constructConversationReference,
  extractKeyDataFromConversationReference,
} from "../util";

export class TableStore implements ConversationReferenceStore {
  private readonly client: TableClient;

  constructor(
    storageAccountName: string,
    storageAccountURL: string,
    storageAccountKey: string,
    storageTableName: string
  ) {
    const sharedKeyCredential = new AzureNamedKeyCredential(
      storageAccountName,
      storageAccountKey
    );

    this.client = new TableClient(
      `${storageAccountURL}`,
      `${storageTableName}`,
      sharedKeyCredential,
      { allowInsecureConnection: true }
    );
  }

  public async add(
    key: string,
    reference: Partial<ConversationReference>,
    options: ConversationReferenceStoreAddOptions
  ): Promise<boolean> {
    /*
     * {
     *   "activityId":"f:4c06e7be-31d2-27d3-2c3f-e2c2ff775e0a",
     *   "user":{
     *     "id":"29:xxx",
     *     "aadObjectId":"xxx"
     *   },
     *   "bot":{
     *     "id":"28:xxx",
     *     "name":"notification-scale-demo"
     *   },
     *   "conversation":{
     *     "conversationType":"personal",
     *     "tenantId":"xxx",
     *     "id":"xxx"
     *   },
     *   "channelId":"msteams",
     *   "serviceUrl":"https://smba.trafficmanager.net/amer/"
     * }
     */
    const task = {
      partitionKey: this.hash(key),
      rowKey: key,
      ...extractKeyDataFromConversationReference(reference),
    };
    try {
      await this.client.createEntity(task);
      return true;
    } catch (e: unknown) {
      return false;
    }
  }

  public async remove(
    key: string,
    reference: Partial<ConversationReference>
  ): Promise<boolean> {
    try {
      await this.client.deleteEntity(this.hash(key), key);
      return true;
    } catch (e: unknown) {
      return false;
    }
  }

  public async list(
    pageSize?: number,
    continuationToken?: string
  ): Promise<PagedData<Partial<ConversationReference>>> {
    const entities = await this.client
      .listEntities()
      .byPage({ maxPageSize: pageSize, continuationToken: continuationToken })
      .next();

    return {
      data: entities.value.map((entity) => {
        return constructConversationReference(entity);
      }),
      continuationToken: entities.value.continuationToken,
    };
  }

  private hash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return (
      (hash & 0xff).toString(16).padStart(2, "0") +
      ((hash >> 8) & 0xff).toString(16).padStart(2, "0")
    );
  }
}

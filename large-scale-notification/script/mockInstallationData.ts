import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";

export const storageAccount = "<STORAGE_ACCOUNT>";
export const storageAccountKey = "<STORAGE_ACCOUNT_KEY>";
export const storageTableName = "<INSTALLATION_TABLE>";
const installationMockTableName = "<MOCKED_INSTALLATION_TABLE>";

async function copy() {
  const sharedKeyCredential = new AzureNamedKeyCredential(
    storageAccount,
    storageAccountKey
  );

  const originInstallationTableClient = new TableClient(
    `https://${storageAccount}.table.core.windows.net`,
    `${storageTableName}`,
    sharedKeyCredential
  );

  const mockInstallationTableClient = new TableClient(
    `https://${storageAccount}.table.core.windows.net`,
    `${installationMockTableName}`,
    sharedKeyCredential
  );

  const pages = await originInstallationTableClient
    .listEntities({
      queryOptions: {
        select: [
          "userId",
          "conversationType",
          "conversationId",
          "tenantId",
          "serviceUrl",
        ],
      },
    })
    .byPage({ maxPageSize: 1000 })
    .next();

  for (let i = 0; i < 30; i++) {
    console.log(`Generating # ${i}k messages`);
    for (let j = 0; j < 10; j++) {
      const tableActions: any = [];
      for (let k = 0; k < 100; k++) {
        const task = {
          partitionKey: i.toString().padStart(2, "0"),
          rowKey: (j * 100 + k).toString().padStart(4, "0"),
          userId: pages.value[j * 100 + k].userId,
          conversationType: pages.value[j * 100 + k].conversationType,
          conversationId: pages.value[j * 100 + k].conversationId,
          tenantId: pages.value[j * 100 + k].tenantId,
          serviceUrl: pages.value[j * 100 + k].serviceUrl,
        };
        tableActions.push(["upsert", task]);
      }
      await mockInstallationTableClient.submitTransaction(tableActions);
    }
  }
}

copy();

import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";

export const storageAccount = "<STORAGE_ACCOUNT>";
export const storageAccountKey = "<STORAGE_ACCOUNT_KEY>";
const storageTableName = "installation";
const installationMockTableName = "installationmock";

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

  // Usually at most 25 users in Microsoft 365 E3/E5 subscription in a tenant, so pageLength is 25.
  const pageLength = pages.value.length;
  // Iterate 40 times, so 1K user installations are generated.
  const iterationTime = 1000 / pageLength;

  // Mock 30K user installations.
  for (let i = 0; i < 30; i++) {
    console.log(`Generating # ${i}k messages`);
    for (let j = 0; j < iterationTime; j++) {
      const tableActions: any = [];
      for (let k = 0; k < pageLength; k++) {
        const task = {
          partitionKey: i.toString().padStart(2, "0"),
          rowKey: (j * pageLength + k).toString().padStart(4, "0"),
          userId: pages.value[k].userId,
          conversationType: pages.value[k].conversationType,
          conversationId: pages.value[k].conversationId,
          tenantId: pages.value[k].tenantId,
          serviceUrl: pages.value[k].serviceUrl,
        };
        tableActions.push(["upsert", task]);
      }

      // An entity group transaction can contain at most 100 entities.
      await mockInstallationTableClient.submitTransaction(tableActions);
    }
  }
}

copy();

import {
  TableServiceClient,
  AzureNamedKeyCredential,
} from "@azure/data-tables";

// Well-known storage account and key used by the legacy Azure Storage Emulator and Azurite
const account = "devstoreaccount1";
const accountKey =
  "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";

const credential = new AzureNamedKeyCredential(account, accountKey);
const tableServiceClient = new TableServiceClient(
  "http://127.0.0.1:10002/devstoreaccount1",
  credential,
  { allowInsecureConnection: true }
);

const tableName = "localtable";

async function main() {
  await tableServiceClient.createTable(tableName, {
    onResponse: (response) => {
      if (response.status === 409) {
        console.log(`Table ${tableName} already exists`);
      }
    },
  });
}

main();

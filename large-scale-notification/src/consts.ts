export const serviceBusNamespace = process.env.SERVICE_BUS_NAMESPACE;
export const serviceBusMessageQueueName = process.env.SERVICE_BUS_QUEUE_NAME;

export const storageAccountName = process.env.STORAGE_ACCOUNT_NAME;
export const storageTableName = process.env.INSTALLATION_TABLE_NAME;
export const installationMockTableName =
  process.env.INSTALLATION_MOCK_TABLE_NAME;

export const managedIdentityId = process.env.MANAGED_IDENTITY_ID;

// Sending speed of notification message
export const RPS = 50;
// Time(second) to wait before sending the next batch of messages to queue
export const batchSendingInterval = 1;
// Paginated result size when querying from table storage
export const maxPageSize = 500;
export const iterateTime = 3;

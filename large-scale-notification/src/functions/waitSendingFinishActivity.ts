/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 *
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */
import * as df from "durable-functions";
import { ActivityHandler } from "durable-functions";

import { DefaultAzureCredential } from "@azure/identity";
import { InvocationContext } from "@azure/functions";
import { ServiceBusAdministrationClient } from "@azure/service-bus";

import {
  managedIdentityId,
  serviceBusMessageQueueName,
  serviceBusNamespace,
} from "../consts";
import { SendStatus } from "../types/sendStatus";

const waitSendingFinishActivity: ActivityHandler = async (
  triggerInput: any,
  context: InvocationContext
): Promise<SendStatus> => {
  const credential = new DefaultAzureCredential({
    managedIdentityClientId: managedIdentityId,
  });
  const input = triggerInput as SendStatus;
  const sbAdminClient = new ServiceBusAdministrationClient(
    `${serviceBusNamespace}.servicebus.windows.net`,
    credential
  );
  let runtimeProperties = await sbAdminClient.getQueueRuntimeProperties(
    serviceBusMessageQueueName
  );
  context.warn(`[waitSendingFinishActivity] checking.`);
  while (runtimeProperties.activeMessageCount > 0) {
    context.warn(
      `[waitSendingFinishActivity] active messages: ${runtimeProperties.activeMessageCount}`
    );
    await new Promise((r) => setTimeout(r, 5000));
    runtimeProperties = await sbAdminClient.getQueueRuntimeProperties(
      serviceBusMessageQueueName
    );
  }
  input.failedMessageCount =
    runtimeProperties.deadLetterMessageCount - input.initDeadLetterMessageCount;
  input.sentMessageCount = input.totalMessageCount - input.failedMessageCount;
  return input;
};

df.app.activity("waitSendingFinish", {
  handler: waitSendingFinishActivity,
});

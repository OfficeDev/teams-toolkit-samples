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

import { AzureFunction, Context } from "@azure/functions";
import { ServiceBusAdministrationClient } from "@azure/service-bus";

import {
  serviceBusMessageQueueName,
  serviceBusQueueConnectionString,
} from "../consts";
import { SendStatus } from "../types/sendStatus";

const waitSendingFinishActivity: AzureFunction = async function (
  context: Context
): Promise<SendStatus> {
  const input = context.bindings.input as SendStatus;
  const sbAdminClient = new ServiceBusAdministrationClient(
    serviceBusQueueConnectionString
  );
  let runtimeProperties = await sbAdminClient.getQueueRuntimeProperties(
    serviceBusMessageQueueName
  );
  context.log.warn(`[waitSendingFinishActivity] checking.`);
  while (runtimeProperties.activeMessageCount > 0) {
    context.log.warn(
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

export default waitSendingFinishActivity;

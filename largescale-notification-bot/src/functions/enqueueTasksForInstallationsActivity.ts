/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 */

import { chunk } from "lodash";
import { DateTime } from "luxon";

import { AzureFunction, Context } from "@azure/functions";
import {
  ServiceBusAdministrationClient,
  ServiceBusClient,
} from "@azure/service-bus";
import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";

import {
  batchSendingInterval,
  iterateTime,
  maxPageSize,
  RPS,
  serviceBusMessageQueueName,
  serviceBusQueueConnectionString,
} from "../consts";
import { notificationApp } from "../internal/initialize";
import { SendStatus } from "../types/sendStatus";
import { extractKeyDataFromConversationReference } from "../util";

const enqueueTasksForInstallationsActivity: AzureFunction = async function (
  context: Context
): Promise<{ sendStatus: SendStatus; continuationToken: string }> {
  const input = context.bindings.input as {
    continuationToken: string;
    sendStatus: SendStatus;
  };
  let token = input.continuationToken;
  let installations: BotBuilderCloudAdapter.TeamsBotInstallation[] = [];
  let lastSendTime: Date = undefined;
  let newStatus = { ...input.sendStatus };
  for (let iter = 0; iter < iterateTime; iter++) {
    context.log.warn(
      `${new Date().toISOString()} #${iter} [enqueueTasksForInstallationsActivity] continue ${token}`
    );
    const installationResult =
      await notificationApp.notification.getPagedInstallations(
        maxPageSize,
        token,
        false
      );
    installations = installationResult.data;
    token = installationResult.continuationToken;

    if (installations.length === 0) {
      break;
    }

    context.log.warn(
      `${new Date().toISOString()} #${iter} [enqueueTasksForInstallationsActivity] found ${
        installations.length
      } installations`
    );
    newStatus.totalMessageCount += installations.length;

    const sbClient = new ServiceBusClient(serviceBusQueueConnectionString);
    const sender = sbClient.createSender(serviceBusMessageQueueName);
    const chunks = chunk(installations, RPS * batchSendingInterval);
    for (const chunk of chunks) {
      const batch = await sender.createMessageBatch();
      for (const conversation of chunk) {
        const messageBody = JSON.stringify(
          extractKeyDataFromConversationReference(
            conversation.conversationReference
          )
        );
        if (!batch.tryAddMessage({ body: messageBody })) {
          // if it can't be added to the batch, the message is probably too big to fit in a batch
          throw new Error("Message too big to fit in a batch");
        }
      }

      if (lastSendTime) {
        const nextEnqueueTime = DateTime.fromJSDate(lastSendTime, {
          zone: "utc",
        })
          .plus({ second: batchSendingInterval })
          .toJSDate();
        context.log.warn(
          `[enqueueTasksForInstallationsActivity] ${new Date().toISOString()} next enqueue time ${nextEnqueueTime.toISOString()}`
        );
        if (nextEnqueueTime > new Date()) {
          const waitMs = nextEnqueueTime.getTime() - new Date().getTime();
          context.log.warn(
            `[enqueueTasksForInstallationsActivity] wait to ${nextEnqueueTime.toISOString()}, ${waitMs} ms`
          );
          await new Promise((r) => setTimeout(r, waitMs));
        }
      }

      lastSendTime = new Date();
      context.log.warn(
        `[enqueueTasksForInstallationsActivity] ${lastSendTime.toISOString()} sending ${
          chunk[0].conversationReference.user.id
        }`
      );
      await sender.sendMessages(batch);
      context.log.warn(
        `[enqueueTasksForInstallationsActivity] sent task to queue ${
          chunk[0].conversationReference.user.id
        }, cost ${new Date().getTime() - lastSendTime.getTime()} ms}`
      );
    }

    if (token === undefined) {
      break;
    }
  }
  const sbAdminClient = new ServiceBusAdministrationClient(
    serviceBusQueueConnectionString
  );
  const runtimeProperties = await sbAdminClient.getQueueRuntimeProperties(
    serviceBusMessageQueueName
  );
  context.log.warn(
    `[enqueueTasksForInstallationsActivity] active messages: ${runtimeProperties.activeMessageCount}`
  );
  newStatus.sentMessageCount =
    newStatus.totalMessageCount - runtimeProperties.activeMessageCount;
  newStatus.failedMessageCount =
    runtimeProperties.deadLetterMessageCount -
    input.sendStatus.initDeadLetterMessageCount;
  return { continuationToken: token, sendStatus: newStatus };
};

export default enqueueTasksForInstallationsActivity;

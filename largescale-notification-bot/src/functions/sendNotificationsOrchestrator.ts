/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 */

import * as df from "durable-functions";

import { SendStatus } from "../types/sendStatus";

const sendNotificationsOrchestrator = df.orchestrator(function* (context) {
  const input = context.df.getInput() as {
    startTime: string;
    initDeadLetterMessageCount: number;
  };
  const startTime = new Date(input.startTime);

  let continuationToken: string = undefined;
  let sendStatus: SendStatus = {
    sentMessageCount: 0,
    failedMessageCount: 0,
    totalMessageCount: 0,
    initDeadLetterMessageCount: input.initDeadLetterMessageCount ?? 0,
  };
  do {
    try {
      const firstRetryIntervalInMilliseconds = 1000;
      const maxNumberOfAttempts = 3;
      const retryOptions = new df.RetryOptions(
        firstRetryIntervalInMilliseconds,
        maxNumberOfAttempts
      );

      const result = yield context.df.callActivityWithRetry(
        "enqueueTasksForInstallations",
        retryOptions,
        { continuationToken, sendStatus }
      );
      sendStatus = result.sendStatus;
      continuationToken = result.continuationToken;
      context.df.setCustomStatus(sendStatus);
    } catch (err) {
      throw new Error("Failed at callActivity: " + err);
    }
  } while (continuationToken !== undefined);

  sendStatus = yield context.df.callActivity("waitSendingFinish", sendStatus);
  context.log.warn("[sendNotificationsOrchestrator] finish");
  context.df.setCustomStatus(undefined);
  return {
    duration:
      (context.df.currentUtcDateTime.getTime() - startTime.getTime()) / 1000,
    ...sendStatus,
  };
});

export default sendNotificationsOrchestrator;

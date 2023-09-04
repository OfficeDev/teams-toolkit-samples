import * as df from "durable-functions";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ServiceBusAdministrationClient } from "@azure/service-bus";
import {
  serviceBusMessageQueueName,
  serviceBusQueueConnectionString,
} from "../consts";

const httpStart: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  const client = df.getClient(context);
  const sbAdminClient = new ServiceBusAdministrationClient(
    serviceBusQueueConnectionString
  );
  let queueRuntimeProperties = await sbAdminClient.getQueueRuntimeProperties(
    serviceBusMessageQueueName
  );
  const instanceId = await client.startNew("sendNotifications", undefined, {
    startTime: new Date(),
    initDeadLetterMessageCount: queueRuntimeProperties.deadLetterMessageCount,
  });

  context.log(`Started orchestration with ID = '${instanceId}'.`);

  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};

export default httpStart;

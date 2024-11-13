import * as df from "durable-functions";
import { DefaultAzureCredential } from "@azure/identity";
import {
  app,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  InvocationContext,
} from "@azure/functions";
import { ServiceBusAdministrationClient } from "@azure/service-bus";
import {
  managedIdentityId,
  serviceBusMessageQueueName,
  serviceBusNamespace,
} from "../consts";

const durableHttpStart: HttpHandler = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponse> => {
  const client = df.getClient(context);
  const credential = new DefaultAzureCredential({
    managedIdentityClientId: managedIdentityId,
  });
  const sbAdminClient = new ServiceBusAdministrationClient(
    `${serviceBusNamespace}.servicebus.windows.net`,
    credential
  );
  let queueRuntimeProperties = await sbAdminClient.getQueueRuntimeProperties(
    serviceBusMessageQueueName
  );
  const instanceId = await client.startNew("sendNotifications", {
    instanceId: undefined,
    input: {
      startTime: new Date(),
      initDeadLetterMessageCount: queueRuntimeProperties.deadLetterMessageCount,
    },
  });

  context.log(`Started orchestration with ID = '{instanceId}'.`);

  return client.createCheckStatusResponse(request, instanceId);
};

app.http("notification", {
  extraInputs: [df.input.durableClient()],
  handler: durableHttpStart,
});

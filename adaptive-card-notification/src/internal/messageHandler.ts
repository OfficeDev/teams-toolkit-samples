import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { notificationApp } from "./initialize";
import { ResponseWrapper } from "./responseWrapper";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  const res = new ResponseWrapper(context.res);
  await notificationApp.requestHandler(req, res);
  return res.body;
};

export default httpTrigger;

import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { notificationApp } from "../internal/initialize";
import { Request, Response } from "botbuilder";

export async function messages(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const res: HttpResponseInit = { status: 200 };
  const response = {
    end: () => {},
    header: (name: string, value: unknown) => {
      res.headers = res.headers || {};
      res.headers[name] = value;
    },
    send: (body: unknown) => {
      res.body = body as string;
    },
    status: (code) => {
      res.status = code;
    },
    socket: {},
  } as Response;
  await notificationApp.requestHandler(await requestAdaptor(request), response);
  return res;
}

async function requestAdaptor(request: HttpRequest): Promise<Request> {
  return {
    body: (await request.json()) as any,
    headers: (await Promise.all(request.headers.entries())).reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {}
    ),
    method: request.method,
  };
}

app.http("messages", { handler: messages });

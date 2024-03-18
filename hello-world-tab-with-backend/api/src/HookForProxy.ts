/* This file is used for debugging with proxy. 
 * It only takes effect when the environment HOOK_FOR_PROXY is set. In VSCode, try it by launching the debug option "Debug in Teams with proxy (Edge)".
 * It will leverage a proxy to send all https request to 127.0.0.1:54000(the devproxy listening address) to mock the graph API responses.(devproxy will provide the mocking responses) 
 */

import { AuthenticationProvider, Client } from "@microsoft/microsoft-graph-client";
import { HttpsProxyAgent } from "hpagent";
import fetch from "node-fetch";

export function shouldHookForProxy(): boolean {
  return process.env.HOOK_FOR_PROXY === "true";
}

if (shouldHookForProxy()) {
  global["fetch"] = fetch as any;
  const agent = new HttpsProxyAgent({
    proxy: 'http://127.0.0.1:54000', // replace with custom proxy port if needed
    rejectUnauthorized: false,
  });

  // replace the default auth provider with a custom mocked one in graph client, 
  // so that we can handle application auth as well as obo auth
  class AuthenticationProviderImpl implements AuthenticationProvider {
    private accessToken = "mocked token";
    public async getAccessToken(): Promise<string> {
      return this.accessToken;
    }
  }
  const oldInitWithMiddleware = Client.initWithMiddleware;
  Client.initWithMiddleware = (options: any) => {
    options.authProvider = new AuthenticationProviderImpl();
    options.fetchOptions = options.fetchOptions ?? {}
    options.fetchOptions.agent = agent;
    return oldInitWithMiddleware(options);
  };

  const oldInit = Client.init;
  Client.init = (options: any) => {
    options.authProvider = new AuthenticationProviderImpl();
    options.fetchOptions = options.fetchOptions ?? {}
    options.fetchOptions.agent = agent;
    return oldInit(options);
  };
}

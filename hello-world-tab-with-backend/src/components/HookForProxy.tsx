/* This file is used for debugging with proxy. 
 * It only takes effect when the environment REACT_ACT_HOOK_FOR_PROXY is set. In VSCode, try it by launching the debug option "Debug in Teams with proxy (Edge)".
 * It will hook the getToken and login function of TeamsUserCredential to return a mocked access token. 
 * The backend code in api folder will send the Graph API request to proxy which will skip the access token check.
 */

import { TeamsUserCredential } from "@microsoft/teamsfx";
import { AccessToken } from "@azure/identity";
export function shouldHookForProxy(): boolean {
  return process.env.REACT_APP_HOOK_FOR_PROXY === "true";
}

if (shouldHookForProxy()) {
  // hook getToken to return a mocked access token. The token can not be used to call real Graph API.
  TeamsUserCredential.prototype.getToken = async (scopes: string | string[], options?: any) => {
    const accessToken: AccessToken = {
      // Function extension will check the expiration time of the token, so set it to maximum timestamp.
      // The function extension will check the azp claim of the token, so set it to a valid value which should be contained in the ALLOWED_APP_IDS in teamsapp.local.yml.
      token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwL3YyLjAiLCJpYXQiOjE2OTg2NDc2MjUsIm5iZiI6MTY5ODY0NzYyNSwiZXhwIjoyMTQ3NDgzNjQ3LCJhaW8iOiJBVlFBcS84VUFBQUE0TklUR29uUzlrbFBmS0tnZDV5U2JpcE9UbWc2Y2tPZE00MExjUlBuSGpyYWtMSkFvUGZmamZZMnBScGVGQTlJZGkya2Nlcy9GOUhGa0FtS041UDZnUGRwTkRFaWhXa25lUTBjeU1XZEppOD0iLCJhenAiOiI1ZTNjZTZjMC0yYjFmLTQyODUtOGQ0Yi03NWVlNzg3ODczNDYiLCJhenBhY3IiOiIwIiwibmFtZSI6Im1vY2tlZCBHaXZlbiBOYW1lIiwib2lkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibW9ja2VkX3VzZXJAbW9ja2VkLm9ubWljcm9zb2Z0LmNvbSIsInJoIjoiMC5BWFlBdGZEb1h0NkxHME9jMVEwbkVVdndiUzlwV1ZOSW5mQkl2YjlsX1hPRkFCcDJBTHMuIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzdWIiOiJFM0ZydjNaWEhzbG4yRWVGTU81T2FoekJBdnRZZ0xzZXhaZG9lWDFTYlZrIiwidGlkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwidXRpIjoiT2NvZEtjOHBkRUtsTFc1MGlmTk5BQSIsInZlciI6IjIuMCJ9.coSn59IDIfWhwznUz-aIdBVEAZUaGCaulU75zrXCOImOOd37Rtql0lCUovJ5z1ZZBOJxiLU1TwiOHPqHVKwZxucBub3C5oQM6QnXyvIIBtJjMNx7Toocifr4P-toT7k2gnkMTEU5Y-tM5DkShFVvvrW1p0_Phwy8qr7HY6kpMHVcIIcj9M5CdoHXONBTunQGdZPyv-kWi88h3abh9ybADxDLQrdPAkcjqXV_lXZ3tcE2PteXAaM_2NuyiWQDgZrIfshFZjiULTxlR9HsXGF8BukSzH7NHXG6zxtF5IeYMBysUB_V-BHAQ_b1cVNmjwIQVYdrdG0X6DZsT0AhczL47w",
      expiresOnTimestamp: 2147483647,
    };
    return accessToken;
  };

  // hook login to do nothing.
  TeamsUserCredential.prototype.login = async (scopes: string | string[], options?: any) => {
    return;
  };
}

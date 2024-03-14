/* This file is used for debugging with proxy. 
 * It only takes effect when the environment REACT_ACT_HOOK_FOR_PROXY is set. In VSCode, try it by launching the debug option "Debug in Teams with proxy (Edge)".
 * It will hook the getToken and login function of TeamsUserCredential to return a mocked access token. 
 * The backend code in api folder will send the Graph API request to proxy which will skip the access token check.
 */

import { TeamsUserCredential } from "@microsoft/teamsfx";
import { AccessToken } from "@azure/identity";
import { Base64 } from "js-base64";
export function shouldHookForProxy(): boolean {
  return process.env.REACT_APP_HOOK_FOR_PROXY === "true";
}

if (shouldHookForProxy()) {
  // hook getToken to return a mocked access token. The token can not be used to call real Graph API.
  TeamsUserCredential.prototype.getToken = async (scopes: string | string[], options?: any) => {
    const accessToken: AccessToken = {
      token: generateMockedAccessToken(),
      expiresOnTimestamp: 2147483647,
    };
    return accessToken;
  };

  // hook login to do nothing.
  TeamsUserCredential.prototype.login = async (scopes: string | string[], options?: any) => {
    return;
  };
}

// Function extension will check the expiration time of the token, so set it to maximum timestamp.
// The function extension will check the azp claim of the token, so set it to a valid value which should be contained in the ALLOWED_APP_IDS in teamsapp.local.yml.
function generateMockedAccessToken(): string {
  const header = {
    typ: "JWT",
    alg: "RS256",
    kid: "9GmnyFPkhc3hOuR22mvSvgnLo7Y"
  };
  const payload = {
    aud: "00000000-0000-0000-0000-000000000000",
    iss: "https://login.microsoftonline.com/00000000-0000-0000-0000-000000000000/v2.0",
    iat: 1698647625,
    nbf: 1698647625,
    exp: 2147483647,
    aio: "AVQAq/8UAAAA4NITGonS9klPfKKgd5ySbipOTmg6ckOdM40LcRPnHjrakLJAoPffjfY2pRpeFA9Idi2kces/F9HFkAmKN5P6gPdpNDEihWkneQ0cyMWdJi8=",
    azp: "5e3ce6c0-2b1f-4285-8d4b-75ee78787346",
    azpacr: "0",
    name: "mocked Given Name",
    oid: "00000000-0000-0000-0000-000000000000",
    preferred_username: "mocked_user@mocked.onmicrosoft.com",
    rh: "0.AXYAtfDoXt6LG0Oc1Q0nEUvwbS9pWVNInfBIvb9l_XOFABp2ALs.",
    scp: "access_as_user",
    sub: "E3Frv3ZXHsln2EeFMO5OahzBAvtYgLsexZdoeX1SbVk",
    tid: "00000000-0000-0000-0000-000000000000",
    uti: "OcodKc8pdEKlLW50ifNNAA",
    ver: "2.0"
  };
  const signature = "mocked signature";
  return `${Base64.encode(JSON.stringify(header))}.${Base64.encode(JSON.stringify(payload))}.${Base64.encode(signature)}`;
}

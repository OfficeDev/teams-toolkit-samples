import { AppCredentialAuthConfig, OnBehalfOfCredentialAuthConfig } from "@microsoft/teamsfx";
import config from "./config";

const authConfig: OnBehalfOfCredentialAuthConfig | AppCredentialAuthConfig = {
  authorityHost: config.authorityHost,
  clientId: config.clientId,
  tenantId: config.tenantId,
  clientSecret: config.clientSecret,
};

export default authConfig;
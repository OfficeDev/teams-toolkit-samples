// <copyright file="configVariables.ts" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import { getResourceConfiguration, loadConfiguration, ResourceType } from "@microsoft/teamsfx";

export const getBaseUrl = (): string => {
    initTeamsFx();
    const apiConfig = getResourceConfiguration(ResourceType.API);
    return apiConfig.endpoint;
}

function initTeamsFx() {
    loadConfiguration({
        authentication: {
          initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
          simpleAuthEndpoint: process.env.REACT_APP_TEAMSFX_ENDPOINT,
          clientId: process.env.REACT_APP_CLIENT_ID
        },
        resources: [
          {
            type: ResourceType.API,
            name: "default",
            properties: {
              endpoint: process.env.REACT_APP_FUNC_ENDPOINT
            }
          }
        ]
    });
}
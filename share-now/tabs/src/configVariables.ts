// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TeamsFx } from "@microsoft/teamsfx";

export const getBaseUrl = (): string => {
  const teamsfx = new TeamsFx();
  return teamsfx.getConfig("apiEndpoint");
}
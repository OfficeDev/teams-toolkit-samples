// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import fs from "fs-extra";
import path from "path";
import YAML from "yaml";

import { Result } from "../resultType";

const lifecycleActions = [
  {
    name: "provision",
    actions: [
      "teamsApp/create",
      "teamsApp/zipAppPackage",
      "teamsApp/update",
    ],
  },
  {
    name: "deploy",
    actions: [],
  },
  {
    name: "publish",
    actions: [
      "teamsApp/publishAppPackage",
    ],
  }
];

/**
 * Rule 1: no projectId
 * Rule 2: has provision lifecycle actions
 * Rule 3: has deploy lifecycle actions
 * Rule 4: has publish lifecycle actions
 * Rule 5: provision has 'teamsApp/create' action which has TEAMS_APP_ID env variable
 * Rule 6: has sampleTag with format 'repo:name'
 * 
 * @param projectDir root directory of the project
 * @returns validation result
 */
export default async function validateTeamsAppYaml(projectDir: string): Promise<Result> {
  const result: Result = {
    name: "teamsapp.yaml",
    passed: [],
    failed: [],
    warning: [],
  };

  const yamlFile = path.join(projectDir, "teamsapp.yml");
  if (!await fs.exists(yamlFile)) {
    result.failed = [`teamsapp.yml does not exist.`];
    return result;
  }
  const fileContent = await fs.readFile(yamlFile, 'utf8');
  const yamlData = YAML.parse(fileContent);

  // Rule 1: projectId check
  const projectId = yamlData && yamlData.projectId;
  if (projectId && projectId !== "") {
    result.failed.push(`Project should NOT have projectId in teamsapp.yml.`);
  } else {
    result.passed.push(`Project has no projectId in teamsapp.yml.`);
  }

  // Rule 2: lifecycle check
  for (const lifecycle of lifecycleActions) {
    const actions = yamlData[lifecycle.name] as any[];
    const failures: string[] = [];
    if (!actions) {
      result.failed.push(`Project should have '${lifecycle.name}' stage in teamsapp.yml.`);
      continue;
    }
    for (const actionName of lifecycle.actions) {
      if (actions && actions.findIndex((action: { uses: string; }) => action.uses === actionName) < 0) {
        failures.push(`Project should have '${actionName}' action in ${lifecycle.name} stage.`);
      }
      // Rule 3: special checks for 'teamsApp/create' action
      if (lifecycle.name === "provision" && actionName === "teamsApp/create") {
        const actionIndex = actions.findIndex((action: { uses: string; }) => action.uses === actionName);
        if (actionIndex >= 0) {
          const action = actions[actionIndex];
          if (action.writeToEnvironmentFile.teamsAppId === "TEAMS_APP_ID") {
            result.passed.push(`Project has 'teamsApp/create' action which has TEAMS_APP_ID env variable.`);
          } else {
            result.failed.push(`Project should have 'teamsApp/create' action which has TEAMS_APP_ID env variable.`);
          }
        }
      }
    }
    if (failures.length === 0) {
      result.passed.push(`Project has all mandatory actions in ${lifecycle.name} stage.`);
    } else {
      result.failed.push(...failures);
    }
  }
  // Rule 4: sampleTag check
  const sampleTagRegex = /^([\w-]+):([\w-]+)$/g;
  const sampleTag = (yamlData?.additionalMetadata as { sampleTag: string } | undefined)?.sampleTag;
  let validSampleTag = false;
  if (sampleTag && sampleTag !== "") {
    const match = sampleTagRegex.exec(sampleTag);
    if (match) {
      result.passed.push(`Project has sampleTag with format 'repo:name'.`);
      validSampleTag = true;
      if (match[1] !== "TeamsFx-Samples") {
        result.warning.push(`Project is an external sample.`);
      }
    }
  }
  if (!validSampleTag) {
    result.failed.push(`Project should have sampleTag with format 'repo:name'.`);
  }
  return result;
}

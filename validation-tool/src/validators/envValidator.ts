// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import { Result } from "../resultType";

/**
 * Rule 1: env files shouldn’t contain actual value for the environment variables except for TEAMSFX_ENV and TEAMS_APP_NAME
 * 
 * @param projectDir root directory of the project
 * @returns validation result
 */
export default async function validateEnvFiles(projectDir: string): Promise<Result> {
  const result: Result = {
    name: "Env Files",
    passed: [],
    failed: [],
    warning: [],
  };
  const files = [".env.dev", ".env.local"];
  for (const envFile of files) {
    const filePath = path.join(projectDir, "env", envFile);
    if (!await fs.exists(filePath)) {
      result.failed = [`${path.join("env", envFile)} does not exist.`];
      continue;
    }
    const fileContent = await fs.readFile(filePath, 'utf8');
    const envData = dotenv.parse(fileContent);
    const mappings = Object.entries(envData).map(([key, value]) => ({ name: key, value: value }));
    let validEnv = true;
    for (const kv of mappings) {
      if (kv.name === "TEAMSFX_ENV" || kv.name === "APP_NAME_SUFFIX" || kv.name === "TEAMS_APP_NAME") {
        continue;
      } else if (kv.value !== '') {
        result.failed.push(`${envFile}: ${kv.name} should NOT have value.`);
        validEnv = false;
      }
    }
    if (validEnv) {
      result.passed.push(`${envFile}: All environment variables are valid.`);
    }
  }
  return result;
}

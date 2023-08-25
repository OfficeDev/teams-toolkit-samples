// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { satisfies } from "compare-versions";
import fs from "fs-extra";
import path from "path";

import { Result } from "../resultType";

/**
 * Rule 1: 'engines.node' field should be compatible with 16 & 18.
 * 
 * @param projectDir root directory of the project
 * @returns validation result
 */
export default async function validatePackageJson(projectDir: string): Promise<Result> {
  const result: Result = {
    name: "package.json",
    passed: [],
    failed: [],
    warning: [],
  };
  const filePath = path.join(projectDir, "package.json");
  if (!await fs.exists(filePath)) {
    result.failed = [`package.json does not exist.`];
    return result;
  }
  const fileContent = await fs.readFile(filePath, 'utf8');
  try {
    const packageJson = JSON.parse(fileContent);
    if (!packageJson.engines || !packageJson.engines.node) {
      result.warning = [`package.json does not have 'engines.node' field.`];
      return result;
    }
    if (!satisfies('16.0.0', packageJson.engines.node) && !satisfies('18.0.0', packageJson.engines.node)) {
      result.failed = [`'engines.node' field should be compatible with 16 or 18.`];
      return result;
    }
  } catch (error: unknown) {
    result.failed = [`package.json is not a valid JSON file.`];
    return result;
  }
  result.passed = [`'engines.node' field is compatible with 16 or 18.`];
  return result;
}

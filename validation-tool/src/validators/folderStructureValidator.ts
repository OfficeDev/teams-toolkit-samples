// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import fs from "fs-extra";
import path from "path";

import { Result } from "../resultType";

const requiredFolders = [
  ".vscode",
  "appPackage",
  "env",
];
const requiredFiles = [
  "appPackage/manifest.json",
  "appPackage/color.png",
  "appPackage/outline.png",
  "env/.env.dev",
  "env/.env.local",
  "teamsapp.yml",
  "teamsapp.local.yml",
  "README.md",
];

export default async function validateFolderStructure(projectDir: string): Promise<Result> {
  const result: Result = {
    name: "Folder Structure",
    passed: [],
    failed: [],
    warning: [],
  };
  for (const folder of requiredFolders) {
    if (!await fs.exists(path.join(projectDir, folder)) || !await fs.stat(path.join(projectDir, folder)).then(stat => stat.isDirectory())) {
      result.failed.push(`Project should have "${folder}" folder.`);
    } else {
      result.passed.push(`Project has "${folder}" folder.`);
    }
  }
  for (const file of requiredFiles) {
    if (!await fs.exists(path.join(projectDir, file)) || !await fs.stat(path.join(projectDir, file)).then(stat => stat.isFile())) {
      result.failed.push(`Project should have "${file}" file.`);
    } else {
      result.passed.push(`Project has "${file}" file.`);
    }
  }
  return result;
}

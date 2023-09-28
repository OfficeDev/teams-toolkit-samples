// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import chalk from "chalk";

import { Result } from "./resultType";

const success = chalk.green;
const warn = chalk.yellow;
const failure = chalk.bold.red;

export function outputResult(result: Result): void {
  const passedMessage = success(`${result.passed.length} validation passed`);
  const failedMessage = failure(`${result.failed.length} validation failed`);
  const warningMessage = result.warning.length > 0 ? warn(`${result.warning.length} warning(s)`) : undefined;
  if (result.failed.length === 0) {
    console.log(`✅[${result.name}] ${passedMessage}${warningMessage ? `, ${warningMessage}`: ""}.`);
  } else {
    console.log(`❌[${result.name}] ${failedMessage}${warningMessage ? `, ${warningMessage}`: ""}, ${passedMessage}.`);
    console.log(result.failed.map(s => `  ❌ ${s}`).join("\n"));
  }

  if (result.warning.length > 0) {
    console.log(result.warning.map(s => `  ⚠️ ${s}`).join("\n"));
  }
  if (result.passed.length > 0) {
    console.log(result.passed.map(s => `  ✅ ${s}`).join("\n"));
  }
}

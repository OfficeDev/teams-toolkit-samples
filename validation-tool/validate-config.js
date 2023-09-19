#! /usr/bin/env node
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const fs = require("fs");
const exit = require("process").exit;

const mandatoryFields = [
  "id",
  "onboardDate",
  "shortId",
  "shortDescription",
  "fullDescription",
  "types",
  "tags",
  "time",
  "configuration",
  "thumbnailPath",
  "suggested",
];

async function main() {
  const configPath = process.argv[2];
  if (!fs.existsSync(configPath)) {
    console.error(`Config file ${configPath} does not exist.`);
    exit(1);
  }
  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    for (const sample of config.samples) {
      for (const field of mandatoryFields) {
        const value = sample[field];
        if (value === undefined) {
          console.error(`Sample ${JSON.stringify(sample)} is missing mandatory field ${field}.`);
          exit(1);
        }
      }
    }
  } catch (error) {
    console.error(`Config file ${configPath} is not valid JSON.`);
    exit(1);
  }
  exit(0);
}
main();

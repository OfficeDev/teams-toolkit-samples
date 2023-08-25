// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import mock from "mock-fs";
import fs from "fs-extra";
import path from "path";

import validateEnvFiles from "../../src/validators/envValidator";

describe('validateEnvFiles()', () => {
  afterEach(() => {
    mock.restore();
  });

  test('env files are valid', async () => {
    const validEnvContent = await fs.readFile(path.join(__dirname, "../data/env-valid.env"), "utf8");
    mock({
      "testFolder": {
        "env": {
          ".env.dev": validEnvContent,
          ".env.local": validEnvContent,
        },
      },
    });

    const result = await validateEnvFiles(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Env Files");
    expect(result.failed.length).toBe(0);
    expect(result.passed.length).toBe(2);
  });

  test('env.dev does not exist', async () => {
    const validEnvContent = await fs.readFile(path.join(__dirname, "../data/env-valid.env"), "utf8");
    mock({
      "testFolder": {
        "env": {
          ".env.local": validEnvContent,
        },
      },
    });
    const result = await validateEnvFiles(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Env Files");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(1);
  });

  test('env.dev has invalid variable', async () => {
    const validEnvContent = await fs.readFile(path.join(__dirname, "../data/env-valid.env"), "utf8");
    const invalidEnvContent = await fs.readFile(path.join(__dirname, "../data/env-invalid-variables.env"), "utf8");
    mock({
      "testFolder": {
        "env": {
          ".env.dev": invalidEnvContent,
          ".env.local": validEnvContent,
        },
      },
    });

    const result = await validateEnvFiles(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Env Files");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(1);
    expect(result.failed[0]).toEqual(".env.dev: BOT_ID should NOT have value.");
  });
});

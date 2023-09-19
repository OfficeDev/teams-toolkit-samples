// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import mock from "mock-fs";
import fs from "fs-extra";
import path from "path";

import validateGif from "../../src/validators/packageJsonValidator";

describe('validatePackageJson()', () => {
  afterEach(() => {
    mock.restore();
  });

  test('no package.json', async () => {
    mock({
      "testFolder": {
      },
    });

    const result = await validateGif(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("package.json");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(0);
    expect(result.warning.length).toBe(0);
  });

  test('valid package.json', async () => {
    const validPackageJson = await fs.readFile(path.join(__dirname, "../data/package-valid.json"));
    mock({
      "testFolder": {
        "package.json": validPackageJson,
      },
    });

    const result = await validateGif(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("package.json");
    expect(result.failed.length).toBe(0);
    expect(result.passed.length).toBe(1);
    expect(result.warning.length).toBe(0);
  });

  test('invalid package.json', async () => {
    const invalidPackageJson = await fs.readFile(path.join(__dirname, "../data/package-invalid.json"));
    mock({
      "testFolder": {
        "package.json": invalidPackageJson,
      },
    });

    const result = await validateGif(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("package.json");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(0);
    expect(result.warning.length).toBe(0);
  });

  test('invalid node version', async () => {
    const packageJson = await fs.readFile(path.join(__dirname, "../data/package-invalid-node.json"));
    mock({
      "testFolder": {
        "package.json": packageJson,
      },
    });

    const result = await validateGif(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("package.json");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(0);
    expect(result.warning.length).toBe(0);
    expect(result.failed[0]).toEqual("'engines.node' field should be compatible with 16 or 18.");
  });

  test('missing node version', async () => {
    const packageJson = await fs.readFile(path.join(__dirname, "../data/package-node-missing.json"));
    mock({
      "testFolder": {
        "package.json": packageJson,
      },
    });

    const result = await validateGif(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("package.json");
    expect(result.failed.length).toBe(0);
    expect(result.passed.length).toBe(0);
    expect(result.warning.length).toBe(1);
    expect(result.warning[0]).toEqual("package.json does not have 'engines.node' field.");
  });
});

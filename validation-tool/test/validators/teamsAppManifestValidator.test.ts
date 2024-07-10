// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import mock from "mock-fs";
import fs from "fs-extra";
import path from "path";

import validateTeamsAppManifest from "../../src/validators/teamsAppManifestValidator";

describe('validateTeamsAppManifest()', () => {
  afterEach(() => {
    mock.restore();
  });

  test('manifest.json is valid', async () => {
    const validManifestContent = await fs.readFile(path.join(__dirname, "../data/manifest-valid.json"), "utf8");
    mock({
      "testFolder": {
        "appPackage": {
          "manifest.json": validManifestContent,
        },
      },
    });

    const result = await validateTeamsAppManifest(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Teams App Manifest");
    expect(result.failed.length).toBe(0);
    expect(result.passed.length).toBe(2);
  });

  test('manifest.json does not exist', async () => {
    mock({
      "testFolder": {},
    });
    const result = await validateTeamsAppManifest(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Teams App Manifest");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(0);
  });

  test('manifest.json is broken format', async () => {
    mock({
      "testFolder": {
        "appPackage": {
          "manifest.json": "{ \"broken JSON\"",
        },
      },
    });

    const result = await validateTeamsAppManifest(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Teams App Manifest");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(0);
    expect(result.failed[0]).toEqual("appPackage/manifest.json is not a valid JSON file.");
  });

  test('manifest.json has invalid id', async () => {
    const validManifestContent = await fs.readFile(path.join(__dirname, "../data/manifest-invalid-id.json"), "utf8");
    mock({
      "testFolder": {
        "appPackage": {
          "manifest.json": validManifestContent,
        },
      },
    });

    const result = await validateTeamsAppManifest(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Teams App Manifest");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(1);
    expect(result.failed[0]).toEqual("id should be equal to '\${{TEAMS_APP_ID}}'.");
  });

  test('manifest.json has invalid manifest version', async () => {
    const validManifestContent = await fs.readFile(path.join(__dirname, "../data/manifest-invalid-version.json"), "utf8");
    mock({
      "testFolder": {
        "appPackage": {
          "manifest.json": validManifestContent,
        },
      },
    });

    const result = await validateTeamsAppManifest(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Teams App Manifest");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(1);
    expect(result.failed[0]).toEqual("Manifest version(1.12) is NOT aligned with Teams Toolkit(1.17).");
  });
});

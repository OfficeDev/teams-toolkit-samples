// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import mock from "mock-fs";
import path from "path";

import validateFolderStructure from "../../src/validators/folderStructureValidator";

describe('validateFolderStructure()', () => {
  afterEach(() => {
    mock.restore();
  });

  test('folder has correct structure', async () => {
    mock({
      "testFolder": {
        ".vscode": {},
        "env": {
          ".env.dev": "test env.dev file",
          ".env.local": "test env.local file",
        },
        "appPackage": {
          "manifest.json": "test manifest.json file",
          "color.png": "test color.png file",
          "outline.png": "test outline.png file",
        },
        "README.md": "test readme file",
        "teamsapp.yml": "test teamsapp.yml file",
        "teamsapp.local.yml": "test teamsapp.local.yml file",
      },
    });

    const result = await validateFolderStructure(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Folder Structure");
    expect(result.failed.length).toBe(0);
    expect(result.passed.length).toBe(11);
  });

  test('folder has missing folder/file', async () => {
    mock({
      "testFolder": {
        ".vscode": {},
        "appPackage": {
          "color.png": "test color.png file",
          "outline.png": "test outline.png file",
        },
        "env": "it should be a folder",
        "README.md": "test readme file",
        "teamsapp.yml": "test teamsapp.yml file",
        "teamsapp.local.yml": "test teamsapp.local.yml file",
      },
    });

    const result = await validateFolderStructure(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Folder Structure");
    expect(result.failed.length).toBe(4);
    expect(result.passed.length).toBe(7);
  });
});

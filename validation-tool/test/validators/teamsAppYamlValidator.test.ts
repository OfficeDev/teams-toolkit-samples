// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import mock from "mock-fs";
import fs from "fs-extra";
import path from "path";

import validateTeamsAppYaml from "../../src/validators/teamsAppYamlValidator";

describe('validateTeamsAppYaml()', () => {
  afterEach(() => {
    mock.restore();
  });

  test('m365agents.yml is valid', async () => {
    const validYamlContent = await fs.readFile(path.join(__dirname, "../data/m365agents-valid.yml"), "utf8");
    mock({
      "testFolder": {
        "m365agents.yml": validYamlContent,
      },
    });

    const result = await validateTeamsAppYaml(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("teamsapp.yaml");
    expect(result.failed.length).toBe(0);
    expect(result.passed.length).toBe(6);
  });

  test('m365agents.yml does not exist', async () => {
    mock({
      "testFolder": {},
    });
    const result = await validateTeamsAppYaml(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("teamsapp.yaml");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(0);
  });

  test('m365agents.yml has projectId', async () => {
    const validYamlContent = await fs.readFile(path.join(__dirname, "../data/m365agents-with-projectId.yml"), "utf8");
    mock({
      "testFolder": {
        "m365agents.yml": validYamlContent,
      },
    });

    const result = await validateTeamsAppYaml(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("teamsapp.yaml");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(5);
    expect(result.failed[0]).toEqual("Project should NOT have projectId in m365agents.yml.");
  });

  test('m365agents.yml has no sample tag', async () => {
    const validYamlContent = await fs.readFile(path.join(__dirname, "../data/m365agents-without-sampleTag.yml"), "utf8");
    mock({
      "testFolder": {
        "m365agents.yml": validYamlContent,
      },
    });

    const result = await validateTeamsAppYaml(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("teamsapp.yaml");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(5);
    expect(result.failed[0]).toEqual("Project should have sampleTag with format 'repo:name'.");
  });

  test('m365agents.yml is external sample tag', async () => {
    const validYamlContent = await fs.readFile(path.join(__dirname, "../data/m365agents-external-sample.yml"), "utf8");
    mock({
      "testFolder": {
        "m365agents.yml": validYamlContent,
      },
    });

    const result = await validateTeamsAppYaml(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("teamsapp.yaml");
    expect(result.failed.length).toBe(0);
    expect(result.passed.length).toBe(6);
    expect(result.warning.length).toBe(1);
    expect(result.warning[0]).toEqual("Project is an external sample.");
  });

  test('m365agents.yml has invalid actions', async () => {
    const validYamlContent = await fs.readFile(path.join(__dirname, "../data/m365agents-invalid-actions.yml"), "utf8");
    mock({
      "testFolder": {
        "m365agents.yml": validYamlContent,
      },
    });

    const result = await validateTeamsAppYaml(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("teamsapp.yaml");
    expect(result.failed.length).toBe(3);
    expect(result.passed.length).toBe(3);
    expect(result.failed[0]).toEqual("Project should have 'teamsApp/create' action which has TEAMS_APP_ID env variable.");
    expect(result.failed[1]).toEqual("Project should have 'teamsApp/update' action in provision stage.");
    expect(result.failed[2]).toEqual("Project should have 'deploy' stage in m365agents.yml.");
  });
});

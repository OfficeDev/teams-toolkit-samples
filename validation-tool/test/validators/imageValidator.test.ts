// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import mock from "mock-fs";
import fs from "fs-extra";
import path from "path";

import validateImage from "../../src/validators/imageValidator";

describe('validateImage()', () => {
  afterEach(() => {
    mock.restore();
  });

  test('no GIF', async () => {
    mock({
      "testFolder": {
      },
    });

    const result = await validateImage(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Image Files");
    expect(result.failed.length).toBe(0);
    expect(result.passed.length).toBe(0);
    expect(result.warning.length).toBe(2);
  });

  test('valid GIF', async () => {
    const validGifContent = await fs.readFile(path.join(__dirname, "../data/preview-valid.gif"));
    mock({
      "testFolder": {
        "assets": {
          "sampleDemo.gif": validGifContent,
        },
      },
    });

    const result = await validateImage(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Image Files");
    expect(result.failed.length).toBe(0);
    expect(result.passed.length).toBe(1);
    expect(result.warning.length).toBe(1);
  });

  test('invalid GIF', async () => {
    const invalidGifContent = await fs.readFile(path.join(__dirname, "../data/preview-invalid.gif"));
    mock({
      "testFolder": {
        "assets": {
          "sampleDemo.gif": invalidGifContent,
        },
      },
    });

    const result = await validateImage(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("Image Files");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(0);
    expect(result.warning.length).toBe(1);
  });
});

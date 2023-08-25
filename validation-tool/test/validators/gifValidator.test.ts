// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import mock from "mock-fs";
import fs from "fs-extra";
import path from "path";

import validateGif from "../../src/validators/gifValidator";

describe('validateGif()', () => {
  afterEach(() => {
    mock.restore();
  });

  test('no GIF', async () => {
    mock({
      "testFolder": {
      },
    });

    const result = await validateGif(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("GIF Demo File");
    expect(result.failed.length).toBe(0);
    expect(result.passed.length).toBe(0);
    expect(result.warning.length).toBe(1);
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

    const result = await validateGif(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("GIF Demo File");
    expect(result.failed.length).toBe(0);
    expect(result.passed.length).toBe(1);
    expect(result.warning.length).toBe(0);
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

    const result = await validateGif(path.join(process.cwd(), "testFolder"));
    expect(result.name).toEqual("GIF Demo File");
    expect(result.failed.length).toBe(1);
    expect(result.passed.length).toBe(0);
    expect(result.warning.length).toBe(0);
  });
});

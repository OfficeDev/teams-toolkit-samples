// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import fs from "fs-extra";
import path from "path";
import sizeOf from "image-size";
import { Result } from "../resultType";

/**
 * Rule 1: Images should have 1600*920/800*460 resolution or same ratio.
 * 
 * @param projectDir root directory of the project
 * @returns validation result
 */
export default async function validateImage(projectDir: string): Promise<Result> {
  const result: Result = {
    name: "Image Files",
    passed: [],
    failed: [],
    warning: [],
  };
  const defaultImages = ["thumbnail.png", "sampleDemo.gif"];
  for (const image of defaultImages) {
    const imageDefaultPath = path.join(projectDir, "assets", image);
    const imageName = path.join("assets", image);
    if (!await fs.exists(imageDefaultPath)) {
      result.warning.push(`${imageName} does not exist.`);
      continue;
    }
    const dimensions = sizeOf(imageDefaultPath);
    if (dimensions.width && dimensions.height && dimensions.width / dimensions.height === 40/23) {
      result.passed.push(`${imageName} has 1600*920/800*460 resolution or same ratio.`);
    } else {
      result.failed.push(`${imageName} should have 1600*920/800*460 resolution or same ratio.`);
    }
  }
  return result;
}

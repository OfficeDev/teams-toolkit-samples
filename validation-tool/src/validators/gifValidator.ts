// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import fs from "fs-extra";
import path from "path";
import sizeOf from "image-size";
import { Result } from "../resultType";

/**
 * Rule 1: GIF should have 1600*920/800*460 resolution or same ratio.
 * 
 * @param projectDir root directory of the project
 * @returns validation result
 */
export default async function validateGif(projectDir: string): Promise<Result> {
  const result: Result = {
    name: "GIF Demo File",
    passed: [],
    failed: [],
    warning: [],
  };
  const defaultGifPath = path.join(projectDir, "assets", "sampleDemo.gif");
  if (!await fs.exists(defaultGifPath)) {
    result.warning.push(`assets/sampleDemo.gif does not exist.`);
    return result;
  }

  const dimensions = sizeOf(defaultGifPath);
  let valid = false;
  if (dimensions.height === 920 && dimensions.width === 1600) {
    valid = true;
  } else if (dimensions.height === 460 && dimensions.width === 800) {
    valid = true;
  } else if (dimensions.width && dimensions.height && dimensions.width / dimensions.height === 40/23) {
    valid = true;
  }
  if (!valid) {
    result.failed.push(`assets/sampleDemo.gif should have 1600*920/800*460 resolution or same ratio.`);
  } else {
    result.passed.push(`assets/sampleDemo.gif has 1600*920/800*460 resolution or same ratio.`);
  }
  return result;
}

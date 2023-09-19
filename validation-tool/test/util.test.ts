// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import chalk from "chalk";

import { outputResult } from "../src/util";

describe('outputResult()', () => {
  let log: jest.SpyInstance;

  beforeEach(() => {
    log = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    log.mockReset();
  });

  test('result has partial failure', () => {
    outputResult({
      name: 'test',
      passed: ['passed'],
      failed: ['failed'],
      warning: [],
    });
    expect(log).toHaveBeenCalledTimes(3);
    expect(log).toHaveBeenNthCalledWith(1, `❌[test] ${chalk.bold.red('1 validation failed')}, ${chalk.green('1 validation passed')}.`);
    expect(log).toHaveBeenNthCalledWith(2, '  ❌ failed');
    expect(log).toHaveBeenNthCalledWith(3, '  ✅ passed');
  });

  test('result has no failure', () => {
    outputResult({
      name: 'test',
      passed: ['passed'],
      failed: [],
      warning: [],
    });
    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(1, `✅[test] ${chalk.green('1 validation passed')}.`);
    expect(log).toHaveBeenNthCalledWith(2, '  ✅ passed');
  });

  test('result has warning without failure', () => {
    outputResult({
      name: 'test',
      passed: ['passed'],
      failed: [],
      warning: ['warning'],
    });
    expect(log).toHaveBeenCalledTimes(3);
    expect(log).toHaveBeenNthCalledWith(1, `✅[test] ${chalk.green('1 validation passed')}, ${chalk.yellow('1 warning(s)')}.`);
    expect(log).toHaveBeenNthCalledWith(2, '  ⚠️ warning');
    expect(log).toHaveBeenNthCalledWith(3, '  ✅ passed');
  });

  test('result has warning with failure', () => {
    outputResult({
      name: 'test',
      passed: [],
      failed: ['failed'],
      warning: ['warning'],
    });
    expect(log).toHaveBeenCalledTimes(3);
    expect(log).toHaveBeenNthCalledWith(1, `❌[test] ${chalk.bold.red('1 validation failed')}, ${chalk.yellow('1 warning(s)')}, ${chalk.green('0 validation passed')}.`);
    expect(log).toHaveBeenNthCalledWith(2, '  ❌ failed');
    expect(log).toHaveBeenNthCalledWith(3, '  ⚠️ warning');
  });
});

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const getBaseUrl = (): string => {
  return process.env.REACT_APP_FUNC_ENDPOINT ?? "";
}
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CardAction } from "botframework-schema";

/**
 * Defines Teams-specific behavior for an adaptive card submit action.
 */
export interface TeamsAdaptiveSubmitActionData {
    // Teams-specific action.
    msteams: CardAction
}

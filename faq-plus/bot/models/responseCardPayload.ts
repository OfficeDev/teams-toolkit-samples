// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { QnADTO } from "@azure/cognitiveservices-qnamaker-runtime/esm/models";
import { TeamsAdaptiveSubmitActionData } from "./teamsAdaptiveSubmitActionData";

/**
 * Represents the payload of a response card.
 */
export interface ResponseCardPayload extends TeamsAdaptiveSubmitActionData {
    /**
     * Question that was asked originally asked by the user.
     */
    UserQuestion: string,

    /**
     * The response given by the bot to the user.
     */
    KnowledgeBaseAnswer: string,

    /**
     * List of previous questions when a follow up prompt is selected.
     */
    PreviousQuestions: QnADTO[],

    /**
     * A value indicating whether question is from prompt.
     */
    IsPrompt: boolean
}
import { QnADTO } from "@azure/cognitiveservices-qnamaker-runtime/esm/models";
import { TeamsAdaptiveSubmitActionData } from "./teamsAdaptiveSubmitActionData";

export interface ResponseCardPayload extends TeamsAdaptiveSubmitActionData {
    UserQuestion: string,
    KnowledgeBaseAnswer: string,
    PreviousQuestions: QnADTO[],
    IsPrompt: boolean
}
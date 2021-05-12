import { TeamsAdaptiveSubmitActionData } from "./teamsAdaptiveSubmitActionData";

export interface AskAnExpertCardPayload extends TeamsAdaptiveSubmitActionData {
    Title?: string,
    Description: string,
    UserQuestion: string,
    KnowledgeBaseAnswer: string
}
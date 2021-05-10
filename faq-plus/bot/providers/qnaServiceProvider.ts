import { QnAMakerRuntimeClient } from '@azure/cognitiveservices-qnamaker-runtime';
import { ConfigurationDataProvider } from './configurationProvider';
import { ConfigurationEntityTypes } from '../models/configurationEntityTypes';
import { QnASearchResultList, QueryDTO } from '@azure/cognitiveservices-qnamaker-runtime/esm/models';

export class QnaServiceProvider {
    private readonly EnvironmentType: string = "Prod";

    private readonly qnaMakerRuntimeClient: QnAMakerRuntimeClient;
    private readonly configurationProvider: ConfigurationDataProvider;

    constructor(configurationProvider: ConfigurationDataProvider, qnaMakerClient: QnAMakerRuntimeClient) {
        this.configurationProvider = configurationProvider;
        this.qnaMakerRuntimeClient = qnaMakerClient;
    }

    public async GenerateAnswer(question: string, isTestKnowledgeBase, previousQnAId: string = null, previousUserQuery: string = null): Promise<QnASearchResultList> {
        const knowledgeBaseId = await this.configurationProvider.GetSavedEntityDetailAsync(ConfigurationEntityTypes.KnowledgeBaseId);

        const queryDTO: QueryDTO = {
            isTest: isTestKnowledgeBase,
            question: question?.trim(),
            scoreThreshold: parseFloat(process.env.SCORETHRESHOLD)
        }

        if(previousQnAId && previousUserQuery) {
            queryDTO.context = {
                previousQnaId: previousQnAId,
                previousUserQuery: previousUserQuery
            };
        }

        return await this.qnaMakerRuntimeClient.runtime.generateAnswer(knowledgeBaseId, queryDTO);
    }
}
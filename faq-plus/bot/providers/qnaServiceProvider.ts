// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { QnAMakerRuntimeClient } from '@azure/cognitiveservices-qnamaker-runtime';
import { ConfigurationDataProvider } from './configurationProvider';
import { ConfigurationEntityTypes } from '../models/configurationEntityTypes';
import { QnASearchResultList, QueryDTO } from '@azure/cognitiveservices-qnamaker-runtime/esm/models';
import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js";

export class QnaServiceProvider {
    private readonly environmentType: string = "Prod";

    private readonly qnaMakerRuntimeClient: QnAMakerRuntimeClient;
    private readonly configurationProvider: ConfigurationDataProvider;
    private readonly endpointKey: string;

    constructor(configurationProvider: ConfigurationDataProvider, qnaMakerEndpointKey: string, qnaMakerHostUrl: string) {
        this.configurationProvider = configurationProvider;
        this.qnaMakerRuntimeClient = new QnAMakerRuntimeClient(
            new CognitiveServicesCredentials(qnaMakerEndpointKey),
            qnaMakerHostUrl
        );
        this.endpointKey = qnaMakerEndpointKey;
    }

    public async gGenerateAnswer(question: string, isTestKnowledgeBase, previousQnAId: string = null, previousUserQuery: string = null): Promise<QnASearchResultList> {
        const knowledgeBaseId = await this.configurationProvider.getSavedEntityDetailAsync(ConfigurationEntityTypes.KnowledgeBaseId);

        const queryDTO: QueryDTO = {
            isTest: isTestKnowledgeBase,
            question: question?.trim(),
            scoreThreshold: parseFloat(process.env.SCORETHRESHOLD)
        }

        if (previousQnAId && previousUserQuery) {
            queryDTO.context = {
                previousQnaId: previousQnAId,
                previousUserQuery: previousUserQuery
            };
        }

        const customHeaders = { Authorization: `EndpointKey ${this.endpointKey}` };

        return await this.qnaMakerRuntimeClient.runtime.generateAnswer(knowledgeBaseId, queryDTO, { customHeaders });
    }
}
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Action, AdaptiveCard, CardElement, TextWeight, Version, TextBlock, Spacing, Container, ColumnSet, Column, VerticalAlignment, Image, Size, ImageStyle, SubmitAction } from "adaptivecards";
import { CardFactory } from "botbuilder-core";
import { ActionTypes, Attachment } from "botframework-schema";
import { QnADTO, QnASearchResult } from '@azure/cognitiveservices-qnamaker-runtime/esm/models';
import { ResponseCardPayload } from "../models/responseCardPayload";

export function getResponseCard(response: QnASearchResult, userQuestion: string, payload: ResponseCardPayload): Attachment {
    const responseCard = new AdaptiveCard();
    responseCard.version = new Version(1, 2);

    const cardBody = buildResponseCardBody(response, userQuestion, response.answer, payload);
    for (let i = 0; i < cardBody.length; i++) {
        responseCard.addItem(cardBody[i]);
    }

    const cardAction = buildListOfActions(userQuestion, response.answer);
    for (let i = 0; i < cardAction.length; i++) {
        responseCard.addAction(cardAction[i]);
    }

    return CardFactory.adaptiveCard(responseCard);
}

function buildResponseCardBody(response: QnASearchResult, userQuestion: string, answer: string, payload: ResponseCardPayload): CardElement[] {
    const cardBodyToConstruct: CardElement[] = [];

    const responseHeaderBlock = new TextBlock("Here's what I found:");
    responseHeaderBlock.weight = TextWeight.Bolder;
    responseHeaderBlock.wrap = true;
    cardBodyToConstruct.push(responseHeaderBlock);

    const answerTextBlock = new TextBlock(answer);
    answerTextBlock.wrap = true;
    answerTextBlock.spacing = Spacing.Medium;
    cardBodyToConstruct.push(answerTextBlock);

    if (response?.context.prompts.length > 0) {
        const previousQuestions = buildListOfPreviousQuestions(response.id, userQuestion, answer, payload);

        for (let i = 0; i < response.context.prompts.length; i++) {
            const item = response.context.prompts[i];
            const adaptiveContainer = new Container();
            const adaptiveColumnSet = new ColumnSet();

            const iconColumn = new Column();
            iconColumn.width = "auto";
            iconColumn.verticalContentAlignment = VerticalAlignment.Center;
            iconColumn.spacing = Spacing.Small;
            const image = new Image();
            image.url = "https://github.com/OfficeDev/microsoft-teams-apps-faqplus/blob/master/Source/Microsoft.Teams.Apps.FAQPlusPlus/wwwroot/Content/Followupicon.png"; // todo: host in bot app
            image.size = Size.Stretch;
            image.style = ImageStyle.Default;
            iconColumn.addItem(image);

            const actionItemColumn = new Column();
            actionItemColumn.width = "auto";
            actionItemColumn.verticalContentAlignment = VerticalAlignment.Center;
            actionItemColumn.spacing = Spacing.Small;
            const textBlock = new TextBlock();
            textBlock.wrap = true;
            textBlock.text = `**${item.displayText}**`;
            actionItemColumn.addItem(textBlock);

            adaptiveColumnSet.addColumn(iconColumn);
            adaptiveColumnSet.addColumn(actionItemColumn);
            adaptiveContainer.addItem(adaptiveColumnSet);

            const action = new SubmitAction();
            action.title = item.displayText;
            action.data = {
                msteams: {
                    type: ActionTypes.MessageBack,
                    displayText: item.displayText,
                    text: item.displayText
                },
                PreviousQuestions: previousQuestions,
                IsPrompt: true
            } as ResponseCardPayload;
            adaptiveContainer.selectAction = action;
            adaptiveContainer.separator = true;

            cardBodyToConstruct.push(adaptiveContainer);
        }
    }
    return cardBodyToConstruct;
}

function buildListOfActions(userQuestion: string, answer: string): Action[] {
    const action = new SubmitAction();
    action.title = "Ask an expert";
    action.data = {
        msteams: {
            type: ActionTypes.MessageBack,
            displayText: "Ask an expert",
            text: "Ask an expert"
        },
        UserQuestion: userQuestion,
        KnowledgeBaseAnswer: answer
    } as ResponseCardPayload;

    return [action];
}

function buildListOfPreviousQuestions(id: number, userQuestion: string, answer: string, payload: ResponseCardPayload) {
    const previousQuestions: QnADTO[] = payload.PreviousQuestions ?? [];
    previousQuestions.push({
        id: id,
        questions: [userQuestion],
        answer: answer
    });

    return previousQuestions;
}
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AdaptiveCard, Version, TextBlock, SubmitAction } from "adaptivecards";
import { CardFactory } from "botbuilder-core";
import { ActionTypes, Attachment } from "botframework-schema";
import { ResponseCardPayload } from "../models/responseCardPayload";
import { TextString, Constants } from "../common/constants";

export function getUnrecognizedInputCard(userQuestion: string): Attachment {
    const responseCard = new AdaptiveCard();
    responseCard.version = new Version(1, 0);

    const textBlock = new TextBlock(TextString.UnrecognizedInputText);
    textBlock.wrap = true;
    responseCard.addItem(textBlock);

    const action = new SubmitAction();
    action.title = TextString.AskAnExpertButtonText;
    action.data = {
        msteams: {
            type: ActionTypes.MessageBack,
            displayText: TextString.AskAnExpertDisplayText,
            text: Constants.AskAnExpert
        },
        UserQuestion: userQuestion,
    } as ResponseCardPayload;
    responseCard.addAction(action);

    return CardFactory.adaptiveCard(responseCard);
}

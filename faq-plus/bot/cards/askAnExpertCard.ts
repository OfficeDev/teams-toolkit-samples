// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Action, AdaptiveCard, CardElement, TextWeight, Version, TextBlock, TextSize, Spacing, TextInput, SubmitAction } from "adaptivecards";
import { AskAnExpertCardPayload } from "../models/askAnExpertCardPayload";
import { ActionTypes, Attachment, CardFactory, TurnContext, Activity } from "botbuilder";
import { TicketEntity } from "../models/ticketEntity";
import { createTicketAsync, getUserDetailsInPersonalChatAsync } from "../common/adaptiveHelper";
import { ActivityTypes, TeamsChannelAccount } from "botframework-schema";
import { TextString, Constants } from "../common/constants";

export function getAskAnExpertCard(payload?: AskAnExpertCardPayload): Attachment {
    const askAnExpertCard = new AdaptiveCard();
    askAnExpertCard.version = new Version(1, 0);

    const cardBody = buildAskAnExpertCardBody();
    for (let i = 0; i < cardBody.length; i++) {
        askAnExpertCard.addItem(cardBody[i]);
    }

    const cardAction = buildListOfActions(payload?.UserQuestion, payload?.KnowledgeBaseAnswer);
    for (let i = 0; i < cardAction.length; i++) {
        askAnExpertCard.addAction(cardAction[i]);
    }

    return CardFactory.adaptiveCard(askAnExpertCard);
}

function buildAskAnExpertCardBody(): CardElement[] {
    const cardBodyToConstruct: CardElement[] = [];

    const headerTextBlock = new TextBlock(TextString.AskAnExpertTitleText);
    headerTextBlock.weight = TextWeight.Bolder;
    headerTextBlock.wrap = true;
    headerTextBlock.size = TextSize.Large;
    cardBodyToConstruct.push(headerTextBlock);

    const subTitleTextBlock = new TextBlock(TextString.AskAnExpertSubheaderText);
    subTitleTextBlock.wrap = true;
    cardBodyToConstruct.push(subTitleTextBlock);

    const titleRequiredTextBlock = new TextBlock(TextString.TitleRequiredText);
    titleRequiredTextBlock.wrap = true;
    cardBodyToConstruct.push(titleRequiredTextBlock);

    const titleTextInput = new TextInput();
    titleTextInput.id = "Title";
    titleTextInput.placeholder = TextString.ShowCardTitleText;
    titleTextInput.isMultiline = false;
    titleTextInput.spacing = Spacing.Small;
    cardBodyToConstruct.push(titleTextInput);

    const descriptionTextBlock = new TextBlock("Description");
    descriptionTextBlock.wrap = true;
    cardBodyToConstruct.push(descriptionTextBlock);

    const descriptionTextInput = new TextInput();
    descriptionTextInput.id = "Description";
    descriptionTextInput.placeholder = "Type your detailed question and supporting details here (500 characters max)";
    descriptionTextInput.isMultiline = true;
    descriptionTextInput.spacing = Spacing.Small;
    cardBodyToConstruct.push(descriptionTextInput);

    return cardBodyToConstruct;
}

function buildListOfActions(userQuestion: string, answer: string): Action[] {
    const action = new SubmitAction();
    action.title = TextString.AskAnExpertButtonText;
    action.data = {
        msteams: {
            type: ActionTypes.MessageBack,
            displayText: TextString.AskAnExpertDisplayText,
            text: Constants.AskAnExpertSubmitText
        },
        UserQuestion: userQuestion,
        KnowledgeBaseAnswer: answer
    } as AskAnExpertCardPayload;

    return [action];
}

export async function askAnExpertSubmitText(message: Activity, turnContext: TurnContext): Promise<TicketEntity>
{
    let askAnExpertSubmitTextPayload = message.value as AskAnExpertCardPayload;

    // Validate required fields.
    if (!askAnExpertSubmitTextPayload?.Title)
    {
        var updateCardActivity: Activity = turnContext.activity;
        updateCardActivity.type = ActivityTypes.Message;
        updateCardActivity.id = turnContext.activity.replyToId;
        updateCardActivity.conversation = turnContext.activity.conversation;
        updateCardActivity.attachments = [getAskAnExpertCard(askAnExpertSubmitTextPayload)];

        await turnContext.updateActivity(updateCardActivity);
        return null;
    }

    var userDetails: TeamsChannelAccount = await getUserDetailsInPersonalChatAsync(turnContext);
    return await createTicketAsync(message, askAnExpertSubmitTextPayload, userDetails);
}

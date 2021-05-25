// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  Action,
  AdaptiveCard,
  CardElement,
  TextWeight,
  HorizontalAlignment,
  TextColor,
  Version,
  TextBlock,
  TextSize,
  Spacing,
  TextInput,
  SubmitAction,
  ColumnSet,
  Column,
  ColumnWidth,
} from "adaptivecards";
import { AskAnExpertCardPayload } from "../models/askAnExpertCardPayload";
import { ActionTypes, Attachment, CardFactory } from "botbuilder";
import { TextString, Constants } from "../common/constants";

/**
 * This method will construct the card for ask an expert, when invoked from the bot menu.
 * @param payload Payload from the ask an expert card.
 */
export function getAskAnExpertCard(
  payload?: AskAnExpertCardPayload,
  showValidationErrors: boolean = false
): Attachment {
  const askAnExpertCard = new AdaptiveCard();
  askAnExpertCard.version = new Version(1, 0);

  const cardBody = buildAskAnExpertCardBody(payload, showValidationErrors);
  for (let i = 0; i < cardBody.length; i++) {
    askAnExpertCard.addItem(cardBody[i]);
  }

  const cardAction = buildListOfActions(
    payload?.UserQuestion,
    payload?.KnowledgeBaseAnswer
  );
  for (let i = 0; i < cardAction.length; i++) {
    askAnExpertCard.addAction(cardAction[i]);
  }

  return CardFactory.adaptiveCard(askAnExpertCard);
}

function buildAskAnExpertCardBody(
  payload: AskAnExpertCardPayload,
  showValidationErrors: boolean
): CardElement[] {
  const cardBodyToConstruct: CardElement[] = [];

  const headerTextBlock = new TextBlock(TextString.AskAnExpertTitleText);
  headerTextBlock.weight = TextWeight.Bolder;
  headerTextBlock.wrap = true;
  headerTextBlock.size = TextSize.Large;
  cardBodyToConstruct.push(headerTextBlock);

  const subTitleTextBlock = new TextBlock(TextString.AskAnExpertSubheaderText);
  subTitleTextBlock.wrap = true;
  cardBodyToConstruct.push(subTitleTextBlock);

  const titleColumn = new ColumnSet();
  const titleRequiredColumn = new Column();
  titleRequiredColumn.width = "auto" as ColumnWidth;
  const titleRequiredTextBlock = new TextBlock(TextString.TitleRequiredText);
  titleRequiredTextBlock.wrap = true;
  titleRequiredColumn.addItem(titleRequiredTextBlock);
  titleColumn.addColumn(titleRequiredColumn);
  const validateTitleColumn = new Column();
  const validateTitleTextBlock = new TextBlock();
  validateTitleTextBlock.text =
    showValidationErrors && !payload.Title
      ? TextString.MandatoryTitleFieldText
      : "";
  validateTitleTextBlock.color = TextColor.Attention;
  validateTitleTextBlock.horizontalAlignment = HorizontalAlignment.Right;
  validateTitleTextBlock.wrap = true;
  validateTitleColumn.addItem(validateTitleTextBlock);
  titleColumn.addColumn(validateTitleColumn);
  cardBodyToConstruct.push(titleColumn);


  const titleTextInput = new TextInput();
  titleTextInput.id = "Title";
  titleTextInput.placeholder = TextString.ShowCardTitleText;
  titleTextInput.isMultiline = false;
  titleTextInput.spacing = Spacing.Small;
  titleTextInput.defaultValue = payload.Title;
  cardBodyToConstruct.push(titleTextInput);

  const descriptionTextBlock = new TextBlock("Description");
  descriptionTextBlock.wrap = true;
  cardBodyToConstruct.push(descriptionTextBlock);

  const descriptionTextInput = new TextInput();
  descriptionTextInput.id = "Description";
  descriptionTextInput.placeholder =
    "Type your detailed question and supporting details here (500 characters max)";
  descriptionTextInput.isMultiline = true;
  descriptionTextInput.spacing = Spacing.Small;
  descriptionTextInput.defaultValue = payload.Description;
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
      text: Constants.AskAnExpertSubmitText,
    },
    UserQuestion: userQuestion,
    KnowledgeBaseAnswer: answer,
  } as AskAnExpertCardPayload;

  return [action];
}

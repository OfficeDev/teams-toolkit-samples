// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  Action,
  AdaptiveCard,
  CardElement,
  TextWeight,
  Version,
  TextBlock,
  FactSet,
  Fact,
  TextSize,
  OpenUrlAction,
  ShowCardAction,
  ChoiceSetInput,
  Choice,
  SubmitAction,
} from "adaptivecards";
import { Attachment, CardFactory } from "botbuilder";
import { TextString } from "../common/constants";
import { TicketEntity } from "../models/ticketEntity";
import {
  getFormattedDateInUserTimeZone,
  getTicketDisplayStatusForSme,
  KnowledgeBaseAnswerMaxDisplayLength,
  truncateStringIfLonger,
} from "../common/adaptiveHelper";
import { TicketState } from "../models/ticketState";
import { ChangeTicketStatusPayload } from "../models/changeTicketStatusPayload";

/**
 * Gets the SME ticket card used fot both in place card update activity within SME channel
 * when changing the ticket status and notification card when bot posts user question to SME channel.
 * @param ticket The ticket model with the latest details.
 * @param localTimestamp Local timestamp of the user activity.
 * @returns Returns the attachment that will be sent in a message.
 */
export function getSmeTicketCard(
  ticket: TicketEntity,
  localTimestamp?: Date
): Attachment {
  const card = new AdaptiveCard();
  card.version = new Version(1, 0);

  const cardBody = buildCardBody(ticket, localTimestamp);
  for (let i = 0; i < cardBody.length; i++) {
    card.addItem(cardBody[i]);
  }

  const cardAction = buildListOfActions(ticket);
  for (let i = 0; i < cardAction.length; i++) {
    card.addAction(cardAction[i]);
  }

  return CardFactory.adaptiveCard(card);
}

function buildCardBody(
  ticket: TicketEntity,
  localTimestamp?: Date
): CardElement[] {
  const cardBodyToConstruct: CardElement[] = [];

  const titleTextBlock = new TextBlock(ticket.Title);
  titleTextBlock.size = TextSize.Large;
  titleTextBlock.weight = TextWeight.Bolder;
  titleTextBlock.wrap = true;
  cardBodyToConstruct.push(titleTextBlock);

  const subHeaderBlock = new TextBlock(
    ticket.RequesterName + " is requesting support."
  );
  subHeaderBlock.wrap = true;
  cardBodyToConstruct.push(subHeaderBlock);

  const factSet = new FactSet();
  factSet.facts = buildFactSet(ticket, localTimestamp);
  cardBodyToConstruct.push(factSet);

  return cardBodyToConstruct;
}

function buildFactSet(ticket: TicketEntity, localTimestamp?: Date): Fact[] {
  let factList: Fact[] = [];

  if (ticket.Description) {
    factList.push(new Fact(TextString.DescriptionFact, ticket.Description));
  }

  if (ticket.UserQuestion) {
    factList.push(
      new Fact(TextString.QuestionAskedFactTitle, ticket.UserQuestion)
    );
  }

  factList.push(
    new Fact(TextString.StatusFactTitle, getTicketDisplayStatusForSme(ticket))
  );

  if (ticket.Status == TicketState.Closed) {
    factList.push(
      new Fact(
        TextString.ClosedFactTitle,
        getFormattedDateInUserTimeZone(ticket.DateClosed, localTimestamp)
      )
    );
  }

  return factList;
}

function buildListOfActions(ticket: TicketEntity): Action[] {
  let actionList: Action[] = [];

  const chatWithUserAction = new OpenUrlAction();
  chatWithUserAction.title = TextString.ChatTextButton + ticket.RequesterGivenName;
  const encodedMessage = encodeURIComponent(
    TextString.SMEUserChatMessage + ticket.Title
  );
  chatWithUserAction.url = `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(
    ticket.RequesterUserPrincipalName
  )}&message=${encodedMessage}`;
  actionList.push(chatWithUserAction);

  const changeStatusAction = new ShowCardAction();
  changeStatusAction.title = TextString.ChangeStatusButtonText;
  changeStatusAction.card.version = new Version(1, 0);
  const cardBody: ChoiceSetInput = getAdaptiveChoiceSetInput(ticket);
  changeStatusAction.card.addItem(cardBody);
  const submitAction = new SubmitAction();
  submitAction.data = {
    ticketId: ticket.TicketId,
  } as ChangeTicketStatusPayload;
  changeStatusAction.card.addAction(submitAction);
  actionList.push(changeStatusAction);

  if (ticket.KnowledgeBaseAnswer) {
    const viewArticleAction = new ShowCardAction();
    viewArticleAction.title = TextString.ViewArticleButtonText;
    viewArticleAction.card.version = new Version(1, 0);
    const answerTextBlock = new TextBlock(
      truncateStringIfLonger(
        ticket.KnowledgeBaseAnswer,
        KnowledgeBaseAnswerMaxDisplayLength
      )
    );
    answerTextBlock.wrap = true;
    viewArticleAction.card.addItem(answerTextBlock);
    actionList.push(viewArticleAction);
  }

  return actionList;
}

function getAdaptiveChoiceSetInput(ticket: TicketEntity): ChoiceSetInput {
  let choiceSet = new ChoiceSetInput();
  choiceSet.id = "Action";
  choiceSet.isMultiSelect = false;
  choiceSet.style = "compact";

  if (ticket.Status === TicketState.Open) {
    if (!ticket.isAssigned()) {
      choiceSet.defaultValue = ChangeTicketStatusPayload.assignToSelfAction;
      const choices: Choice[] = [];
      choices.push(
        new Choice(
          TextString.AssignToMeActionChoiceTitle,
          ChangeTicketStatusPayload.assignToSelfAction
        )
      );
      choices.push(
        new Choice(
          TextString.CloseActionChoiceTitle,
          ChangeTicketStatusPayload.closeAction
        )
      );
      choiceSet.choices = choices;
    } else {
      choiceSet.defaultValue = ChangeTicketStatusPayload.closeAction;
      const choices: Choice[] = [];
      choices.push(
        new Choice(
          TextString.UnassignActionChoiceTitle,
          ChangeTicketStatusPayload.reopenAction
        )
      );
      choices.push(
        new Choice(
          TextString.AssignToMeActionChoiceTitle,
          ChangeTicketStatusPayload.assignToSelfAction
        )
      );
      choices.push(
        new Choice(
          TextString.CloseActionChoiceTitle,
          ChangeTicketStatusPayload.closeAction
        )
      );
      choiceSet.choices = choices;
    }
  } else if (ticket.Status === TicketState.Closed) {
    choiceSet.defaultValue = ChangeTicketStatusPayload.reopenAction;
    const choices: Choice[] = [];
    choices.push(
      new Choice(
        TextString.ReopenActionChoiceTitle,
        ChangeTicketStatusPayload.reopenAction
      )
    );
    choices.push(
      new Choice(
        TextString.ReopenAssignToMeActionChoiceTitle,
        ChangeTicketStatusPayload.assignToSelfAction
      )
    );
    choiceSet.choices = choices;
  }

  return choiceSet;
}

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  Action,
  AdaptiveCard,
  CardElement,
  Version,
  TextBlock,
  SubmitAction,
  FactSet,
  Fact,
} from "adaptivecards";
import { AskAnExpertCardPayload } from "../models/askAnExpertCardPayload";
import { ActionTypes, Attachment, CardFactory } from "botbuilder";
import { TextString, Constants } from "../common/constants";
import { TicketEntity } from "../models/ticketEntity";
import {
  DescriptionMaxDisplayLength,
  getFormattedDateInUserTimeZone,
  getUserTicketDisplayStatus,
  TitleMaxDisplayLength,
  truncateStringIfLonger,
} from "../common/adaptiveHelper";
import { TicketState } from "../models/ticketState";

/**
 * Gets a user notification card for the ticket.
 * @param ticket The ticket to create a card from.
 * @param message The status message to add to the card.
 * @param activityLocalTimestamp Local time stamp of user activity.
 * @return An adaptive card as an attachment.
 */
export function getUserNotificationCard(
  ticket: TicketEntity,
  message: string,
  activityLocalTimestamp?: Date
): Attachment {
  const card = new AdaptiveCard();
  card.version = new Version(1, 0);

  const cardBody = buildCardBody(ticket, message, activityLocalTimestamp);
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
  message: string,
  activityLocalTimestamp?: Date
): CardElement[] {
  const cardBodyToConstruct: CardElement[] = [];

  const textBlock = new TextBlock(message);
  textBlock.wrap = true;
  cardBodyToConstruct.push(textBlock);

  const factSet = new FactSet();
  factSet.facts = buildFactSet(ticket, activityLocalTimestamp);
  cardBodyToConstruct.push(factSet);

  return cardBodyToConstruct;
}

function buildFactSet(ticket: TicketEntity, activityLocalTimestamp?: Date): Fact[] {
  const factList: Fact[] = [];
  factList.push(new Fact(TextString.StatusFactTitle, getUserTicketDisplayStatus(ticket)));
  factList.push(
    new Fact(TextString.TitleFact, truncateStringIfLonger(ticket.Title, TitleMaxDisplayLength))
  );

  if (ticket.Description) {
    factList.push(
      new Fact(
        TextString.DescriptionFact,
        truncateStringIfLonger(ticket.Description, DescriptionMaxDisplayLength)
      )
    );
  }

  factList.push(
    new Fact(
      TextString.DateCreatedDisplayFactTitle,
      getFormattedDateInUserTimeZone(ticket.DateCreated, activityLocalTimestamp)
    )
  );

  if (ticket.Status == TicketState.Closed) {
    factList.push(
      new Fact(
        TextString.ClosedFactTitle,
        getFormattedDateInUserTimeZone(ticket.DateClosed, activityLocalTimestamp)
      )
    );
  }

  return factList;
}

function buildListOfActions(ticket: TicketEntity): Action[] {
  if (ticket.Status === TicketState.Closed) {
    const action = new SubmitAction();
    action.title = TextString.AskAnExpertButtonText;
    action.data = {
      msteams: {
        type: ActionTypes.MessageBack,
        displayText: TextString.AskAnExpertDisplayText,
        text: Constants.AskAnExpertSubmitText,
      },
    } as AskAnExpertCardPayload;

    return [action];
  }

  return [];
}

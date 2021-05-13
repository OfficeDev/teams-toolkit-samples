// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BotFrameworkAdapter, TurnContext, Activity } from "botbuilder";
import { AskAnExpertCardPayload } from "../models/askAnExpertCardPayload";
import { TicketEntity } from "../models/ticketEntity";
import { TicketState } from "../models/ticketState";
import { v4 as uuidv4 } from "uuid";
import { TicketsProvider } from "../providers/ticketsProvider";
import { ActivityTypes, TeamsChannelAccount } from "botframework-schema";
import { getAskAnExpertCard } from "../cards/askAnExpertCard";
import { TextString } from "./constants";

export async function askAnExpertSubmitText(
  message: Activity,
  turnContext: TurnContext,
  ticketsProvider: TicketsProvider
): Promise<TicketEntity> {
  let askAnExpertSubmitTextPayload = message.value as AskAnExpertCardPayload;

  // Validate required fields.
  if (!askAnExpertSubmitTextPayload?.Title) {
    var updateCardActivity = {
      type: ActivityTypes.Message,
      id: turnContext.activity.replyToId,
      conversation: turnContext.activity.conversation,
      attachments: [getAskAnExpertCard(askAnExpertSubmitTextPayload)],
    } as Activity;

    try {
      await turnContext.updateActivity(updateCardActivity);
    } catch (e) {
      console.log("[debug]" + e);
    }
    return null;
  }

  var userDetails: TeamsChannelAccount = await getUserDetailsInPersonalChatAsync(
    turnContext
  );
  return await createTicketAsync(
    message,
    askAnExpertSubmitTextPayload,
    userDetails,
    ticketsProvider
  );
}

export async function getUserDetailsInPersonalChatAsync(
  turnContext: TurnContext
): Promise<TeamsChannelAccount> {
  let members = await (turnContext.adapter as BotFrameworkAdapter).getConversationMembers(
    turnContext
  );
  return members[0] as TeamsChannelAccount;
}

export async function createTicketAsync(
  message: Activity,
  data: AskAnExpertCardPayload,
  member: TeamsChannelAccount,
  ticketsProvider: TicketsProvider
): Promise<TicketEntity> {
  let ticketEntity: TicketEntity = new TicketEntity();
  ticketEntity.TicketId = uuidv4();
  ticketEntity.Status = TicketState.Open;
  ticketEntity.DateCreated = new Date();
  ticketEntity.Title = data.Title;
  ticketEntity.Description = data.Description;
  ticketEntity.RequesterName = member.name;
  ticketEntity.RequesterGivenName = member.givenName;
  ticketEntity.RequesterUserPrincipalName = member.userPrincipalName;
  ticketEntity.RequesterConversationId = message.conversation.id;
  ticketEntity.LastModifiedByName = message.from.name;
  ticketEntity.LastModifiedByObjectId = message.from.aadObjectId;
  ticketEntity.UserQuestion = data.UserQuestion;
  ticketEntity.KnowledgeBaseAnswer = data.KnowledgeBaseAnswer;

  await ticketsProvider.upsertTicket(ticketEntity);

  return ticketEntity;
}

export function getTicketDisplayStatusForSme(ticket: TicketEntity) {
  if (ticket?.Status == TicketState.Open) {
    return ticket.isAssigned
      ? TextString.SMETicketAssignedStatus + ticket?.AssignedToName
      : TextString.SMETicketUnassignedStatus;
  } else {
    return TextString.SMETicketClosedStatus;
  }
}

export function getFormattedDateInUserTimeZone(
  dateTime: Date,
  userLocalTime?: Date
): string {
  // todo
  return dateTime.toString();
}

export const TitleMaxDisplayLength: number = 50;
export const DescriptionMaxDisplayLength: number = 500;
export const KnowledgeBaseAnswerMaxDisplayLength: number = 500;
const Ellipsis: string = "...";
export function truncateStringIfLonger(text: string, maxLength: number) {
  if (text && text.length > maxLength) {
    text = text.substr(0, maxLength) + Ellipsis;
  }
  return text;
}

export function getUserTicketDisplayStatus(ticket: TicketEntity) {
  if (ticket?.Status == TicketState.Open) {
    return ticket.isAssigned
      ? TextString.AssignedUserNotificationStatus
      : TextString.UnassignedUserNotificationStatus;
  } else {
    return TextString.ClosedUserNotificationStatus;
  }
}

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

/**
 * Helps to get the expert submit card.
 * @param message A message in a conversation.
 * @param turnContext Context object containing information cached for a single turn of conversation with a user.
 * @param ticketsProvider Tickets Provider.
 * @returns Ticket entity promise
 */
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
      attachments: [getAskAnExpertCard(askAnExpertSubmitTextPayload, true)],
    } as Activity;

    await turnContext.updateActivity(updateCardActivity);
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

/**
 * Get the account details of the user in a 1:1 chat with the bot.
 * @param turnContext Context object containing information cached for a single turn of conversation with a user.
 * @returns The user account promise
 */
export async function getUserDetailsInPersonalChatAsync(
  turnContext: TurnContext
): Promise<TeamsChannelAccount> {
  let members = await (turnContext.adapter as BotFrameworkAdapter).getConversationMembers(
    turnContext
  );
  return members[0] as TeamsChannelAccount;
}

/**
 * Create a new ticket from the input.
 * @param message A message in a conversation.
 * @param data Represents the submit data associated with the Ask An Expert card.
 * @param member Teams channel account detailing user Azure Active Directory details.
 * @param ticketsProvider Tickets Provider.
 * @returns Ticket entity promise
 */
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

/**
 * Gets the current status of the ticket to display in the SME team.
 * @param ticket The current ticket information.
 * @returns A status string.
 */
export function getTicketDisplayStatusForSme(ticket: TicketEntity): string {
  if (ticket?.Status == TicketState.Open) {
    return ticket.isAssigned()
      ? TextString.SMETicketAssignedStatus + ticket?.AssignedToName
      : TextString.SMETicketUnassignedStatus;
  } else {
    return TextString.SMETicketClosedStatus;
  }
}

/**
 * Returns a string that will display the given date and time in the user's local time zone, when placed in an adaptive card.
 * @param dateTime The date and time to format.
 * @param userLocalTime The sender's local time, as determined by the local timestamp of the activity.
 * @returns A datetime string.
 */
export function getFormattedDateInUserTimeZone(dateTime: Date, userLocalTime?: Date): string {
  if (userLocalTime) {
    const offset = userLocalTime.getTimezoneOffset();
    dateTime= new Date(dateTime.getTime() + offset);
  }
  return dateTime.toLocaleDateString();
}

export const TitleMaxDisplayLength: number = 50;
export const DescriptionMaxDisplayLength: number = 500;
export const KnowledgeBaseAnswerMaxDisplayLength: number = 500;
const Ellipsis: string = "...";

/**
 * Truncate the provided string to a given maximum length.
 * @param text Text to be truncated.
 * @param maxLength The maximum length in characters of the text.
 * @returns Truncated string.
 */
export function truncateStringIfLonger(
  text: string,
  maxLength: number
): string {
  if (text && text.length > maxLength) {
    text = text.substr(0, maxLength) + Ellipsis;
  }
  return text;
}

/**
 * Gets the ticket status for the user notifications.
 * @param ticket The current ticket information.
 * @returns A status string.
 */
export function getUserTicketDisplayStatus(ticket: TicketEntity): string {
  if (ticket?.Status == TicketState.Open) {
    return ticket.isAssigned()
      ? TextString.AssignedUserNotificationStatus
      : TextString.UnassignedUserNotificationStatus;
  } else {
    return TextString.ClosedUserNotificationStatus;
  }
}

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BotFrameworkAdapter, TurnContext, Activity } from "botbuilder";
import { TeamsChannelAccount } from "botframework-schema";
import { AskAnExpertCardPayload } from "../models/askAnExpertCardPayload";
import { TicketEntity } from "../models/ticketEntity";
import { TicketState } from "../models/ticketState";
import {v4 as uuidv4} from 'uuid';

export async function getUserDetailsInPersonalChatAsync(turnContext: TurnContext): Promise<TeamsChannelAccount> {
    let members = await (turnContext.adapter as BotFrameworkAdapter).getConversationMembers(turnContext);
    return members[0] as TeamsChannelAccount;
}

export async function createTicketAsync(message: Activity, data: AskAnExpertCardPayload, member: TeamsChannelAccount): Promise<TicketEntity> {
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

    console.log("todo: upsert ticket");

    return ticketEntity;
}
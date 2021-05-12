import { BotFrameworkAdapter, TurnContext, Activity } from "botbuilder";
import { TeamsChannelAccount } from "botframework-schema";
import { AskAnExpertCardPayload } from "../models/askAnExpertCardPayload";
import { TicketEntity } from "../models/ticketEntity";
import { TicketState } from "../models/ticketState";
import {v4 as uuidv4} from 'uuid';

export async function GetUserDetailsInPersonalChatAsync(turnContext: TurnContext): Promise<TeamsChannelAccount> {
    let members = await (turnContext.adapter as BotFrameworkAdapter).getConversationMembers(turnContext);
    return members[0] as TeamsChannelAccount;
}

export async function CreateTicketAsync(message: Activity, data: AskAnExpertCardPayload, member: TeamsChannelAccount): Promise<TicketEntity> {
    let ticketEntity: TicketEntity = {
        TicketId: uuidv4(),
        Status: TicketState.Open as number,
        DateCreated: new Date(),
        Title: data.Title,
        Description: data.Description,
        RequesterName: member.name,
        RequesterUserPrincipalName: member.userPrincipalName,
        RequesterGivenName: member.givenName,
        RequesterConversationId: message.conversation.id,
        LastModifiedByName: message.from.name,
        LastModifiedByObjectId: message.from.aadObjectId,
        UserQuestion: data.UserQuestion,
        KnowledgeBaseAnswer: data.KnowledgeBaseAnswer,
        SmeCardActivityId: message.id,
        SmeThreadConversationId: message.conversation.id,
    }
    console.log("todo: upsert ticket");

    return ticketEntity;
}
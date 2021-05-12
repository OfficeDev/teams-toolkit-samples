// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TeamsActivityHandler, ActionTypes, CardFactory, BotState, TurnContext, Activity, MessageFactory } from "botbuilder";
import { ActivityTypes } from "botframework-schema";
import { QnADTO, QnASearchResultList } from "@azure/cognitiveservices-qnamaker-runtime/esm/models";
import { ResponseCardPayload } from "./models/responseCardPayload";
import { AnswerModel } from "./models/answerModel";
import { QnaServiceProvider } from "./providers/qnaServiceProvider";
import { getResponseCard } from "./cards/responseCard";

export class TeamsBot extends TeamsActivityHandler {
    private readonly conversationTypePersonal: string = "personal";
    private readonly changeStatus: string = "change status";
    private readonly qnaServiceProvider: QnaServiceProvider;

    /**
     *
     * @param {QnaServiceProvider} qnaServiceProvider
     */
    constructor(qnaServiceProvider: QnaServiceProvider) {
        super();

        this.qnaServiceProvider = qnaServiceProvider;

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id) {
                    const cardButtons = [{ type: ActionTypes.ImBack, title: 'Show introduction card', value: 'intro' }];
                    const card = CardFactory.heroCard(
                        'Welcome',
                        null,
                        cardButtons,
                        {
                            text: `Congratulations! Your hello world Bot 
                            template is running. This bot will introduce you how to build bot using Microsoft Teams App Framework(TeamsFx). 
                            You can reply <strong>intro</strong> to see the introduction card. TeamsFx helps you build Bot using <a href=\"https://dev.botframework.com/\">Bot Framework SDK</a>`
                        });
                    await context.sendActivity({ attachments: [card] });
                    break;
                }
            }
            await next();
        });
    }

    async onMessageActivity(turnContext: TurnContext): Promise<void> {
        try {
            const message = turnContext.activity;
            console.log(`from: ${message.from?.id}, conversation: ${message.conversation.id}, replyToId: ${message.replyToId}`);
            await this.sendTypingIndicatorAsync(turnContext);

            switch (message.conversation.conversationType.toLowerCase()) {
                case this.conversationTypePersonal:
                    await this.onMessageActivityInPersonalChat(message, turnContext);
                    break;
                default:
                    console.log(`Received unexpected conversationType ${message.conversation.conversationType}`);
                    break;
            }
        } catch (error) {
            await turnContext.sendActivity("");
            console.log(`Error processing message: ${error.message}`);
            throw error;
        }
    }

    private async onMessageActivityInPersonalChat(message: Activity, turnContext: TurnContext): Promise<void> {
        console.log("Sending input to QnAMaker");
        await this.getQuestionAnswerReply(turnContext, message);
    }

    private async onMessageActivityInChannel(message: Activity, turnContext: TurnContext): Promise<void> {
        let text: string;

        // Check if the incoming request is for updating the ticket status
        if (message.replyToId && message.value
            && message.value.ticketId) {
            text = this.changeStatus
        } else {
            text = message.text?.toLowerCase()?.trim() ?? "";
        }

        try {
            switch (text) {
                case this.changeStatus:
                    console.log(`Card submit in channel ${JSON.stringify(message.value)}`)
                    // TODO: implement
                    return;
                default:
                    console.log("Unrecognized input in channel");
                    break;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private async getQuestionAnswerReply(turnContext: TurnContext, message: Activity): Promise<void> {
        const text = message.text?.toLowerCase()?.trim() ?? "";

        try {
            let queryResult: QnASearchResultList;
            let payload: ResponseCardPayload;

            if (message?.replyToId && message?.value) {
                payload = message.value as ResponseCardPayload;
            }

            let previousQuestion: QnADTO;
            if (payload?.PreviousQuestions?.length > 0) {
                previousQuestion = payload.PreviousQuestions[0];
            }

            queryResult = await this.qnaServiceProvider.GenerateAnswer(
                text, false, previousQuestion?.id.toString(), previousQuestion?.questions[0]);

            if (queryResult?.answers[0].id != -1) {
                const answerData = queryResult.answers[0];
                let answerModel: AnswerModel;
                try {
                    answerModel = JSON.parse(answerData.answer) as AnswerModel;
                } catch {
                    // do nothing if result is not json format
                }

                await turnContext.sendActivity(MessageFactory.attachment(getResponseCard(answerData, text, payload)));

            } else {
                // nothing found
                await turnContext.sendActivity("TODO: show ask expert card");
            }
        } catch (error) {
            console.log(error);
        }
    }

    private async onAdaptiveCardSubmitInChannelAsync(message: Activity, turnContext: TurnContext): Promise<void> {
        
    }

    private async sendTypingIndicatorAsync(turnContext: TurnContext): Promise<void> {
        try {
            const typingActivity = this.createReply(turnContext.activity)
            typingActivity.type = ActivityTypes.Typing;
            await turnContext.sendActivity(typingActivity);
        } catch (error) {
            console.log(`Failed to send a typing indicator: ${error.message}`);
        }
    }

    private createReply(source: Activity, text?: string, locale?: string): Activity {
        const reply: string = text || '';

        return {
            channelId: source.channelId,
            conversation: source.conversation,
            from: source.recipient,
            label: source.label,
            locale: locale,
            callerId: source.callerId,
            recipient: source.from,
            replyToId: source.id,
            serviceUrl: source.serviceUrl,
            text: reply,
            timestamp: new Date(),
            type: ActivityTypes.Message,
            valueType: source.valueType,
            localTimezone: source.localTimezone,
            listenFor: source.listenFor,
            semanticAction: source.semanticAction
        };
    }
}

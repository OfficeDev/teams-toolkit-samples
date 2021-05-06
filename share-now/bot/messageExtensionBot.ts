// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { default as axios } from 'axios';
import * as querystring from 'querystring';
import { TeamsActivityHandler, CardFactory, TurnContext } from 'botbuilder';
import {
    loadConfiguration,
    DefaultTediousConnectionConfiguration
} from "teamsdev-client";
import * as tedious from "tedious";
export class MessageExtensionBot extends TeamsActivityHandler {

    // Action.
    public async handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: any): Promise<any> {
        switch (action.commandId) {
            case 'createCard':
                return createCardCommand(context, action);
            case 'shareMessage':
                return shareMessageCommand(context, action);
            default:
                throw new Error('NotImplemented');
        }
    }

    // Search.
    public async handleTeamsMessagingExtensionQuery(context: TurnContext, query: any): Promise<any> {
        loadConfiguration();

        const sqlConnectConfig = new DefaultTediousConnectionConfiguration();
        const config = await sqlConnectConfig.getConfig();
        const conn = new tedious.Connection(config);
        await connectSQL(conn);

        const searchQuery = query.parameters[0].value;
        let sqlQuery:string
        console.log(query.commandId);
        
        if (query.commandId === "allItems") {
            sqlQuery = `SELECT * FROM [dbo].[TeamPostEntity] where Title like '%${searchQuery}%' ORDER BY PostID DESC OFFSET 0 ROWS FETCH NEXT 8 ROWS ONLY;`;
        } else {
            const userID = context.activity.from.aadObjectId
            sqlQuery = `SELECT * FROM [dbo].[TeamPostEntity] where Title like '%${searchQuery}%' and UserID = '${userID}' ORDER BY PostID DESC OFFSET 0 ROWS FETCH NEXT 8 ROWS ONLY;`;
        }

        var result = await executeQuery(sqlQuery, conn);
        conn.close();

        // console.log(result);

        const attachments = [];
        result.forEach(post => {
            const heroCard = CardFactory.heroCard(post.Title, post.Description);
            const preview = CardFactory.heroCard(post.Title);
            preview.content.tap = {
                type: 'result', value: {
                    description: post.Description,
                    contentUrl: post.ContentUrl
                }
            };
            const attachment = { ...heroCard, preview };
            attachments.push(attachment);
        });

        return {
            composeExtension: {
                type: 'result',
                attachmentLayout: 'list',
                attachments: attachments
            }
        };
    }

    public async handleTeamsMessagingExtensionSelectItem(context: TurnContext, obj: any): Promise<any> {
        return {
            composeExtension: {
                type: 'result',
                attachmentLayout: 'list',
                attachments: [CardFactory.thumbnailCard(obj.description)]
            }
        };
    }

    // Link Unfurling.
    public async handleTeamsAppBasedLinkQuery(context: TurnContext, query: any): Promise<any> {
        const attachment = CardFactory.thumbnailCard('Image Preview Card',
            query.url,
            [query.url]);

        const result = {
            attachmentLayout: 'list',
            type: 'result',
            attachments: [attachment]
        };

        const response = {
            composeExtension: result
        };
        return response;
    }
}

async function createCardCommand(context: TurnContext, action: any): Promise<any> {
    // The user has chosen to create a card by choosing the 'Create Card' context menu command.
    const data = action.data;
    const heroCard = CardFactory.heroCard(data.title, data.text);
    heroCard.content.subtitle = data.subTitle;
    const attachment = {
        contentType: heroCard.contentType,
        content: heroCard.content,
        preview: heroCard,
    };

    return {
        composeExtension: {
            type: 'result',
            attachmentLayout: 'list',
            attachments: [attachment]
        },
    };
}

async function shareMessageCommand(context: TurnContext, action: any): Promise<any> {
    // The user has chosen to share a message by choosing the 'Share Message' context menu command.
    let userName = 'unknown';
    if (action.messagePayload &&
        action.messagePayload.from &&
        action.messagePayload.from.user &&
        action.messagePayload.from.user.displayName) {
        userName = action.messagePayload.from.user.displayName;
    }

    // This Messaging Extension example allows the user to check a box to include an image with the
    // shared message.  This demonstrates sending custom parameters along with the message payload.
    let images = [];
    const includeImage = action.data.includeImage;
    if (includeImage === 'true') {
        images = [
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtB3AwMUeNoq4gUBGe6Ocj8kyh3bXa9ZbV7u1fVKQoyKFHdkqU',
        ];
    }
    const heroCard = CardFactory.heroCard(
        `${userName} originally sent this message:`,
        action.messagePayload.body.content,
        images
    );

    if (action.messagePayload &&
        action.messagePayload.attachment &&
        action.messagePayload.attachments.length > 0) {
        // This sample does not add the MessagePayload Attachments.  This is left as an
        // exercise for the user.
        heroCard.content.subtitle = `(${action.messagePayload.attachments.length} Attachments not included)`;
    }

    const attachment = {
        contentType: heroCard.contentType,
        content: heroCard.content,
        preview: heroCard
    };

    return {
        composeExtension: {
            type: 'result',
            attachmentLayout: 'list',
            attachments: [attachment]
        },
    };
}

async function connectSQL(connection) {
    return new Promise((resolve) => {
        connection.on("connect", (error) => {
            resolve(connection);
        });
    });
}

async function executeQuery(query, connection): Promise<any[]> {
    return new Promise((resolve) => {
        var res = [];
        const request = new tedious.Request(query, (err) => {
            if (err) {
                console.log(err);
            }
        });
        request.on("row", (columns) => {
            var row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            res.push(row);
        });
        request.on("requestCompleted", () => {
            resolve(res);
        });
        connection.execSql(request);
    });
}
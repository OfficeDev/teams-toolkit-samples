// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as querystring from 'querystring';
import { TeamsActivityHandler, CardFactory, TurnContext } from 'botbuilder';
import {
    loadConfiguration,
    DefaultTediousConnectionConfiguration
} from "teamsdev-client";
import * as tedious from "tedious";
import * as cards from "adaptivecards";
export class MessageExtensionBot extends TeamsActivityHandler {
    // Search.
    public async handleTeamsMessagingExtensionQuery(context: TurnContext, query: any): Promise<any> {
        loadConfiguration();

        const sqlConnectConfig = new DefaultTediousConnectionConfiguration();
        const config = await sqlConnectConfig.getConfig();
        const conn = new tedious.Connection(config);
        await connectSQL(conn);
        const searchQuery = query.parameters[0].value;
        let sqlQuery: string;

        if (query.commandId === "allItems") {
            sqlQuery = `SELECT * FROM [dbo].[TeamPostEntity] where Title like '%${searchQuery}%' ORDER BY PostID DESC OFFSET ${query.queryOptions.skip} ROWS FETCH NEXT ${query.queryOptions.count} ROWS ONLY;`;
        } else {
            const userID = context.activity.from.aadObjectId;
            sqlQuery = `SELECT * FROM [dbo].[TeamPostEntity] where Title like '%${searchQuery}%' and UserID = '${userID}' ORDER BY PostID DESC OFFSET ${query.queryOptions.skip} ROWS FETCH NEXT ${query.queryOptions.count} ROWS ONLY;`;
        }

        var result = await executeQuery(sqlQuery, conn);
        conn.close();
        console.log(123);

        const attachments = [];
        result.forEach(post => {
            const card = CardFactory.adaptiveCard(buildCardContent(post.Title, post.Description, post.ContentUrl));
            const icon = voteIcon();
            const nameString = post.CreatedByName.length < 25 ? htmlEscape(post.CreatedByName) : htmlEscape(post.CreatedByName.substr(0,24)) + " ..."
            const preview = CardFactory.thumbnailCard(
                `<p style='font-weight: 600;'>${post.Title}</p>`,
                `${nameString} | ${post.Type} | ${post.TotalVote} ${icon}`
            );
            const attachment = { ...card, preview };

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

function buildCardContent(title, description, contentUrl) {
    return {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
            {
                "type": "TextBlock",
                "text": `"${title}"`,
                "weight": "Bolder",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": `"${description}"`,
                "size": "Small",
                "wrap": true
            }
        ],
        "actions": [
            {
                "type": "Action.OpenUrl",
                "title": "OpenItem",
                "url": contentUrl
            }
        ]
    };
}

function htmlEscape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function voteIcon() {
    const src = "https://user-images.githubusercontent.com/16380704/117462230-04235b00-af81-11eb-8419-1565ebbdab36.png";
    return `<img src='${src}' alt='vote logo' width='15' height='16'`;
}


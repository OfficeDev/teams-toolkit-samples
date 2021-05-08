// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { TeamsActivityHandler, CardFactory, TurnContext } from 'botbuilder';
import {
    loadConfiguration,
    DefaultTediousConnectionConfiguration
} from "teamsdev-client";
import * as tedious from "tedious";
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

        const attachments = [];
        result.forEach(post => {
            const card = CardFactory.adaptiveCard(buildCardContent(post));

            const icon = voteIcon();
            const nameString = post.CreatedByName.length < 25 ? htmlEscape(post.CreatedByName) : htmlEscape(post.CreatedByName.substr(0, 24)) + " ...";
            const preview = CardFactory.thumbnailCard(
                `<p style='font-weight: 600;'>${post.Title}</p>`,
                `${nameString} | ${postName(post.Type)} | ${post.TotalVote} ${icon}`
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

function buildCardContent(post) {

    return {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
            {
                "type": "TextBlock",
                "text": post.Title,
                "weight": "Bolder",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": post.Description,
                "size": "Small",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": `**Created By**: ${post.CreatedByName}`,
                "size": "Small",
                "wrap": true
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "space": "small",
                        "width": "auto",
                        "items": [
                            {
                                "type": "Image",
                                "url": postDotSrc(post.Type),
                                "width": "10px",
                                "height": "10px",
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": "auto",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": postName(post.Type),
                                "weight": "Bolder"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": "auto",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": post.TotalVote
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "space": "small",
                        "width": "auto",
                        "items": [
                            {
                                "type": "Image",
                                "url": voteSrc(),
                                "width": "15px",
                                "height": "16px",
                            }
                        ]
                    }
                ]
            },
            {
                "type": "TextBlock",
                "text": `**Tags**: ${post.Tags.replace(/;/g, ',')}`,
                "size": "Small",
                "wrap": true
            },
        ],
        "actions": [
            {
                "type": "Action.OpenUrl",
                "title": "OpenItem",
                "url": post.ContentUrl
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

function voteSrc() {
    return "https://user-images.githubusercontent.com/16380704/117462230-04235b00-af81-11eb-8419-1565ebbdab36.png";
}

function voteIcon() {
    const src = voteSrc();
    return `<img src='${src}' alt='vote logo' width='15' height='16'`;
}

function postName(postType) {
    const postTypeNames = {
        1: "Article / blog",
        2: "Other",
        3: "Podcast",
        4: "Video",
        5: "Book"
    };
    return postTypeNames[postType];
}

function postDotSrc(postType) {
    const postDotSrcs = {
        1: "https://user-images.githubusercontent.com/16380704/117462298-1a311b80-af81-11eb-81a2-eb0c2843937c.png",
        2: "https://user-images.githubusercontent.com/16380704/117462456-477dc980-af81-11eb-8b9c-7a363e2b73c1.png",
        3: "https://user-images.githubusercontent.com/16380704/117462509-549ab880-af81-11eb-8201-113582a544f3.png",
        4: "https://user-images.githubusercontent.com/16380704/117462575-61b7a780-af81-11eb-8c8c-8f4cb33ed327.png",
        5: "https://user-images.githubusercontent.com/16380704/117462417-3cc33480-af81-11eb-9ac2-0f009eb2d194.png"
    };
    return postDotSrcs[postType];
}

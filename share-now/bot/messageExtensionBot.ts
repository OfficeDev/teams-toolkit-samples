// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { TeamsActivityHandler, CardFactory, TurnContext } from 'botbuilder';
import { executeQuery, getSQLConnection } from './utils/common';
export class MessageExtensionBot extends TeamsActivityHandler {
    constructor() {
        super();
    }
    // Search.
    public async handleTeamsMessagingExtensionQuery(context: TurnContext, query: any): Promise<any> {
        let connection;
        try {
            connection = await getSQLConnection();
            const searchItem = query.parameters[0].value;
            let sqlQuery: string;
            if (query.commandId === "allItems") {
                sqlQuery = buildQuery(searchItem, query.queryOptions.skip, query.queryOptions.count);
            } else {
                sqlQuery = buildQuery(searchItem, query.queryOptions.skip, query.queryOptions.count, context.activity.from.aadObjectId);
            }
            var result = await executeQuery(sqlQuery, connection);
            const attachments = [];
            result.forEach(post => {
                const card = CardFactory.adaptiveCard(buildCardContent(post));

                const icon = voteIcon();
                const nameString = post.CreatedByName.length < 25 ? htmlEscape(post.CreatedByName) : htmlEscape(post.CreatedByName.substr(0, 24)) + " ...";
                const preview = CardFactory.thumbnailCard(
                    `<p style='font-weight: 600;'>${post.Title}</p>`,
                    `${nameString} | ${postName[post.Type]} | ${post.TotalVotes} ${icon}`
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
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }
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
                                "url": postDotSrc[post.Type],
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
                                "text": postName[post.Type],
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
                                "text": post.TotalVotes
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

function buildQuery(search, skip, count, userID = "") {
    let userFilter = userID ? `and UserID = '${userID}'` : "";
    let sqlQuery = `SELECT * FROM [dbo].[TeamPostEntity] where IsRemoved = 0 and (Title like '%${search}%' or Tags like '%${search}%') ${userFilter} ORDER BY PostID DESC OFFSET ${skip} ROWS FETCH NEXT ${count} ROWS ONLY;`;
    return sqlQuery;
}

enum postName {
    "Article / blog" = 1,
    Other = 2,
    Podcast = 3,
    Video = 4,
    Book = 5,
}

enum postDotSrc {
    "https://user-images.githubusercontent.com/16380704/117462298-1a311b80-af81-11eb-81a2-eb0c2843937c.png" = 1,
    "https://user-images.githubusercontent.com/16380704/117462456-477dc980-af81-11eb-8b9c-7a363e2b73c1.png" = 2,
    "https://user-images.githubusercontent.com/16380704/117462509-549ab880-af81-11eb-8201-113582a544f3.png" = 3,
    "https://user-images.githubusercontent.com/16380704/117462575-61b7a780-af81-11eb-8c8c-8f4cb33ed327.png" = 4,
    "https://user-images.githubusercontent.com/16380704/117462417-3cc33480-af81-11eb-9ac2-0f009eb2d194.png" = 5,
}
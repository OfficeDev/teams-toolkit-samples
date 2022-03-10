// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import "isomorphic-fetch";
import { TeamsFx, getTediousConnectionConfig } from "@microsoft/teamsfx";
import * as tedious from "tedious";
export async function getSQLConnection() {
    const teamsfx = new TeamsFx();
    const config = await getTediousConnectionConfig(teamsfx);
    const connection = new tedious.Connection(config);
    return new Promise((resolve, reject) => {
        connection.on('connect', err => {
            if (err) {
                reject(err);
            }
            resolve(connection);
        });
        connection.on('debug', function (err) {
            console.log('debug:', err);
        });
    });
}

export async function executeQuery(query, connection): Promise<any[]> {
    return new Promise((resolve, reject) => {
        var res = [];
        const request = new tedious.Request(query, (err) => {
            if (err) {
                console.log(err);
                reject(err);
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
        request.on("error", (error: any) => {
            console.log(error);
            reject(error);
        });
        connection.execSql(request);
    });
}

export class ResponsePost {
    postId: number;
    type: number;
    title: string;
    description: string;
    contentUrl: string;
    tags: string;
    createdDate: Date;
    createdByName: string;
    userId: string;
    updatedDate: Date;
    totalVotes: number;
    isRemoved: boolean;
    isVotedByUser: boolean;
    isCurrentUserPost: boolean;
    constructor(post) {
        this.postId = post.PostID;
        this.type = post.Type;
        this.title = post.Title;
        this.description = post.Description;
        this.contentUrl = post.ContentUrl;
        this.tags = post.Tags;
        this.createdDate = post.CreatedDate;
        this.createdByName = post.CreatedByName;
        this.userId = post.UserID;
        this.updatedDate = post.UpdatedDate;
        this.totalVotes = post.TotalVotes;
        this.isRemoved = post.IsRemoved;
    }
}

export class PostRequest {
    type: number;
    title: string;
    description: string;
    contentUrl: string;
    tags: string;
}

export enum PostTypes {
    "Article / blog" = 1,
    Other = 2,
    Podcast = 3,
    Video = 4,
    Book = 5,
}

export enum LengthLimit {
    title = 100,
    description = 500,
    contentUrl = 400,
    tags = 100,
}
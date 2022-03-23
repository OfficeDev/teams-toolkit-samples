// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { getTediousConnectionConfig, TeamsFx } from "@microsoft/teamsfx";
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
                reject(err)
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
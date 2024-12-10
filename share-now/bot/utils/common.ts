// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as tedious from "tedious";
export async function getSQLConnection() {
    const config = {
        server: process.env.SQL_ENDPOINT,
        authentication: {
            type: "default",
            options: {
                userName: process.env.SQL_USER_NAME,
                password: process.env.SQL_PASSWORD,
            },
        },
        options: {
            database: process.env.SQL_DATABASE_NAME,
            encrypt: true,
        },
    };
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
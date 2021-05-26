// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TableService, createTableService } from 'azure-storage';
import { TicketEntity } from '../models/ticketEntity';
import { TicketState } from "../models/ticketState";

export class TicketsProvider {
    private readonly partitionKey: string = "TicketInfo";
    private readonly ticketTableName: string = "Tickets";

    private readonly connectionString: string;
    private tableService: TableService;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    public async upsertTicket(ticket: TicketEntity): Promise<void> {
        ticket.PartitionKey = this.partitionKey;
        ticket.RowKey = ticket.TicketId;

        if (ticket.Status > TicketState.MaxValue) {
            throw new Error(`The ticket status (${ticket.Status}) is not valid.`);
        }

        await this.storeOrUpdateTicketEntity(ticket);
    }

    public async getTicket(ticketId: string): Promise<TicketEntity> {
        await this.ensureInitialize();
        if (!ticketId) {
            return null;
        }

        return new Promise((resolve, reject) => {
            this.tableService.retrieveEntity(this.ticketTableName, this.partitionKey,
                ticketId, (error, result: any) => {
                    if (error) {
                        reject(error);
                    }
                    let ticket = new TicketEntity();
                    const props = Object.keys(result);
                    props.forEach((key)=>{
                        ticket[key] = result[key]._;
                    })
                    resolve(ticket);
                });
        })
    }

    private async storeOrUpdateTicketEntity(entity: TicketEntity): Promise<void> {
        await this.ensureInitialize();

        return new Promise((resolve, rejcet) => {
            this.tableService.insertOrReplaceEntity(this.ticketTableName, entity,
                (error, result, response) => {
                    if (!error) {
                        resolve();
                    }
                    rejcet(error);
                });
        })
    }

    private async ensureInitialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.tableService) {
                resolve();
            } else {
                this.tableService = createTableService(this.connectionString);
                this.tableService.createTableIfNotExists(this.ticketTableName, (error, result, response) => {
                    if (!error) {
                        resolve();
                    }
                    reject(error);
                })
            };
        })
    }
}
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export class ChangeTicketStatusPayload {
    public static readonly reopenAction: string = "Reopen";
    public static readonly closeAction: string = "Close";
    public static readonly assignToSelfAction: string = "AssignToSelf";

    public ticketId: string;
    public action: string;
}
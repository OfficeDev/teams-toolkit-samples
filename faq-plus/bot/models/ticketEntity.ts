// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TicketState } from "./ticketState";

export class TicketEntity {
  public PartitionKey: string;
  public RowKey: string;
  public TicketId: string;
  public Status: number;
  public Title: string;
  public Description: string;
  public DateCreated: Date;
  public RequesterName: string;
  public RequesterUserPrincipalName: string;
  public RequesterGivenName: string;
  public RequesterConversationId: string;
  public SmeCardActivityId: string;
  public SmeThreadConversationId: string;
  public DateAssigned: Date;
  public AssignedToName: string;
  public AssignedToObjectId: string;
  public DateClosed: Date;
  public LastModifiedByName: string;
  public LastModifiedByObjectId: string;
  public UserQuestion: string;
  public KnowledgeBaseAnswer: string;
  public Timestamp: Date;

  public isAssigned(): boolean {
    if (this.AssignedToObjectId && this.Status === TicketState.Open) {
      return true;
    }
    return false;
  }
}

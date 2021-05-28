// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Represents the data payload of Action.Submit to change the status of a ticket.
 */
export class ChangeTicketStatusPayload {
  /**
   * Action that reopens a closed ticket.
   */
  public static readonly reopenAction: string = "Reopen";

  /**
   * Action that closes a ticket.
   */
  public static readonly closeAction: string = "Close";

  /**
   * Action that assigns a ticket to the person that performed the action.
   */
  public static readonly assignToSelfAction: string = "AssignToSelf";

  /**
   * The ticket id.
   */
  public ticketId: string;

  /**
   * The action to perform on the ticket.
   */
  public action?: string;
}

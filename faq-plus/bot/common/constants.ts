// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export enum Constants {
    AskAnExpert = "ask an expert",
    AskAnExpertSubmitText = "QuestionForExpert"
}

export enum TextString {
    // Ask an expert card
    AskAnExpertButtonText = "Ask an expert",    // Action button which invokes ask an expert show card.
    AskAnExpertDisplayText = "Ask an expert",   // Ask an expert display text: text sent to the bot when ask an expert button is clicked.
    AskAnExpertTitleText = "Ask an expert", // Title of the ask an expert card.
    AskAnExpertSubheaderText = "One of our experts will reach out to you soon.",    // Ask en expert card subtitle text:lets the user know that SME team member can directly chat with the requester.
    TitleRequiredText = "Title (Required)", // Title(Required): label of the title text box.
    ShowCardTitleText = "Type a short title (50 characters max)",   // Label text where users enters title for his question or feedback.

    // unrecognized input card
    UnrecognizedInputText = "I didn't find a matching answer for this question. Do you want me to ask an expert?",

    // sme ticket card
    DescriptionFact = "Description:",   // Available factset in user notification and SME facing cards.
    QuestionAskedFactTitle = "Question asked:", // The fact set title for the question asked in the SME Ticket card.
    StatusFactTitle = "Status:",    // Status one of the available fact set in notification cards.
    ClosedFactTitle = "Closed: ",   // Closed fact title is one of the available fact set.
    SMEUserChatMessage = "RE: ",
    ChatTextButton = "Chat with ",   // Ability to chat directly with end user from SME channel.
    ChangeStatusButtonText = "Change status",   // Text on change status button.
    ViewArticleButtonText = "View article", // The necessary string for the view article button
    AssignToMeActionChoiceTitle = "Assign to me",   // The dropdown choice for "Assign to me" for the SME ticket status is being updated
    CloseActionChoiceTitle = "Close",   //The dropdown choice for "Close" for when the SME ticket status is being updated
    UnassignActionChoiceTitle = "Unassign", // The dropdown choice for "Unassign" for when the SME ticket status is being updated
    ReopenActionChoiceTitle = "Reopen", // The dropdown choice for "Reopen" for when the SME ticket status is being updated from the closed status.
    ReopenAssignToMeActionChoiceTitle = "Reopen and assign to me",  // The dropdown choice for "Reopen and assign to me" for when the SME ticket status is being updated from the closed state.
    AssignedUserNotificationStatus = "Assigned",    // The status value for the user notification when a ticket is assigned to an expert
    UnassignedUserNotificationStatus = "Unassigned",    // The status value for the user notification when a ticket is unassigned
    SMETicketUnassignedStatus = "Unassigned",    // This value represents the SME Ticket in the Unassigned status
    ClosedUserNotificationStatus = "Closed",    // The status value for the user notification when a ticket is closed by an expert.
    SMETicketAssignedStatus = "Assigned to ",   // This value represents the SME Ticket in the Assigned status - should append a SME User to whom a ticket has been assigned
    SMETicketClosedStatus = "Closed",    // This value represents the SME Ticket in the Closed status
    TitleFact = "Title:",   // Title fact is used to show the title entered by the user for his inquiry.
    DateCreatedDisplayFactTitle = "Created: ",  // Created: one of the available fact set in notification cards- created is the title for created date value.
}
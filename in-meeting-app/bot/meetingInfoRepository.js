// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * This component is used to store meeting and conversation context.
 */
class MeetingInfoRepository {
    constructor(name, year) {
        this.conversationReferences = {};
        this.meetingContexts = {};
    }

    setConversationReference(conversationReference) {
        this.conversationReferences[conversationReference.conversation.id] = conversationReference;
    }

    getConversationReference(conversationId) {
        return this.conversationReferences[conversationId];
    }

    setMeetingContext(meetingId, context) {
        this.meetingContexts[meetingId] = context;
        console.log("Update meeting context: ", Object.keys(this.meetingContexts));
    }

    getMeetingContext(meetingId) {
        console.log("Trying to get context with ID: ", meetingId);
        return this.meetingContexts[meetingId];
    }
}

// Export singleton
module.exports = new MeetingInfoRepository();
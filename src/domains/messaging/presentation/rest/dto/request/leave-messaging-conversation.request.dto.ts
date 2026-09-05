// -----------------------------------------------------------------------------
// Messaging — Leave Conversation Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for leaving a Messaging Conversation.
//
// Leaving is an action performed by the authenticated participant.
//
// The caller does NOT provide:
//
// - internal conversation ID;
// - conversation public ID in the body;
// - internal participant ID;
// - participant public ID in the body;
// - correlation ID;
// - causation ID;
// - leave timestamp.
//
// The authenticated participant is resolved by the application layer and the
// server establishes the leave timestamp.
//
// -----------------------------------------------------------------------------

export class LeaveMessagingConversationRequestDto {}

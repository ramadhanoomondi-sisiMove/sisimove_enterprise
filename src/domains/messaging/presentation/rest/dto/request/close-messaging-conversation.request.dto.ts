// -----------------------------------------------------------------------------
// Messaging — Close Conversation Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for closing a Messaging Conversation.
//
// Closing a conversation is an action. The caller does not provide:
//
// - conversation internal identifiers;
// - correlation identifiers;
// - causation identifiers;
// - the closure timestamp.
//
// The conversation public identifier belongs in the route:
//
//   PATCH /conversations/:conversationPublicId/close
//
// The server establishes when the conversation was closed.
//
// -----------------------------------------------------------------------------

export class CloseMessagingConversationRequestDto {}

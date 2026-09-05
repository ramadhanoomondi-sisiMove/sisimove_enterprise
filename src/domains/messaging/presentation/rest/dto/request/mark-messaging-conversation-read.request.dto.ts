// -----------------------------------------------------------------------------
// Messaging — Mark Conversation Read Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for marking a Messaging Conversation as read.
//
// The physical-world action is simply:
//
//   "I have read this conversation."
//
// The authenticated participant is resolved by the application layer.
//
// The server establishes the read timestamp rather than accepting an
// arbitrary timestamp from the client.
//
// The DTO therefore intentionally contains no fields.
//
// -----------------------------------------------------------------------------

export class MarkMessagingConversationReadRequestDto {}

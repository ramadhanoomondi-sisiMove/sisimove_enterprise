// -----------------------------------------------------------------------------
// Messaging — Delete Message Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for deleting a Messaging Message.
//
// Deletion is an action and requires no client-provided data.
//
// The message is identified by the route:
//
//   DELETE /conversations/:conversationPublicId/messages/:messagePublicId
//
// The authenticated member is resolved by the application layer.
//
// The server establishes the deletion timestamp.
//
// -----------------------------------------------------------------------------

export class DeleteMessagingMessageRequestDto {}

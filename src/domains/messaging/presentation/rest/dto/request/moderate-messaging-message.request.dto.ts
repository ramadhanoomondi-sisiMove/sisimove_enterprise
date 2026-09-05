// -----------------------------------------------------------------------------
// Messaging — Moderate Message Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for moderating a Messaging Message.
//
// Moderation is an action performed by an authorized actor.
//
// The message is identified by the route:
//
//   POST /conversations/:conversationPublicId/messages/:messagePublicId/moderate
//
// The authenticated moderator is resolved by the application/application
// authorization layer.
//
// The server establishes the moderation timestamp.
//
// No technical or server-generated fields are accepted from the client.
//
// -----------------------------------------------------------------------------

export class ModerateMessagingMessageRequestDto {}

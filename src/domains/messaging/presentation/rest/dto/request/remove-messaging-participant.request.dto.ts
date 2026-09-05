// -----------------------------------------------------------------------------
// Messaging — Remove Participant Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for removing a participant from a Messaging Conversation.
//
// Removing a participant is an action. The participant being removed should
// normally be identified by the route:
//
//   DELETE /conversations/:conversationPublicId/participants/:participantPublicId
//
// The caller does NOT provide:
//
// - internal IDs;
// - participant public ID in the request body;
// - correlation ID;
// - causation ID;
// - removal timestamp.
//
// Authorization is handled outside this DTO and the domain enforces the
// participant lifecycle rules.
//
// -----------------------------------------------------------------------------

export class RemoveMessagingParticipantRequestDto {}

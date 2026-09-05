// -----------------------------------------------------------------------------
// Messaging — Request DTOs
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Conversation
// -----------------------------------------------------------------------------

export { CreateMessagingConversationRequestDto } from './create-messaging-conversation.request.dto';

export { CloseMessagingConversationRequestDto } from './close-messaging-conversation.request.dto';

// -----------------------------------------------------------------------------
// Participants
// -----------------------------------------------------------------------------

export { AddMessagingParticipantRequestDto } from './add-messaging-participant.request.dto';

export { LeaveMessagingConversationRequestDto } from './leave-messaging-conversation.request.dto';

export { RemoveMessagingParticipantRequestDto } from './remove-messaging-participant.request.dto';

export { MarkMessagingConversationReadRequestDto } from './mark-messaging-conversation-read.request.dto';

// -----------------------------------------------------------------------------
// Messages
// -----------------------------------------------------------------------------

export { SendMessagingMessageRequestDto } from './send-messaging-message.request.dto';

export { EditMessagingMessageRequestDto } from './edit-messaging-message.request.dto';

export { DeleteMessagingMessageRequestDto } from './delete-messaging-message.request.dto';

export { ModerateMessagingMessageRequestDto } from './moderate-messaging-message.request.dto';

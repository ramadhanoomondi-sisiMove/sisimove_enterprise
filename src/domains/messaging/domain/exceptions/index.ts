// -----------------------------------------------------------------------------
// Messaging Domain — Exceptions
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Root Exception
// -----------------------------------------------------------------------------

export { MessagingException } from './messaging.exception';

// -----------------------------------------------------------------------------
// Messaging Conversation Exceptions
// -----------------------------------------------------------------------------

export { MessagingConversationNotFoundException } from './messaging-conversation-not-found.exception';

export { MessagingConversationInvalidStatusException } from './messaging-conversation-invalid-status.exception';

export { MessagingConversationAlreadyClosedException } from './messaging-conversation-already-closed.exception';

// -----------------------------------------------------------------------------
// Messaging Participant Exceptions
// -----------------------------------------------------------------------------

export { MessagingParticipantNotFoundException } from './messaging-participant-not-found.exception';

export { MessagingParticipantAlreadyExistsException } from './messaging-participant-already-exists.exception';

export { MessagingParticipantInvalidStatusException } from './messaging-participant-invalid-status.exception';

// -----------------------------------------------------------------------------
// Messaging Message Exceptions
// -----------------------------------------------------------------------------

export { MessagingMessageNotFoundException } from './messaging-message-not-found.exception';

export { MessagingMessageInvalidStatusException } from './messaging-message-invalid-status.exception';

export { MessagingMessageAlreadyDeletedException } from './messaging-message-already-deleted.exception';

export { MessagingMessageEmptyException } from './messaging-message-empty.exception';

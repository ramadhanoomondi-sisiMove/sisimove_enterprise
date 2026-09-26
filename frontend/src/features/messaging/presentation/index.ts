// -----------------------------------------------------------------------------
// SisiMove — Messaging Presentation Barrel
// -----------------------------------------------------------------------------
//
// Central export surface for Messaging presentation helpers.
//
// This barrel contains no implementation logic.
// -----------------------------------------------------------------------------

// =============================================================================
// Conversation State
// =============================================================================

export {
  canMessagingConversationBeClosed,
  canMessagingConversationBeModified,
  canMessagingConversationReceiveMessages,
  getMessagingConversationPresentationState,
  isMessagingConversationActive,
  isMessagingConversationClosed,
} from './messaging-conversation-state';

export type {
  MessagingConversationPresentationState,
} from './messaging-conversation-state';

// =============================================================================
// Conversation Labels
// =============================================================================

export {
  getMessagingConversationStatusLabel,
  getMessagingConversationTypeLabel,
  MESSAGING_CONVERSATION_STATUS_LABELS,
  MESSAGING_CONVERSATION_TYPE_LABELS,
} from './messaging-conversation-labels';

// =============================================================================
// Message State
// =============================================================================

export {
  canMessagingMessageBeDeleted,
  canMessagingMessageBeEdited,
  canMessagingMessageBeModified,
  canMessagingMessageBeModerated,
  getMessagingMessagePresentationState,
  isMessagingFileMessage,
  isMessagingImageMessage,
  isMessagingMessageDeleted,
  isMessagingMessageEdited,
  isMessagingMessageModerated,
  isMessagingMessageUsable,
  isMessagingSystemMessage,
  isMessagingTextMessage,
} from './messaging-message-state';

export type {
  MessagingMessagePresentationState,
} from './messaging-message-state';

// =============================================================================
// Message Labels
// =============================================================================

export {
  getMessagingMessageStatusLabel,
  getMessagingMessageTypeLabel,
  MESSAGING_MESSAGE_STATUS_LABELS,
  MESSAGING_MESSAGE_TYPE_LABELS,
} from './messaging-message-labels';

// =============================================================================
// Participant State
// =============================================================================

export {
  canMessagingParticipantBeRemoved,
  canMessagingParticipantLeave,
  canMessagingParticipantReadMessages,
  canMessagingParticipantSendMessages,
  getMessagingParticipantPresentationState,
  hasMessagingParticipantReadPosition,
  isMessagingParticipantActive,
  isMessagingParticipantLeft,
  isMessagingParticipantRemoved,
  isMessagingParticipantUsable,
  isMessagingPassengerParticipant,
  isMessagingProviderParticipant,
} from './messaging-participant-state';

export type {
  MessagingParticipantPresentationState,
} from './messaging-participant-state';

// =============================================================================
// Participant Labels
// =============================================================================

export {
  getMessagingParticipantRoleLabel,
  getMessagingParticipantStatusLabel,
  MESSAGING_PARTICIPANT_ROLE_LABELS,
  MESSAGING_PARTICIPANT_STATUS_LABELS,
} from './messaging-participant-labels';
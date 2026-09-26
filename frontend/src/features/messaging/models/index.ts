// -----------------------------------------------------------------------------
// SisiMove — Messaging Models
// -----------------------------------------------------------------------------
//
// Central export surface for the Messaging feature models.
//
// Responsibilities:
//
// - Re-export Messaging model constants.
// - Re-export Messaging model types.
// - Provide a stable import boundary for the rest of the feature.
//
// Example:
//
// import {
//   MESSAGING_MESSAGE_TYPES,
//   type MessagingMessage,
// } from '@/features/messaging/models';
//
// This barrel intentionally contains no implementation logic.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Message
// =============================================================================

export {
  MESSAGING_MESSAGE_TYPES,
  type MessagingMessageType,
} from './messaging-message-type';

export {
  MESSAGING_MESSAGE_STATUSES,
  type MessagingMessageStatus,
} from './messaging-message-status';

export type { MessagingMessage } from './messaging-message';

// =============================================================================
// Conversation
// =============================================================================

export {
  MESSAGING_CONVERSATION_TYPES,
  type MessagingConversationType,
} from './messaging-conversation-type';

export {
  MESSAGING_CONVERSATION_STATUSES,
  type MessagingConversationStatus,
} from './messaging-conversation-status';

export type { MessagingConversation } from './messaging-conversation';

// =============================================================================
// Participant
// =============================================================================

export {
  MESSAGING_PARTICIPANT_ROLES,
  type MessagingParticipantRole,
} from './messaging-participant-role';

export {
  MESSAGING_PARTICIPANT_STATUSES,
  type MessagingParticipantStatus,
} from './messaging-participant-status';

export type { MessagingConversationParticipant } from './messaging-conversation-participant';
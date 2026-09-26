// -----------------------------------------------------------------------------
// SisiMove — Messaging Participant Status
// -----------------------------------------------------------------------------
//
// Frontend representation of the Messaging Conversation participant
// lifecycle status.
//
// Supported statuses:
//
// - ACTIVE
// - LEFT
// - REMOVED
//
// Participant lifecycle is owned by the
// MessagingConversationAggregate.
//
// The frontend consumes the backend-provided status and capability predicates.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Messaging Participant Statuses
// =============================================================================

/**
 * Backend-compatible Messaging Conversation participant status constants.
 */
export const MESSAGING_PARTICIPANT_STATUSES = {
  ACTIVE: 'ACTIVE',
  LEFT: 'LEFT',
  REMOVED: 'REMOVED',
} as const;

// =============================================================================
// Messaging Participant Status
// =============================================================================

/**
 * Union of all supported Messaging Conversation participant statuses.
 */
export type MessagingParticipantStatus =
  (typeof MESSAGING_PARTICIPANT_STATUSES)[keyof typeof MESSAGING_PARTICIPANT_STATUSES];
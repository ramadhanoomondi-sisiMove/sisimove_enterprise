// -----------------------------------------------------------------------------
// SisiMove — Messaging Conversation Status
// -----------------------------------------------------------------------------
//
// Frontend representation of the Messaging Conversation lifecycle status.
//
// Supported lifecycle statuses:
//
// - ACTIVE
// - CLOSED
//
// The backend MessagingConversationAggregate owns the lifecycle transition.
//
// The frontend consumes this state and the backend-provided capability
// predicates rather than reproducing the lifecycle rules.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Messaging Conversation Statuses
// =============================================================================

/**
 * Backend-compatible Messaging Conversation lifecycle status constants.
 */
export const MESSAGING_CONVERSATION_STATUSES = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
} as const;

// =============================================================================
// Messaging Conversation Status
// =============================================================================

/**
 * Union of all supported Messaging Conversation lifecycle statuses.
 */
export type MessagingConversationStatus =
  (typeof MESSAGING_CONVERSATION_STATUSES)[keyof typeof MESSAGING_CONVERSATION_STATUSES];
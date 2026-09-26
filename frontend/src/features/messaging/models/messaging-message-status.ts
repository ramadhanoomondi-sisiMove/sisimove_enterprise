// -----------------------------------------------------------------------------
// SisiMove — Messaging Message Status
// -----------------------------------------------------------------------------
//
// Frontend representation of the Messaging Message lifecycle status.
//
// Supported lifecycle statuses:
//
// - SENT
// - EDITED
// - DELETED
// - MODERATED
//
// The frontend does not implement the lifecycle state machine.
//
// Lifecycle transitions remain authoritative in the backend Messaging domain.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Messaging Message Statuses
// =============================================================================

/**
 * Backend-compatible Messaging Message lifecycle status constants.
 */
export const MESSAGING_MESSAGE_STATUSES = {
  SENT: 'SENT',
  EDITED: 'EDITED',
  DELETED: 'DELETED',
  MODERATED: 'MODERATED',
} as const;

// =============================================================================
// Messaging Message Status
// =============================================================================

/**
 * Union of all supported Messaging Message lifecycle statuses.
 */
export type MessagingMessageStatus =
  (typeof MESSAGING_MESSAGE_STATUSES)[keyof typeof MESSAGING_MESSAGE_STATUSES];
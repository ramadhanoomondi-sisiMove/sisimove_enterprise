// -----------------------------------------------------------------------------
// SisiMove — Messaging Conversation Type
// -----------------------------------------------------------------------------
//
// Frontend representation of the Messaging Conversation type.
//
// Supported conversation types:
//
// - JOURNEY
// - DIRECT
//
// A JOURNEY conversation is associated with a Journey.
//
// A DIRECT conversation represents a direct contextual conversation. The
// backend currently still carries the required journeyPublicId reference on
// the conversation model.
//
// This file only represents the server-provided type.
//
// It does NOT:
//
// - Create conversations.
// - Decide whether a conversation may be created.
// - Resolve Journey ownership.
// - Validate Journey state.
// - Authorize participants.
//
// Those responsibilities belong to the backend.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Messaging Conversation Types
// =============================================================================

/**
 * Backend-compatible Messaging Conversation type constants.
 */
export const MESSAGING_CONVERSATION_TYPES = {
  JOURNEY: 'JOURNEY',
  DIRECT: 'DIRECT',
} as const;

// =============================================================================
// Messaging Conversation Type
// =============================================================================

/**
 * Union of all supported Messaging Conversation types.
 */
export type MessagingConversationType =
  (typeof MESSAGING_CONVERSATION_TYPES)[keyof typeof MESSAGING_CONVERSATION_TYPES];
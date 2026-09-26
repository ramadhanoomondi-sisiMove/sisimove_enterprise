// -----------------------------------------------------------------------------
// SisiMove — Messaging Message Type
// -----------------------------------------------------------------------------
//
// Frontend representation of the Messaging Message type.
//
// Responsibilities:
//
// - Provide the backend-compatible Messaging Message type literals.
// - Provide a reusable type union.
// - Avoid TypeScript enum runtime objects.
// - Keep the frontend model layer primitive.
//
// Supported Messaging Message types:
//
// - TEXT
// - IMAGE
// - FILE
// - SYSTEM
//
// This file does NOT:
//
// - Validate message payloads.
// - Decide which type may be sent.
// - Perform authorization.
// - Implement message lifecycle rules.
// - Resolve assets.
// - Contain UI presentation labels.
//
// Payload rules belong to the backend domain/application layer.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Messaging Message Types
// =============================================================================

/**
 * Backend-compatible Messaging Message type constants.
 *
 * `as const` preserves the literal values and allows the corresponding
 * TypeScript union to be derived without introducing a runtime enum.
 */
export const MESSAGING_MESSAGE_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  FILE: 'FILE',
  SYSTEM: 'SYSTEM',
} as const;

// =============================================================================
// Messaging Message Type
// =============================================================================

/**
 * Union of all supported Messaging Message types.
 */
export type MessagingMessageType =
  (typeof MESSAGING_MESSAGE_TYPES)[keyof typeof MESSAGING_MESSAGE_TYPES];
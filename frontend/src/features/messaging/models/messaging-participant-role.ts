// -----------------------------------------------------------------------------
// SisiMove — Messaging Participant Role
// -----------------------------------------------------------------------------
//
// Frontend representation of a Messaging Conversation participant role.
//
// Supported roles:
//
// - PROVIDER
// - PASSENGER
//
// The role is server-provided state.
//
// The frontend must not infer a participant's role from Journey ownership,
// Booking ownership, authentication state, or UI context.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Messaging Participant Roles
// =============================================================================

/**
 * Backend-compatible Messaging Conversation participant role constants.
 */
export const MESSAGING_PARTICIPANT_ROLES = {
  PROVIDER: 'PROVIDER',
  PASSENGER: 'PASSENGER',
} as const;

// =============================================================================
// Messaging Participant Role
// =============================================================================

/**
 * Union of all supported Messaging Conversation participant roles.
 */
export type MessagingParticipantRole =
  (typeof MESSAGING_PARTICIPANT_ROLES)[keyof typeof MESSAGING_PARTICIPANT_ROLES];
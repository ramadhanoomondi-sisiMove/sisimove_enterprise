// -----------------------------------------------------------------------------
// Public Traveller
// -----------------------------------------------------------------------------
//
// Public-facing representation of a traveller participating in SisiMove's
// public discovery experience.
//
// This model represents ONLY the traveller's publicly discoverable social
// identity. It does not represent trust, verification, journey history,
// financial information, or private identity data.
//
// It must not mirror Identity, TravellerProfile, or Trust domain entities.
//
// Public trust information is composed separately through
// PublicTravellerTrust.
//
// Sensitive/private information such as:
// - identity IDs
// - phone numbers
// - email addresses
// - wallet information
// - payment information
// - verification evidence
// - moderation information
// - private profile information
// - internal lifecycle metadata
// is deliberately excluded.
//
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Public Traveller
// -----------------------------------------------------------------------------

/**
 * Public traveller representation.
 *
 * This is the public social-identity projection used by:
 *
 * - traveller discovery
 * - traveller cards
 * - public traveller profiles
 * - journey participants
 * - journey-demand participants
 * - other anonymous SisiMove experiences
 *
 * Trust and reputation information is intentionally not included here.
 * Consumers that need trust information should consume the corresponding
 * PublicTravellerTrust projection.
 */
export interface PublicTraveller {
  /**
   * Public social handle.
   *
   * Example:
   *
   * @ramadhan
   *
   * The handle is the primary human-facing identity used in public
   * discovery.
   */
  handle: string;

  /**
   * Public profile/avatar image URL.
   *
   * Null when the traveller does not have a publicly available avatar.
   *
   * The URL must be produced by the public asset/read-model boundary and
   * must not expose internal storage identifiers or private asset locations.
   */
  avatarUrl: string | null;
}
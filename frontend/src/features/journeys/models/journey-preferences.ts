// -----------------------------------------------------------------------------
// SisiMove — Journey Preferences
// -----------------------------------------------------------------------------
//
// Public/frontend representation of traveller preferences for a Journey.
//
// This model is a frontend read model and is intentionally independent of:
// - Prisma models
// - backend domain entities
// - aggregates
// - persistence structures
//
// These preferences describe the public expectations for a particular Journey.
// They are presentation/discovery information and must not be interpreted by
// the frontend as authorization, booking, payment, or enforcement rules.
//
// The backend remains authoritative for all Journey and Booking rules.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Smoking Policy
// -----------------------------------------------------------------------------

export type JourneySmokingPolicy =
  | 'ALLOWED'
  | 'NOT_ALLOWED';

// -----------------------------------------------------------------------------
// Pets Policy
// -----------------------------------------------------------------------------

export type JourneyPetsPolicy =
  | 'ALLOWED'
  | 'NOT_ALLOWED'
  | 'SERVICE_ANIMALS_ONLY';

// -----------------------------------------------------------------------------
// Luggage Policy
// -----------------------------------------------------------------------------

export type JourneyLuggagePolicy =
  | 'NONE'
  | 'LIMITED'
  | 'STANDARD'
  | 'LARGE';

// -----------------------------------------------------------------------------
// Conversation Preference
// -----------------------------------------------------------------------------

export type JourneyConversationPreference =
  | 'QUIET'
  | 'MODERATE'
  | 'SOCIAL';

// -----------------------------------------------------------------------------
// Music Preference
// -----------------------------------------------------------------------------

export type JourneyMusicPreference =
  | 'NONE'
  | 'LOW'
  | 'MODERATE'
  | 'ANY';

// -----------------------------------------------------------------------------
// Journey Preferences
// -----------------------------------------------------------------------------

export interface JourneyPreferences {
  /**
   * Stable public identifier of the preferences representation.
   *
   * This is an opaque frontend-safe identifier and must not be treated as an
   * internal database identifier.
   */
  publicId: string;

  /**
   * Public smoking preference for the Journey.
   *
   * This describes the expected Journey environment. The backend remains
   * authoritative for any applicable platform or safety rules.
   */
  smoking: JourneySmokingPolicy;

  /**
   * Public pet preference for the Journey.
   *
   * SERVICE_ANIMALS_ONLY indicates that service animals are accommodated
   * while ordinary pets are not.
   */
  pets: JourneyPetsPolicy;

  /**
   * Public luggage capacity preference for the Journey.
   *
   * This describes the expected amount of luggage that can be accommodated.
   * It is not a guaranteed baggage entitlement.
   */
  luggage: JourneyLuggagePolicy;

  /**
   * Preferred level of conversation during the Journey.
   *
   * This is a social preference intended to help travellers decide whether
   * the Journey is a good fit.
   */
  conversation: JourneyConversationPreference;

  /**
   * Preferred level of music during the Journey.
   *
   * This is a social preference intended for Journey discovery and
   * compatibility.
   */
  music: JourneyMusicPreference;
}
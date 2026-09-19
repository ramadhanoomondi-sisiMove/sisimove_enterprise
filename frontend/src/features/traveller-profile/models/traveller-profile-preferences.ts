//features/traveller-profile/models/traveller-profile-preferences.ts`


// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Preferences Model
// -----------------------------------------------------------------------------
//
// Authenticated Traveller Profile preference representation.
//
// Architectural rules:
// - Preferences are an internal component of Traveller Profile.
// - The frontend receives this as a dedicated model because preferences have
//   their own API operations and UI.
// - No domain logic belongs in this model.
// - Boolean values represent the persisted preference state directly.
//
// -----------------------------------------------------------------------------

export interface TravellerProfilePreferences {
  /**
   * Public identifier of the preferences record.
   */
  publicId: string;

  /**
   * Public/internal feature reference identifying the owning profile.
   *
   * The frontend should treat this as an opaque identifier.
   */
  profileId: string;

  /**
   * Whether journey history may be displayed.
   */
  showJourneyHistory: boolean;

  /**
   * Whether journey statistics may be displayed.
   */
  showJourneyStatistics: boolean;

  /**
   * Whether the traveller may receive journey invitations.
   */
  allowJourneyInvites: boolean;

  /**
   * Record creation timestamp.
   */
  createdAt: string;

  /**
   * Last update timestamp.
   */
  updatedAt: string;
}
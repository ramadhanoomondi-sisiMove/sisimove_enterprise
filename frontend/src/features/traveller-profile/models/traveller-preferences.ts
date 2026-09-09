// -----------------------------------------------------------------------------
// Traveller Preferences
// -----------------------------------------------------------------------------
//
// Frontend representation of a traveller's public travel preferences.
//
// Preferences describe how a traveller generally prefers to travel or share
// journeys. They are not booking requirements, payment rules, or commercial
// configuration.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Traveller Preferences
// -----------------------------------------------------------------------------

/**
 * Public traveller preferences.
 *
 * These preferences can be used to improve traveller discovery, profile
 * presentation, and future journey matching.
 *
 * All fields are optional at the product level because a traveller may choose
 * not to configure every preference.
 */
export interface TravellerPreferences {
  /**
   * Preferred travel experience.
   *
   * Null means the traveller has not specified a preference.
   */
  travelStyle: TravellerTravelStyle | null;

  /**
   * Whether the traveller prefers travelling during daytime.
   *
   * Null means no preference has been specified.
   */
  prefersDaytimeTravel: boolean | null;

  /**
   * Whether the traveller prefers travelling during nighttime.
   *
   * Null means no preference has been specified.
   */
  prefersNighttimeTravel: boolean | null;

  /**
   * Whether the traveller is comfortable with flexible departure times.
   *
   * Null means no preference has been specified.
   */
  flexibleDeparture: boolean | null;

  /**
   * Optional maximum number of fellow travellers the traveller generally
   * prefers to share a journey with.
   *
   * Null means no preference has been specified.
   */
  preferredCompanionCount: number | null;
}

// -----------------------------------------------------------------------------
// Travel Style
// -----------------------------------------------------------------------------

/**
 * General public travel-style preference.
 *
 * These values describe presentation/matching preferences only. They do not
 * determine eligibility, pricing, booking acceptance, or trust status.
 */
export type TravellerTravelStyle =
  | 'QUIET'
  | 'SOCIAL'
  | 'FLEXIBLE';
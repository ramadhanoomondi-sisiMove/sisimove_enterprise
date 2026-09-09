// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile API Types
// -----------------------------------------------------------------------------
//
// HTTP transport contracts for the Traveller Profile API.
//
// These types describe ONLY Traveller Profile data.
//
// Boundary:
//
// HTTP transport
//      ↓
// TravellerProfileMapper
//      ↓
// TravellerProfile feature model
//
// Trust is deliberately excluded.
// Trust belongs to:
//
// features/trust/
//
// These contracts must not represent:
// - Prisma models;
// - domain entities;
// - aggregates;
// - persistence models;
// - Identity internals;
// - Trust internals;
// - private traveller information.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Traveller Profile Response
// -----------------------------------------------------------------------------

/**
 * Public Traveller Profile HTTP response.
 *
 * This contract contains only information owned by the Traveller Profile
 * feature.
 *
 * Trust, journeys, bookings, financial information, and authentication
 * information are separate concerns and must not be embedded here.
 */
export interface PublicTravellerProfileResponse {
  /**
   * Public traveller profile information.
   */
  traveller:
    PublicTravellerProfileTravellerResponse;

  /**
   * Traveller's primary public travel corridor.
   *
   * Null when no public primary corridor is configured.
   */
  primaryCorridor:
    | PublicTravellerProfileCorridorResponse
    | null;

  /**
   * Traveller's public travel preferences.
   */
  preferences:
    PublicTravellerProfilePreferencesResponse;

  /**
   * Whether the traveller has made this profile publicly discoverable.
   */
  isPublic: boolean;
}

// -----------------------------------------------------------------------------
// Traveller
// -----------------------------------------------------------------------------

/**
 * Public traveller profile representation.
 *
 * This is a social/profile projection and does not replace the authoritative
 * Identity domain representation.
 */
export interface PublicTravellerProfileTravellerResponse {
  /**
   * Public social handle.
   */
  handle: string;

  /**
   * Public display name.
   *
   * This is presentation data and does not replace the authoritative
   * Identity representation.
   */
  displayName: string;

  /**
   * Public avatar URL.
   *
   * Null when no public avatar is configured.
   */
  avatarUrl: string | null;

  /**
   * Public biography.
   *
   * Null when no public biography is configured.
   */
  bio: string | null;
}

// -----------------------------------------------------------------------------
// Traveller Corridor
// -----------------------------------------------------------------------------

/**
 * Public representation of a traveller's primary travel corridor.
 *
 * A corridor represents a general route the traveller commonly travels.
 *
 * It is NOT a Journey and therefore must not contain:
 * - departure or arrival times;
 * - booking information;
 * - vehicle information;
 * - journey pricing;
 * - seat availability;
 * - live location;
 * - private pickup/drop-off locations.
 */
export interface PublicTravellerProfileCorridorResponse {
  /**
   * Public corridor identifier.
   */
  publicId: string;

  /**
   * Public origin name.
   */
  origin: string;

  /**
   * Public destination name.
   */
  destination: string;

  /**
   * Public waypoints belonging to the corridor.
   */
  waypoints:
    PublicTravellerProfileCorridorWaypointResponse[];
}

// -----------------------------------------------------------------------------
// Corridor Waypoint
// -----------------------------------------------------------------------------

/**
 * Public waypoint belonging to a traveller's primary corridor.
 */
export interface PublicTravellerProfileCorridorWaypointResponse {
  /**
   * Public waypoint identifier.
   */
  publicId: string;

  /**
   * Human-readable public waypoint name.
   */
  name: string;

  /**
   * Position of the waypoint within the corridor.
   */
  order: number;
}

// -----------------------------------------------------------------------------
// Traveller Preferences
// -----------------------------------------------------------------------------

/**
 * Public traveller travel preferences.
 *
 * These describe general travel preferences only.
 *
 * They are not:
 * - booking requirements;
// - eligibility rules;
// - commercial configuration;
// - financial configuration;
// - trust criteria.
 */
export interface PublicTravellerProfilePreferencesResponse {
  /**
   * Public travel style.
   *
   * Transport values remain strings and are normalized by the mapper.
   */
  travelStyle: string | null;

  /**
   * Whether daytime travel is preferred.
   */
  prefersDaytimeTravel: boolean | null;

  /**
   * Whether nighttime travel is preferred.
   */
  prefersNighttimeTravel: boolean | null;

  /**
   * Whether flexible departure is preferred.
   */
  flexibleDeparture: boolean | null;

  /**
   * Preferred number of fellow travellers.
   */
  preferredCompanionCount: number | null;
}
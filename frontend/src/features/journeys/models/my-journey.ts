// -----------------------------------------------------------------------------
// sisiMove — My Journey Model
// -----------------------------------------------------------------------------
//
// Authenticated owner's Journey representation.
//
// Source:
//     GET /journeys/me
//
// Architectural boundary:
//
//     MyJourney HTTP Response
//             │
//             ▼
//     MyJourney frontend model
//             │
//             ▼
//     Authenticated Journey UI
//
// This model intentionally differs from PublicJourney.
//
// PublicJourney:
//   - marketplace discovery
//   - publicly discoverable Journeys
//   - publication-ready projection
//   - public-facing language
//
// MyJourney:
//   - authenticated owner's Journeys
//   - may include DRAFT/incomplete Journeys
//   - includes lifecycle information
//   - components may be null while a Journey is incomplete
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// The backend serializes JavaScript Date values as ISO-8601 strings over HTTP.
// Therefore all dates are represented as string | null here.
//
// This model must NOT expose:
//   - providerPublicId
//   - internal entity IDs
//   - aggregate version
//   - domain value objects
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// My Journey
// -----------------------------------------------------------------------------

export interface MyJourney {
  /**
   * Stable public Journey identifier.
   */
  readonly publicId: string;

  /**
   * Current Journey lifecycle status.
   *
   * Examples may include:
   *   DRAFT
   *   PUBLISHED
   *   STARTED
   *   COMPLETION_REQUESTED
   *   COMPLETED
   *   CANCELLED
   *   EXPIRED
   *
   * The backend remains the source of truth for the actual status values.
   */
  readonly status: string;

  /**
   * Journey lifecycle timestamps.
   */
  readonly publishedAt: string | null;
  readonly startedAt: string | null;
  readonly completionRequestedAt: string | null;
  readonly completedAt: string | null;
  readonly cancelledAt: string | null;
  readonly expiredAt: string | null;

  /**
   * Persistence timestamps.
   */
  readonly createdAt: string;
  readonly updatedAt: string;

  /**
   * Journey corridor.
   *
   * Null while the Journey has not yet been configured.
   */
  readonly corridor: MyJourneyCorridor | null;

  /**
   * Journey schedule.
   *
   * Null while the Journey has not yet been configured.
   */
  readonly schedule: MyJourneySchedule | null;

  /**
   * Journey vehicle.
   *
   * Null while the Journey has not yet been configured.
   */
  readonly vehicle: MyJourneyVehicle | null;

  /**
   * Journey capacity.
   *
   * Null while the Journey has not yet been configured.
   */
  readonly capacity: MyJourneyCapacity | null;

  /**
   * Journey pricing.
   *
   * Null while the Journey has not yet been configured.
   */
  readonly pricing: MyJourneyPricing | null;

  /**
   * Journey preferences.
   *
   * Null when preferences have not been configured.
   */
  readonly preferences: MyJourneyPreferences | null;

  /**
   * Journey assets.
   */
  readonly assets: readonly MyJourneyAsset[];
}

// -----------------------------------------------------------------------------
// Corridor
// -----------------------------------------------------------------------------

export interface MyJourneyCorridor {
  readonly origin: MyJourneyLocation;
  readonly destination: MyJourneyLocation;
  readonly waypoints: readonly MyJourneyWaypoint[];
}

// -----------------------------------------------------------------------------
// Location
// -----------------------------------------------------------------------------

export interface MyJourneyLocation {
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
}

// -----------------------------------------------------------------------------
// Waypoint
// -----------------------------------------------------------------------------

export interface MyJourneyWaypoint {
  readonly publicId: string;
  readonly type: string;
  readonly sequence: number;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly pickupAllowed: boolean;
  readonly dropoffAllowed: boolean;
}

// -----------------------------------------------------------------------------
// Schedule
// -----------------------------------------------------------------------------

export interface MyJourneySchedule {
  readonly publicId: string;
  readonly departureAt: string;
  readonly arrivalAt: string | null;
  readonly timezone: string;
}

// -----------------------------------------------------------------------------
// Vehicle
// -----------------------------------------------------------------------------

export interface MyJourneyVehicle {
  readonly publicId: string;
  readonly make: string;
  readonly model: string;
  readonly year: number | null;
  readonly color: string | null;
  readonly registration: string | null;
  readonly assetPublicId: string | null;
}

// -----------------------------------------------------------------------------
// Capacity
// -----------------------------------------------------------------------------

export interface MyJourneyCapacity {
  readonly publicId: string;
  readonly totalSeats: number;
  readonly bookedSeats: number;
  readonly availableSeats: number;
}

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

export interface MyJourneyPricing {
  readonly publicId: string;
  readonly amount: number;
  readonly currency: string;
}

// -----------------------------------------------------------------------------
// Preferences
// -----------------------------------------------------------------------------

export interface MyJourneyPreferences {
  readonly publicId: string;
  readonly smoking: string;
  readonly pets: string;
  readonly luggage: string;
  readonly conversation: string;
  readonly music: string;
}

// -----------------------------------------------------------------------------
// Asset
// -----------------------------------------------------------------------------

export interface MyJourneyAsset {
  readonly publicId: string;
  readonly assetPublicId: string;
  readonly type: string;
  readonly sortOrder: number;
}
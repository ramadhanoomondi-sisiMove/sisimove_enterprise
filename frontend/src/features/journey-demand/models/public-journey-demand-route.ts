// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Route
// -----------------------------------------------------------------------------
//
// Public representation of the route being requested.
//
// JourneyDemandCorridor and JourneyDemandWaypoint are persistence/domain
// structures. This model exposes only the information required to understand,
// discover, and eventually visualize the requested journey.
//
// A Journey Demand route describes TRAVELLER REQUIREMENTS:
//
// - where the traveller wants to start;
// - where the traveller wants to finish;
// - which intermediate locations matter;
// - whether pickup and/or drop-off is required at those locations.
//
// Unlike Journey routes, demand waypoints describe traveller requirements.
// Therefore `pickupRequired` and `dropoffRequired` are used instead of the
// Journey-side `pickupAllowed` and `dropoffAllowed`.
//
// Coordinates remain part of the public route projection because they are
// useful for:
// - route visualization;
// - map-based discovery;
// - geographic matching;
// - future corridor discovery.
//
// The public model does not expose internal Prisma IDs or demand/corridor IDs.
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandRoute {
  /**
   * Requested starting location.
   *
   * Example:
   *
   *     Nairobi
   */
  readonly origin: PublicJourneyDemandLocation;

  /**
   * Requested final destination.
   *
   * Example:
   *
   *     Bungoma
   */
  readonly destination: PublicJourneyDemandLocation;

  /**
   * Requested intermediate locations in route order.
   *
   * The collection may contain pickup, drop-off, and ordinary waypoints.
   */
  readonly waypoints: readonly PublicJourneyDemandWaypoint[];
}

// -----------------------------------------------------------------------------
// Public Journey Demand Location
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandLocation {
  /**
   * Human-readable location name.
   */
  readonly name: string;

  /**
   * Geographic latitude.
   */
  readonly latitude: number;

  /**
   * Geographic longitude.
   */
  readonly longitude: number;
}

// -----------------------------------------------------------------------------
// Public Journey Demand Waypoint
// -----------------------------------------------------------------------------

export type PublicJourneyDemandWaypointType =
  | 'ORIGIN'
  | 'DESTINATION'
  | 'PICKUP'
  | 'DROPOFF'
  | 'WAYPOINT';

export interface PublicJourneyDemandWaypoint {
  /**
   * Stable public identifier for the waypoint.
   *
   * The internal database ID is never exposed.
   */
  readonly publicId: string;

  /**
   * Semantic role of this point in the requested route.
   */
  readonly type: PublicJourneyDemandWaypointType;

  /**
   * Position within the requested route.
   */
  readonly sequence: number;

  /**
   * Human-readable location name.
   */
  readonly name: string;

  /**
   * Geographic latitude.
   */
  readonly latitude: number;

  /**
   * Geographic longitude.
   */
  readonly longitude: number;

  /**
   * Whether pickup at this location is required by the demand.
   */
  readonly pickupRequired: boolean;

  /**
   * Whether drop-off at this location is required by the demand.
   */
  readonly dropoffRequired: boolean;
}
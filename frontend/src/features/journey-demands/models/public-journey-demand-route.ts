// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Route
// -----------------------------------------------------------------------------
//
// Public representation of the route being requested.
//
// JourneyDemandCorridor and JourneyDemandWaypoint are persistence/domain
// structures. This model exposes only the information required to understand
// and discover the requested journey.
//
// Unlike Journey routes, demand waypoints describe traveller requirements.
// Therefore `pickupRequired` and `dropoffRequired` are used instead of the
// Journey-side `pickupAllowed` and `dropoffAllowed`.
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandRoute {
  /**
   * Requested starting location.
   */
  origin: PublicJourneyDemandLocation;

  /**
   * Requested final destination.
   */
  destination: PublicJourneyDemandLocation;

  /**
   * Requested intermediate locations.
   */
  waypoints: PublicJourneyDemandWaypoint[];
}

// -----------------------------------------------------------------------------
// Public Journey Demand Location
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandLocation {
  name: string;
  latitude: number;
  longitude: number;
}

// -----------------------------------------------------------------------------
// Public Journey Demand Waypoint
// -----------------------------------------------------------------------------

export type PublicJourneyDemandWaypointType =
  | "ORIGIN"
  | "DESTINATION"
  | "PICKUP"
  | "DROPOFF"
  | "WAYPOINT";

export interface PublicJourneyDemandWaypoint {
  /**
   * Public identifier for the waypoint.
   *
   * The internal database ID is never exposed.
   */
  publicId: string;

  type: PublicJourneyDemandWaypointType;

  /**
   * Position within the requested route.
   */
  sequence: number;

  name: string;

  latitude: number;
  longitude: number;

  /**
   * Whether pickup at this location is required by the demand.
   */
  pickupRequired: boolean;

  /**
   * Whether drop-off at this location is required by the demand.
   */
  dropoffRequired: boolean;
}
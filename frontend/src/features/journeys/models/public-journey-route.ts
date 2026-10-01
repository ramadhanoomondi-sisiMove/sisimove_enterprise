// -----------------------------------------------------------------------------
// sisiMove — Public Journey Route
// -----------------------------------------------------------------------------
//
// Public representation of a Journey route.
//
// The persistence model stores JourneyCorridor and JourneyWaypoint separately.
// The public read model composes them into one route representation.
//
// Internal corridor IDs and database identifiers are intentionally excluded.
// -----------------------------------------------------------------------------

export interface PublicJourneyRoute {
  origin: PublicJourneyLocation;
  destination: PublicJourneyLocation;
  waypoints: PublicJourneyWaypoint[];
}

// -----------------------------------------------------------------------------
// Public Journey Location
// -----------------------------------------------------------------------------

export interface PublicJourneyLocation {
  name: string;
  latitude: number;
  longitude: number;
}

// -----------------------------------------------------------------------------
// Public Journey Waypoint
// -----------------------------------------------------------------------------

export type PublicJourneyWaypointType =
  | "ORIGIN"
  | "DESTINATION"
  | "PICKUP"
  | "DROPOFF"
  | "WAYPOINT";

export interface PublicJourneyWaypoint {
  publicId: string;

  type: PublicJourneyWaypointType;

  sequence: number;

  name: string;

  latitude: number;
  longitude: number;

  pickupAllowed: boolean;
  dropoffAllowed: boolean;
}
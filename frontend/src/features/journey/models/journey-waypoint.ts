// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint Model
// -----------------------------------------------------------------------------
//
// Represents a waypoint belonging to a JourneyCorridor.
//
// A waypoint is a Journey-domain object. It is not a generic location model.
// -----------------------------------------------------------------------------

export enum JourneyWaypointType {
  ORIGIN = 'ORIGIN',
  DESTINATION = 'DESTINATION',
  PICKUP = 'PICKUP',
  DROPOFF = 'DROPOFF',
  WAYPOINT = 'WAYPOINT',
}

export interface JourneyWaypoint {
  publicId: string;

  type: JourneyWaypointType;

  sequence: number;

  name: string;

  latitude: number;
  longitude: number;

  pickupAllowed: boolean;
  dropoffAllowed: boolean;
}
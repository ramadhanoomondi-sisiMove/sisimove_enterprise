// -----------------------------------------------------------------------------
// sisiMove — Journey Corridor Model
// -----------------------------------------------------------------------------
//
// Represents the route/corridor portion of a Journey.
//
// The corridorKey is a stable discovery/matching identifier. It is intentionally
// treated as an opaque value by the frontend.
// -----------------------------------------------------------------------------

import type { JourneyWaypoint } from './journey-waypoint';

export interface JourneyCorridor {
  publicId: string;

  originName: string;
  destinationName: string;

  originLatitude: number;
  originLongitude: number;

  destinationLatitude: number;
  destinationLongitude: number;

  corridorKey: string | null;

  waypoints: JourneyWaypoint[];
}
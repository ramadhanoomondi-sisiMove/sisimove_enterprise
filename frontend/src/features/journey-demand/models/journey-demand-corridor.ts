// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Corridor
// -----------------------------------------------------------------------------
//
// Presentation/API model for the route component of a JourneyDemand.
//
// A corridor owns its ordered waypoints.
//
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypoint } from './journey-demand-waypoint';

export interface JourneyDemandCorridor {
  /**
   * Public identifier of the corridor.
   */
  publicId: string;

  /**
   * Human-readable origin.
   */
  originName: string;

  /**
   * Human-readable destination.
   */
  destinationName: string;

  /**
   * Origin latitude.
   */
  originLatitude: number;

  /**
   * Origin longitude.
   */
  originLongitude: number;

  /**
   * Destination latitude.
   */
  destinationLatitude: number;

  /**
   * Destination longitude.
   */
  destinationLongitude: number;

  /**
   * Stable discovery/matching identifier.
   *
   * This is NOT a foreign key to JourneyCorridor.
   */
  corridorKey: string | null;

  /**
   * Ordered intermediate locations associated with the corridor.
   */
  waypoints: JourneyDemandWaypoint[];

  createdAt: string;
  updatedAt: string;
}
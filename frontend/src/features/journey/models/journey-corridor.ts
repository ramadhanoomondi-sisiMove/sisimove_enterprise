// -----------------------------------------------------------------------------
// sisiMove — Journey Corridor Model
// -----------------------------------------------------------------------------
//
// Frontend representation of a Journey corridor exposed by the Journey HTTP
// API.
//
// A corridor defines the Journey's origin, destination, geographic coordinates,
// and ordered waypoints.
//
// The corridor is a Journey component and is referenced externally through its
// public identifier. Internal database identifiers and Prisma relations are
// intentionally excluded.
//
// -----------------------------------------------------------------------------

import type { JourneyWaypoint } from './journey-waypoint';

/**
 * Journey corridor.
 *
 * Represents the geographic route definition associated with a Journey.
 */
export interface JourneyCorridor {
  /**
   * Public identifier of the corridor.
   */
  publicId: string;

  /**
   * Human-readable origin name.
   */
  originName: string;

  /**
   * Human-readable destination name.
   */
  destinationName: string;

  /**
   * Geographic latitude of the origin.
   */
  originLatitude: number;

  /**
   * Geographic longitude of the origin.
   */
  originLongitude: number;

  /**
   * Geographic latitude of the destination.
   */
  destinationLatitude: number;

  /**
   * Geographic longitude of the destination.
   */
  destinationLongitude: number;

  /**
   * Stable corridor key used for corridor-level identification or matching,
   * when provided by the API.
   */
  corridorKey?: string | null;

  /**
   * Ordered waypoints belonging to the corridor.
   *
   * The API may omit this collection when the corridor is returned without
   * waypoint expansion.
   */
  waypoints?: JourneyWaypoint[];

  /**
   * Creation timestamp returned by the API, when available.
   */
  createdAt?: string;

  /**
   * Last update timestamp returned by the API, when available.
   */
  updatedAt?: string;
}
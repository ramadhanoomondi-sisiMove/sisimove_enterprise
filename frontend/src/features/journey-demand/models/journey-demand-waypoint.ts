// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint
// -----------------------------------------------------------------------------
//
// Presentation/API model for a waypoint belonging to a JourneyDemandCorridor.
//
// Coordinates are represented as numbers because the HTTP API serializes
// backend Decimal values into JSON-compatible numeric values.
//
// Dates are represented as ISO-8601 strings.
//
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypointType } from './journey-demand-waypoint-type';

export interface JourneyDemandWaypoint {
  /**
   * Public identifier of the waypoint.
   *
   * Safe for frontend routes and API requests.
   */
  publicId: string;

  /**
   * Semantic role of the waypoint.
   */
  type: JourneyDemandWaypointType;

  /**
   * Ordering within the corridor.
   */
  sequence: number;

  /**
   * Human-readable location name.
   */
  name: string;

  /**
   * Geographic latitude.
   */
  latitude: number;

  /**
   * Geographic longitude.
   */
  longitude: number;

  /**
   * Whether the requester requires a pickup at this location.
   */
  pickupRequired: boolean;

  /**
   * Whether the requester requires a drop-off at this location.
   */
  dropoffRequired: boolean;

  createdAt: string;
  updatedAt: string;
}
// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint Model
// -----------------------------------------------------------------------------
//
// Frontend representation of a Journey Demand waypoint.
//
// This model follows JourneyDemandWaypointResponse from the backend mapper.
// Persistence identifiers such as id and corridorId are intentionally absent.
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypointType } from './journey-demand-waypoint-type';

/**
 * Geographic coordinates represented as frontend primitives.
 *
 * The backend mapper converts its coordinate value objects into numbers before
 * this contract reaches the frontend.
 */
export interface JourneyDemandWaypointCoordinates {
  readonly latitude: number;
  readonly longitude: number;
}

/**
 * Journey Demand waypoint response model.
 */
export interface JourneyDemandWaypoint {
  /**
   * Stable public identifier exposed by the backend.
   */
  readonly publicId: string;

  /**
   * Semantic type of this waypoint.
   */
  readonly type: JourneyDemandWaypointType;

  /**
   * Position of the waypoint within the corridor.
   */
  readonly sequence: number;

  /**
   * Human-readable waypoint name.
   */
  readonly name: string;

  /**
   * Geographic position of the waypoint.
   */
  readonly coordinates: JourneyDemandWaypointCoordinates;

  /**
   * Whether this waypoint is required for pickup.
   */
  readonly pickupRequired: boolean;

  /**
   * Whether this waypoint is required for drop-off.
   */
  readonly dropoffRequired: boolean;

  /**
   * Backend creation timestamp represented as a frontend Date.
   */
  readonly createdAt: Date;

  /**
   * Backend last-update timestamp represented as a frontend Date.
   */
  readonly updatedAt: Date;
}
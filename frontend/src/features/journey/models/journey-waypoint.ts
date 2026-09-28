// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for a Journey waypoint.
//
// A waypoint is owned by the Journey corridor. It is therefore represented as
// part of the Journey route rather than as an independent frontend resource.
//
// This model mirrors the backend public/My Journey projection rather than the
// Prisma persistence model.
//
// Important:
// - publicId is the frontend-visible identity;
// - type does NOT determine pickup/dropoff permissions;
// - pickupAllowed and dropoffAllowed are independent domain fields;
// - sequence is supplied by the backend and represents route ordering;
// - coordinates are represented as numbers at the frontend boundary;
// - timestamps are included because the current MyJourney/Public Journey
//   waypoint response contracts expose them where applicable.
//
// The frontend must not recreate JourneyWaypointEntity behavior.
//
// -----------------------------------------------------------------------------

import type { JourneyWaypointType } from './journey-waypoint-type';

/**
 * Journey waypoint read model.
 */
export interface JourneyWaypoint {
  /**
   * Public Journey waypoint identifier.
   *
   * Internal persistence identifiers are intentionally not exposed.
   */
  readonly publicId: string;

  /**
   * Semantic type of the waypoint.
   */
  readonly type: JourneyWaypointType;

  /**
   * Position of the waypoint within the Journey corridor.
   */
  readonly sequence: number;

  /**
   * Human-readable waypoint name.
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
   * Whether passengers may be picked up at this waypoint.
   *
   * This is independent of `type`.
   */
  readonly pickupAllowed: boolean;

  /**
   * Whether passengers may be dropped off at this waypoint.
   *
   * This is independent of `type`.
   */
  readonly dropoffAllowed: boolean;

  /**
   * Backend creation timestamp represented as an ISO string at the frontend
   * HTTP boundary.
   */
  readonly createdAt: string;

  /**
   * Backend last-update timestamp represented as an ISO string.
   */
  readonly updatedAt: string;
}
// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint Model
// -----------------------------------------------------------------------------
//
// Frontend representation of a Journey waypoint exposed by the Journey HTTP
// API.
//
// A waypoint belongs to a Journey corridor and describes a location along the
// route where the journey may originate, terminate, pick up, drop off, or
// simply pass through.
//
// The Journey controller exposes waypoint references and waypoint resources
// through public IDs. Internal database IDs are never part of this model.
//
// -----------------------------------------------------------------------------

import type { JourneyWaypointType } from './journey-waypoint-type';

/**
 * Journey waypoint.
 *
 * This model intentionally uses public identifiers only. It mirrors the
 * externally meaningful waypoint representation rather than the Prisma
 * persistence model.
 */
export interface JourneyWaypoint {
  /**
   * Public identifier of the waypoint.
   */
  publicId: string;

  /**
   * Semantic role of the waypoint within the Journey corridor.
   */
  type: JourneyWaypointType;

  /**
   * Position of the waypoint within the corridor sequence.
   */
  sequence: number;

  /**
   * Human-readable waypoint name.
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
   * Whether passengers may be picked up at this waypoint.
   */
  pickupAllowed: boolean;

  /**
   * Whether passengers may be dropped off at this waypoint.
   */
  dropoffAllowed: boolean;

  /**
   * Creation timestamp returned by the API, when available.
   */
  createdAt?: string;

  /**
   * Last update timestamp returned by the API, when available.
   */
  updatedAt?: string;
}
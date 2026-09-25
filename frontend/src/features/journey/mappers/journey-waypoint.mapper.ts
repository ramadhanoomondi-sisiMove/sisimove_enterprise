// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint Mapper
// -----------------------------------------------------------------------------
//
// Maps the raw Journey waypoint API representation into the stable frontend
// JourneyWaypoint model.
//
// Architectural boundary:
//
//   HTTP API response
//       │
//       ▼
//   mapJourneyWaypoint()
//       │
//       ▼
//   JourneyWaypoint model
//       │
//       ▼
//   Hooks / Components
//
// This mapper is responsible only for transport-to-model normalization:
//
// - public identifiers remain opaque strings;
// - geographic coordinates are normalized to numbers;
// - lifecycle timestamps remain ISO-8601 strings;
// - no UI formatting is performed;
// - no persistence types are exposed.
//
// The Journey controller exposes waypoints through public identifiers. This
// mapper therefore does not introduce internal database identifiers.
//
// -----------------------------------------------------------------------------

import type { JourneyWaypoint } from '../models';

/**
 * Raw Journey waypoint representation returned by the HTTP API.
 *
 * Geographic values may be serialized as numbers or decimal strings depending
 * on the backend serialization path.
 */
export interface JourneyWaypointApiResponse {
  /**
   * Public identifier of the waypoint.
   */
  publicId: string;

  /**
   * Semantic waypoint type.
   */
  type: JourneyWaypoint['type'];

  /**
   * Position within the Journey corridor.
   */
  sequence: number;

  /**
   * Human-readable waypoint name.
   */
  name: string;

  /**
   * Geographic latitude.
   */
  latitude: number | string;

  /**
   * Geographic longitude.
   */
  longitude: number | string;

  /**
   * Whether passenger pickup is permitted.
   */
  pickupAllowed: boolean;

  /**
   * Whether passenger dropoff is permitted.
   */
  dropoffAllowed: boolean;

  /**
   * Creation timestamp, when provided.
   */
  createdAt?: string;

  /**
   * Last update timestamp, when provided.
   */
  updatedAt?: string;
}

/**
 * Map a raw Journey waypoint API representation into the frontend model.
 *
 * @param waypoint Raw waypoint representation returned by the Journey API.
 * @returns Stable frontend JourneyWaypoint model.
 */
export function mapJourneyWaypoint(
  waypoint: JourneyWaypointApiResponse,
): JourneyWaypoint {
  return {
    publicId: waypoint.publicId,
    type: waypoint.type,
    sequence: waypoint.sequence,
    name: waypoint.name,
    latitude: Number(waypoint.latitude),
    longitude: Number(waypoint.longitude),
    pickupAllowed: waypoint.pickupAllowed,
    dropoffAllowed: waypoint.dropoffAllowed,
    createdAt: waypoint.createdAt,
    updatedAt: waypoint.updatedAt,
  };
}
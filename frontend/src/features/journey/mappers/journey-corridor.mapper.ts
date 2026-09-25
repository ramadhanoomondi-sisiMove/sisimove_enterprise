// -----------------------------------------------------------------------------
// sisiMove — Journey Corridor Mapper
// -----------------------------------------------------------------------------
//
// Maps the raw Journey corridor API representation into the stable frontend
// JourneyCorridor model.
//
// Architectural boundary:
//
//   HTTP API response
//       │
//       ▼
//   mapJourneyCorridor()
//       │
//       ▼
//   JourneyCorridor model
//       │
//       ▼
//   Hooks / Components
//
// This mapper is intentionally defensive at the transport boundary:
//
// - public identifiers remain strings;
// - geographic coordinates are normalized to numbers;
// - optional waypoint collections remain optional;
// - API timestamps remain ISO-8601 strings;
// - no UI formatting is performed here;
// - no persistence concerns are introduced.
//
// The mapper does NOT fetch related resources. Waypoints are mapped only when
// they are already included in the API response.
//
// -----------------------------------------------------------------------------

import type { JourneyCorridor, JourneyWaypoint } from '../models';

/**
 * Raw waypoint representation accepted from the Journey HTTP API.
 *
 * This intentionally mirrors only the externally consumable fields required
 * by the frontend model. It is not a Prisma type.
 */
interface JourneyWaypointApiResponse {
  publicId: string;
  type: JourneyWaypoint['type'];
  sequence: number;
  name: string;
  latitude: number | string;
  longitude: number | string;
  pickupAllowed: boolean;
  dropoffAllowed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Raw corridor representation accepted from the Journey HTTP API.
 *
 * Geographic values may arrive as numbers or decimal strings depending on the
 * backend serialization path.
 */
export interface JourneyCorridorApiResponse {
  publicId: string;
  originName: string;
  destinationName: string;
  originLatitude: number | string;
  originLongitude: number | string;
  destinationLatitude: number | string;
  destinationLongitude: number | string;
  corridorKey?: string | null;
  waypoints?: JourneyWaypointApiResponse[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Map a raw Journey waypoint API representation.
 */
function mapJourneyWaypoint(
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

/**
 * Map a raw Journey corridor API representation into the frontend model.
 *
 * @param corridor Raw corridor representation returned by the Journey API.
 * @returns Stable frontend JourneyCorridor model.
 */
export function mapJourneyCorridor(
  corridor: JourneyCorridorApiResponse,
): JourneyCorridor {
  return {
    publicId: corridor.publicId,
    originName: corridor.originName,
    destinationName: corridor.destinationName,
    originLatitude: Number(corridor.originLatitude),
    originLongitude: Number(corridor.originLongitude),
    destinationLatitude: Number(corridor.destinationLatitude),
    destinationLongitude: Number(corridor.destinationLongitude),
    corridorKey: corridor.corridorKey,
    waypoints: corridor.waypoints?.map(mapJourneyWaypoint),
    createdAt: corridor.createdAt,
    updatedAt: corridor.updatedAt,
  };
}
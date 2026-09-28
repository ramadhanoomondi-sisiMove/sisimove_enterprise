// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend JourneyDemandWaypointResponse contract into the frontend
// JourneyDemandWaypoint application model.
//
// IMPORTANT:
// - This mapper does not recreate a domain entity.
// - Persistence identifiers such as `id` and `corridorId` are intentionally
//   not represented in the frontend model.
// - Geographic primitives are composed into the frontend `coordinates`
//   object.
// - Backend-provided state is copied as supplied; no lifecycle or semantic
//   rules are reconstructed here.
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypoint } from '../models/journey-demand-waypoint';
import type { JourneyDemandWaypointType } from '../models/journey-demand-waypoint-type';

/**
 * Backend HTTP/application response consumed by this mapper.
 *
 * The mapper deliberately declares only the fields required to construct the
 * frontend model rather than coupling the frontend to Prisma persistence
 * fields.
 */
export interface JourneyDemandWaypointResponse {
  readonly publicId: string;
  readonly type: JourneyDemandWaypointType;
  readonly sequence: number;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly pickupRequired: boolean;
  readonly dropoffRequired: boolean;
  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
}

/**
 * Maps one backend Journey Demand waypoint response into the frontend model.
 */
export function mapJourneyDemandWaypoint(
  response: JourneyDemandWaypointResponse,
): JourneyDemandWaypoint {
  return {
    publicId: response.publicId,
    type: response.type,
    sequence: response.sequence,
    name: response.name,

    coordinates: {
      latitude: response.latitude,
      longitude: response.longitude,
    },

    pickupRequired: response.pickupRequired,
    dropoffRequired: response.dropoffRequired,

    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}

/**
 * Maps a collection of backend waypoint responses.
 */
export function mapJourneyDemandWaypoints(
  responses: readonly JourneyDemandWaypointResponse[],
): readonly JourneyDemandWaypoint[] {
  return responses.map(mapJourneyDemandWaypoint);
}
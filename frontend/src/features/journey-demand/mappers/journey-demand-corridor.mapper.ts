// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Corridor Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend JourneyDemandCorridorResponse contract into the frontend
// JourneyDemandCorridor model.
//
// The frontend corridor model intentionally exposes:
// - publicId;
// - human-readable origin/destination;
// - composed coordinate objects;
// - optional corridorKey;
// - mapped waypoints;
// - timestamps.
//
// Persistence identifiers and aggregate relation identifiers are not exposed.
// -----------------------------------------------------------------------------

import type { JourneyDemandCorridor } from '../models/journey-demand-corridor';
import type { JourneyDemandWaypoint } from '../models/journey-demand-waypoint';

import {
  mapJourneyDemandWaypoint,
  type JourneyDemandWaypointResponse,
} from './journey-demand-waypoint.mapper';

/**
 * Backend HTTP/application response consumed by this mapper.
 */
export interface JourneyDemandCorridorResponse {
  readonly publicId: string;
  readonly originName: string;
  readonly destinationName: string;

  readonly originLatitude: number;
  readonly originLongitude: number;

  readonly destinationLatitude: number;
  readonly destinationLongitude: number;

  /**
   * The backend may omit the normalized corridor key by returning null.
   *
   * The frontend model represents absence as `undefined`.
   */
  readonly corridorKey: string | null;

  readonly waypoints: readonly JourneyDemandWaypointResponse[];

  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
}

/**
 * Maps one backend Journey Demand corridor response.
 */
export function mapJourneyDemandCorridor(
  response: JourneyDemandCorridorResponse,
): JourneyDemandCorridor {
  return {
    publicId: response.publicId,

    originName: response.originName,
    destinationName: response.destinationName,

    originCoordinates: {
      latitude: response.originLatitude,
      longitude: response.originLongitude,
    },

    destinationCoordinates: {
      latitude: response.destinationLatitude,
      longitude: response.destinationLongitude,
    },

    // Backend nullability is normalized at the HTTP/application boundary.
    corridorKey: response.corridorKey ?? undefined,

    waypoints: response.waypoints.map(mapJourneyDemandWaypoint),

    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}

/**
 * Explicit collection mapper retained for consumers that receive corridors
 * as a collection.
 */
export function mapJourneyDemandCorridors(
  responses: readonly JourneyDemandCorridorResponse[],
): readonly JourneyDemandCorridor[] {
  return responses.map(mapJourneyDemandCorridor);
}
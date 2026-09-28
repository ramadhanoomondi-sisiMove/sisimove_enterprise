// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Corridor Model
// -----------------------------------------------------------------------------
//
// Frontend representation of JourneyDemandCorridorResponse.
//
// The backend owns corridor semantics and persistence. The frontend consumes
// the already-composed response contract.
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypoint } from './journey-demand-waypoint';

export interface JourneyDemandCorridorCoordinates {
  readonly latitude: number;
  readonly longitude: number;
}

/**
 * Journey Demand corridor response model.
 */
export interface JourneyDemandCorridor {
  /**
   * Stable public identifier exposed by the backend.
   */
  readonly publicId: string;

  /**
   * Human-readable origin.
   */
  readonly originName: string;

  /**
   * Human-readable destination.
   */
  readonly destinationName: string;

  /**
   * Origin geographic coordinates.
   */
  readonly originCoordinates: JourneyDemandCorridorCoordinates;

  /**
   * Destination geographic coordinates.
   */
  readonly destinationCoordinates: JourneyDemandCorridorCoordinates;

  /**
   * Optional normalized corridor identifier.
   */
  readonly corridorKey: string | undefined;

  /**
   * Ordered waypoint collection supplied by the backend.
   */
  readonly waypoints: readonly JourneyDemandWaypoint[];

  /**
   * Backend creation timestamp.
   */
  readonly createdAt: Date;

  /**
   * Backend last-update timestamp.
   */
  readonly updatedAt: Date;
}
// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend Journey Waypoint projection into the frontend
// JourneyWaypoint model.
//
// This mapper performs representation translation only.
//
// It does not:
// - validate domain invariants;
// - infer pickup/dropoff permissions from waypoint type;
// - reorder waypoints;
// - create missing waypoints;
// - apply Journey lifecycle rules.
//
// Those responsibilities remain with the backend.
//
// The mapper preserves the complete JourneyWaypoint projection exposed by the
// backend, including lifecycle timestamps.
//
// -----------------------------------------------------------------------------

import type { JourneyWaypoint } from "../models/journey-waypoint";
import type { JourneyWaypointType } from "../models/journey-waypoint-type";

export interface JourneyWaypointResponse {
  readonly publicId: string;
  readonly type: string;
  readonly sequence: number;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly pickupAllowed: boolean;
  readonly dropoffAllowed: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export const JourneyWaypointMapper = {
  fromResponse(response: JourneyWaypointResponse): JourneyWaypoint {
    return {
      publicId: response.publicId,
      type: response.type as JourneyWaypointType,
      sequence: response.sequence,
      name: response.name,
      latitude: response.latitude,
      longitude: response.longitude,
      pickupAllowed: response.pickupAllowed,
      dropoffAllowed: response.dropoffAllowed,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  },

  fromResponses(
    responses: readonly JourneyWaypointResponse[],
  ): JourneyWaypoint[] {
    return responses.map((response) =>
      JourneyWaypointMapper.fromResponse(response),
    );
  },
};
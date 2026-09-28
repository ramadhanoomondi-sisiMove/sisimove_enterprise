// -----------------------------------------------------------------------------
// sisiMove — Journey Route Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend Journey corridor projection into the frontend
// JourneyRoute model.
//
// The backend calls this structure a corridor while the frontend presents it
// as a route because "route" is the marketplace/user-facing concept.
//
// Corridor identifiers and internal persistence fields are intentionally not
// exposed because they are not part of the frontend JourneyRoute model.
//
// -----------------------------------------------------------------------------

import type {
  JourneyRoute,
  JourneyRoutePoint,
} from "../models/journey-route";
import { JourneyWaypointMapper } from "./journey-waypoint.mapper";
import type { JourneyWaypointResponse } from "./journey-waypoint.mapper";

export interface JourneyRouteResponse {
  readonly originName: string;
  readonly originLatitude: number;
  readonly originLongitude: number;
  readonly destinationName: string;
  readonly destinationLatitude: number;
  readonly destinationLongitude: number;
  readonly waypoints: readonly JourneyWaypointResponse[];
}

function mapPoint(
  name: string,
  latitude: number,
  longitude: number,
): JourneyRoutePoint {
  return {
    name,
    latitude,
    longitude,
  };
}

export const JourneyRouteMapper = {
  fromResponse(response: JourneyRouteResponse): JourneyRoute {
    return {
      origin: mapPoint(
        response.originName,
        response.originLatitude,
        response.originLongitude,
      ),
      destination: mapPoint(
        response.destinationName,
        response.destinationLatitude,
        response.destinationLongitude,
      ),
      waypoints: JourneyWaypointMapper.fromResponses(response.waypoints),
    };
  },
};
// -----------------------------------------------------------------------------
// sisiMove — Journey Route Model
// -----------------------------------------------------------------------------
//
// Shared frontend projection of a Journey route.
//
// This model is intentionally based on the Journey HTTP read projections,
// rather than the Prisma JourneyCorridor entity.
//
// The backend public and authenticated Journey projections expose the route as:
//
//   route
//   ├── origin
//   ├── destination
//   └── waypoints
//
// Corridor persistence identifiers and corridorKey are intentionally excluded
// because they are not part of the supplied PublicJourneyResponse or
// MyJourneyResponse contracts.
//
// -----------------------------------------------------------------------------

import type { JourneyWaypoint } from "./journey-waypoint";

// -----------------------------------------------------------------------------
// Route Point
// -----------------------------------------------------------------------------

export interface JourneyRoutePoint {
  /**
   * Human-readable location name.
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
}

// -----------------------------------------------------------------------------
// Journey Route
// -----------------------------------------------------------------------------

export interface JourneyRoute {
  /**
   * Journey origin.
   */
  readonly origin: JourneyRoutePoint;

  /**
   * Journey destination.
   */
  readonly destination: JourneyRoutePoint;

  /**
   * Optional intermediate Journey waypoints.
   *
   * The backend projection returns an array even when the Journey has no
   * waypoints, so the frontend represents this as a readonly collection.
   */
  readonly waypoints: readonly JourneyWaypoint[];
}
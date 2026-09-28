// src/features/journey/api/waypoints/index.ts

// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint API
// -----------------------------------------------------------------------------
//
// Barrel exports for Journey waypoint mutations.
// -----------------------------------------------------------------------------

export {
  addJourneyWaypoint,
} from "./add-journey-waypoint";

export type {
  AddJourneyWaypointRequest,
} from "./add-journey-waypoint";

export {
  removeJourneyWaypoint,
} from "./remove-journey-waypoint";
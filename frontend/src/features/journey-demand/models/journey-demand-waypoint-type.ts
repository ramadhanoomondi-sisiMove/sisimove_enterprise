// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoint Type
// -----------------------------------------------------------------------------
//
// Frontend representation of JourneyDemandWaypointType.
//
// Mirrors the backend enum:
//
//     ORIGIN
//     DESTINATION
//     PICKUP
//     DROPOFF
//     WAYPOINT
//
// This is a transport/presentation contract. It is intentionally independent
// of Prisma.
//
// -----------------------------------------------------------------------------

export const JOURNEY_DEMAND_WAYPOINT_TYPES = [
  'ORIGIN',
  'DESTINATION',
  'PICKUP',
  'DROPOFF',
  'WAYPOINT',
] as const;

export type JourneyDemandWaypointType =
  (typeof JOURNEY_DEMAND_WAYPOINT_TYPES)[number];
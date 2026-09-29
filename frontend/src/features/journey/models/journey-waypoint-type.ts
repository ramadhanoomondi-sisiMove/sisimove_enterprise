// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint Type Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for Journey waypoint types.
//
// This model mirrors the backend JourneyWaypointType enum exactly.
//
// The frontend uses these values for:
// - rendering waypoint labels;
// - distinguishing origin/destination/pickup/dropoff/ordinary waypoints;
// - mapping API responses into frontend models.
//
// The frontend must NOT infer pickup/dropoff permissions from the waypoint
// type. Those permissions are independent fields on JourneyWaypoint:
//
//   - pickupAllowed
//   - dropoffAllowed
//
// The backend aggregate remains authoritative for waypoint invariants and
// mutation rules.
//
// -----------------------------------------------------------------------------

/**
 * Journey waypoint type.
 *
 * Corresponds exactly to the backend JourneyWaypointType enum:
 *
 *   ORIGIN
 *   DESTINATION
 *   PICKUP
 *   DROPOFF
 *   WAYPOINT
 */
export type JourneyWaypointType =
  | "ORIGIN"
  | "DESTINATION"
  | "PICKUP"
  | "DROPOFF"
  | "WAYPOINT";

/**
 * Runtime collection of all supported Journey waypoint types.
 *
 * Keeping the values in one place allows API mappers and UI configuration
 * to validate external values without importing backend/domain code.
 */
export const JOURNEY_WAYPOINT_TYPES = [
  "ORIGIN",
  "DESTINATION",
  "PICKUP",
  "DROPOFF",
  "WAYPOINT",
] as const satisfies readonly JourneyWaypointType[];

/**
 * Runtime guard for values received from an external boundary such as
 * an API response.
 */
export function isJourneyWaypointType(
  value: string,
): value is JourneyWaypointType {
  return (JOURNEY_WAYPOINT_TYPES as readonly string[]).includes(value);
}
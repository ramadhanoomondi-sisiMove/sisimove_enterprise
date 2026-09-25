// -----------------------------------------------------------------------------
// sisiMove — Journey Waypoint Type
// -----------------------------------------------------------------------------
//
// Stable frontend representation of the JourneyWaypointType enum exposed by
// the Journey HTTP API.
//
// Backend:
//
//   ORIGIN
//   DESTINATION
//   PICKUP
//   DROPOFF
//   WAYPOINT
//
// This type describes the semantic role of a waypoint within a Journey
// corridor. It does not describe whether pickup or dropoff is currently
// permitted; those capabilities belong to the waypoint model itself.
//
// -----------------------------------------------------------------------------

/**
 * Semantic type of a Journey waypoint.
 */
export type JourneyWaypointType =
  | 'ORIGIN'
  | 'DESTINATION'
  | 'PICKUP'
  | 'DROPOFF'
  | 'WAYPOINT';

/**
 * All supported Journey waypoint types.
 *
 * Kept as a readonly tuple for safe runtime iteration, validation, filtering,
 * and UI option generation.
 */
export const JOURNEY_WAYPOINT_TYPES = [
  'ORIGIN',
  'DESTINATION',
  'PICKUP',
  'DROPOFF',
  'WAYPOINT',
] as const satisfies readonly JourneyWaypointType[];

/**
 * Runtime guard for JourneyWaypointType.
 */
export function isJourneyWaypointType(
  value: unknown,
): value is JourneyWaypointType {
  return (
    typeof value === 'string' &&
    (JOURNEY_WAYPOINT_TYPES as readonly string[]).includes(value)
  );
}
// -----------------------------------------------------------------------------
// sisiMove — Journey Smoking Policy
// -----------------------------------------------------------------------------
//
// Stable frontend representation of the JourneySmokingPolicy enum exposed by
// the Journey HTTP API.
//
// Backend:
//
//   ALLOWED
//   NOT_ALLOWED
//
// This model describes the smoking policy configured for a Journey. It is a
// Journey preference and does not represent a user's personal preference.
//
// -----------------------------------------------------------------------------

/**
 * Smoking policy for a Journey.
 */
export type JourneySmokingPolicy =
  | 'ALLOWED'
  | 'NOT_ALLOWED';

/**
 * All supported Journey smoking policies.
 *
 * Kept as a readonly tuple for runtime iteration, validation, and UI option
 * generation.
 */
export const JOURNEY_SMOKING_POLICIES = [
  'ALLOWED',
  'NOT_ALLOWED',
] as const satisfies readonly JourneySmokingPolicy[];

/**
 * Runtime guard for JourneySmokingPolicy.
 */
export function isJourneySmokingPolicy(
  value: unknown,
): value is JourneySmokingPolicy {
  return (
    typeof value === 'string' &&
    (JOURNEY_SMOKING_POLICIES as readonly string[]).includes(value)
  );
}
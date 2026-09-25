// -----------------------------------------------------------------------------
// sisiMove — Journey Luggage Policy
// -----------------------------------------------------------------------------
//
// Stable frontend representation of the JourneyLuggagePolicy enum exposed by
// the Journey HTTP API.
//
// Backend:
//
//   NONE
//   LIMITED
//   STANDARD
//   LARGE
//
// This model describes the luggage capacity policy configured for a Journey.
// It does not represent a passenger's individual luggage requirements.
//
// -----------------------------------------------------------------------------

/**
 * Luggage policy for a Journey.
 */
export type JourneyLuggagePolicy =
  | 'NONE'
  | 'LIMITED'
  | 'STANDARD'
  | 'LARGE';

/**
 * All supported Journey luggage policies.
 *
 * Kept as a readonly tuple for runtime iteration, validation, filtering,
 * and UI option generation.
 */
export const JOURNEY_LUGGAGE_POLICIES = [
  'NONE',
  'LIMITED',
  'STANDARD',
  'LARGE',
] as const satisfies readonly JourneyLuggagePolicy[];

/**
 * Runtime guard for JourneyLuggagePolicy.
 */
export function isJourneyLuggagePolicy(
  value: unknown,
): value is JourneyLuggagePolicy {
  return (
    typeof value === 'string' &&
    (JOURNEY_LUGGAGE_POLICIES as readonly string[]).includes(value)
  );
}
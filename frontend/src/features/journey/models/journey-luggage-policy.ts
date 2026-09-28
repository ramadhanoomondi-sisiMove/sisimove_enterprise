// -----------------------------------------------------------------------------
// sisiMove — Journey Luggage Policy Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for the Journey luggage policy.
//
// This model mirrors the backend JourneyLuggagePolicy enum exactly.
//
// The frontend uses this value for:
// - displaying Journey preferences;
// - preference editing controls;
// - API response mapping.
//
// The frontend does not calculate luggage capacity or enforce luggage rules.
// Those concerns remain within the backend Journey domain/application layer.
//
// -----------------------------------------------------------------------------

/**
 * Journey luggage policy.
 *
 * Corresponds exactly to the backend JourneyLuggagePolicy enum:
 *
 *   NONE
 *   LIMITED
 *   STANDARD
 *   LARGE
 */
export type JourneyLuggagePolicy =
  | 'NONE'
  | 'LIMITED'
  | 'STANDARD'
  | 'LARGE';

/**
 * Runtime collection of all supported luggage policies.
 */
export const JOURNEY_LUGGAGE_POLICIES = [
  'NONE',
  'LIMITED',
  'STANDARD',
  'LARGE',
] as const satisfies readonly JourneyLuggagePolicy[];

/**
 * Runtime guard for values received from the API.
 */
export function isJourneyLuggagePolicy(
  value: string,
): value is JourneyLuggagePolicy {
  return (JOURNEY_LUGGAGE_POLICIES as readonly string[]).includes(value);
}
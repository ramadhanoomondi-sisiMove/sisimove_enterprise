// -----------------------------------------------------------------------------
// sisiMove — Journey Smoking Policy Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for the Journey smoking policy.
//
// This model mirrors the backend JourneySmokingPolicy enum exactly.
//
// The frontend uses this value to:
// - display the provider's Journey preference;
// - populate preference presentation/editing controls;
// - map API responses safely.
//
// It does NOT determine whether a policy may be changed. Journey component
// mutation rules remain owned by the backend Journey aggregate.
//
// -----------------------------------------------------------------------------

/**
 * Journey smoking policy.
 *
 * Corresponds exactly to the backend JourneySmokingPolicy enum:
 *
 *   ALLOWED
 *   NOT_ALLOWED
 */
export type JourneySmokingPolicy =
  | 'ALLOWED'
  | 'NOT_ALLOWED';

/**
 * Runtime collection of all supported smoking policies.
 */
export const JOURNEY_SMOKING_POLICIES = [
  'ALLOWED',
  'NOT_ALLOWED',
] as const satisfies readonly JourneySmokingPolicy[];

/**
 * Runtime guard for values received from the API.
 */
export function isJourneySmokingPolicy(
  value: string,
): value is JourneySmokingPolicy {
  return (JOURNEY_SMOKING_POLICIES as readonly string[]).includes(value);
}
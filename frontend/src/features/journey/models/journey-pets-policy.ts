// -----------------------------------------------------------------------------
// sisiMove — Journey Pets Policy Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for the Journey pets policy.
//
// This model mirrors the backend JourneyPetsPolicy enum exactly.
//
// The frontend uses this value for:
// - displaying Journey preferences;
// - preference editing controls;
// - API response mapping.
//
// The frontend does not interpret or enforce the policy beyond presentation
// and input selection. Domain validation remains a backend responsibility.
//
// -----------------------------------------------------------------------------

/**
 * Journey pets policy.
 *
 * Corresponds exactly to the backend JourneyPetsPolicy enum:
 *
 *   ALLOWED
 *   NOT_ALLOWED
 *   SERVICE_ANIMALS_ONLY
 */
export type JourneyPetsPolicy =
  | 'ALLOWED'
  | 'NOT_ALLOWED'
  | 'SERVICE_ANIMALS_ONLY';

/**
 * Runtime collection of all supported pets policies.
 */
export const JOURNEY_PETS_POLICIES = [
  'ALLOWED',
  'NOT_ALLOWED',
  'SERVICE_ANIMALS_ONLY',
] as const satisfies readonly JourneyPetsPolicy[];

/**
 * Runtime guard for values received from the API.
 */
export function isJourneyPetsPolicy(
  value: string,
): value is JourneyPetsPolicy {
  return (JOURNEY_PETS_POLICIES as readonly string[]).includes(value);
}
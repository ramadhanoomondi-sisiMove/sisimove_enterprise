// -----------------------------------------------------------------------------
// sisiMove — Journey Pets Policy
// -----------------------------------------------------------------------------
//
// Stable frontend representation of the JourneyPetsPolicy enum exposed by
// the Journey HTTP API.
//
// Backend:
//
//   ALLOWED
//   NOT_ALLOWED
//   SERVICE_ANIMALS_ONLY
//
// This model describes the pet policy configured for a Journey. It does not
// represent a passenger's personal needs or preferences.
//
// -----------------------------------------------------------------------------

/**
 * Pets policy for a Journey.
 */
export type JourneyPetsPolicy =
  | 'ALLOWED'
  | 'NOT_ALLOWED'
  | 'SERVICE_ANIMALS_ONLY';

/**
 * All supported Journey pets policies.
 *
 * Kept as a readonly tuple for runtime iteration, validation, filtering,
 * and UI option generation.
 */
export const JOURNEY_PETS_POLICIES = [
  'ALLOWED',
  'NOT_ALLOWED',
  'SERVICE_ANIMALS_ONLY',
] as const satisfies readonly JourneyPetsPolicy[];

/**
 * Runtime guard for JourneyPetsPolicy.
 */
export function isJourneyPetsPolicy(
  value: unknown,
): value is JourneyPetsPolicy {
  return (
    typeof value === 'string' &&
    (JOURNEY_PETS_POLICIES as readonly string[]).includes(value)
  );
}
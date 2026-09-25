// -----------------------------------------------------------------------------
// sisiMove — Journey Music Preference
// -----------------------------------------------------------------------------
//
// Stable frontend representation of the JourneyMusicPreference enum exposed
// by the Journey HTTP API.
//
// Backend:
//
//   NONE
//   LOW
//   MODERATE
//   ANY
//
// This model describes the music environment preferred for a Journey. It does
// not represent a user's permanent music preference.
//
// -----------------------------------------------------------------------------

/**
 * Music preference for a Journey.
 */
export type JourneyMusicPreference =
  | 'NONE'
  | 'LOW'
  | 'MODERATE'
  | 'ANY';

/**
 * All supported Journey music preferences.
 *
 * Kept as a readonly tuple for runtime iteration, validation, filtering,
 * and UI option generation.
 */
export const JOURNEY_MUSIC_PREFERENCES = [
  'NONE',
  'LOW',
  'MODERATE',
  'ANY',
] as const satisfies readonly JourneyMusicPreference[];

/**
 * Runtime guard for JourneyMusicPreference.
 */
export function isJourneyMusicPreference(
  value: unknown,
): value is JourneyMusicPreference {
  return (
    typeof value === 'string' &&
    (JOURNEY_MUSIC_PREFERENCES as readonly string[]).includes(value)
  );
}
// -----------------------------------------------------------------------------
// sisiMove — Journey Music Preference Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for the Journey music preference.
//
// This model mirrors the backend JourneyMusicPreference enum exactly.
//
// The frontend uses this value for:
// - displaying Journey preferences;
// - preference editing controls;
// - API response mapping.
//
// The frontend does not enforce the preference as a domain rule. The backend
// Journey aggregate/application layer remains authoritative.
//
// -----------------------------------------------------------------------------

/**
 * Journey music preference.
 *
 * Corresponds exactly to the backend JourneyMusicPreference enum:
 *
 *   NONE
 *   LOW
 *   MODERATE
 *   ANY
 */
export type JourneyMusicPreference =
  | 'NONE'
  | 'LOW'
  | 'MODERATE'
  | 'ANY';

/**
 * Runtime collection of all supported music preferences.
 */
export const JOURNEY_MUSIC_PREFERENCES = [
  'NONE',
  'LOW',
  'MODERATE',
  'ANY',
] as const satisfies readonly JourneyMusicPreference[];

/**
 * Runtime guard for values received from the API.
 */
export function isJourneyMusicPreference(
  value: string,
): value is JourneyMusicPreference {
  return (JOURNEY_MUSIC_PREFERENCES as readonly string[]).includes(value);
}
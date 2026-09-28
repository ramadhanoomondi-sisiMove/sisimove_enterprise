// -----------------------------------------------------------------------------
// sisiMove — Journey Conversation Preference Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for the Journey conversation preference.
//
// This model mirrors the backend JourneyConversationPreference enum exactly.
//
// The frontend uses this value for:
// - displaying Journey preferences;
// - preference editing controls;
// - API response mapping.
//
// It does not determine or enforce Journey behavior. The backend remains the
// authoritative source for Journey preference validation and mutation rules.
//
// -----------------------------------------------------------------------------

/**
 * Journey conversation preference.
 *
 * Corresponds exactly to the backend JourneyConversationPreference enum:
 *
 *   QUIET
 *   MODERATE
 *   SOCIAL
 */
export type JourneyConversationPreference =
  | 'QUIET'
  | 'MODERATE'
  | 'SOCIAL';

/**
 * Runtime collection of all supported conversation preferences.
 */
export const JOURNEY_CONVERSATION_PREFERENCES = [
  'QUIET',
  'MODERATE',
  'SOCIAL',
] as const satisfies readonly JourneyConversationPreference[];

/**
 * Runtime guard for values received from the API.
 */
export function isJourneyConversationPreference(
  value: string,
): value is JourneyConversationPreference {
  return (JOURNEY_CONVERSATION_PREFERENCES as readonly string[]).includes(
    value,
  );
}
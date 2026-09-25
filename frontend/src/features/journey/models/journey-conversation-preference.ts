// -----------------------------------------------------------------------------
// sisiMove — Journey Conversation Preference
// -----------------------------------------------------------------------------
//
// Stable frontend representation of the JourneyConversationPreference enum
// exposed by the Journey HTTP API.
//
// Backend:
//
//   QUIET
//   MODERATE
//   SOCIAL
//
// This model describes the conversation environment preferred for a Journey.
// It does not represent a user's permanent communication preference.
//
// -----------------------------------------------------------------------------

/**
 * Conversation preference for a Journey.
 */
export type JourneyConversationPreference =
  | 'QUIET'
  | 'MODERATE'
  | 'SOCIAL';

/**
 * All supported Journey conversation preferences.
 *
 * Kept as a readonly tuple for runtime iteration, validation, filtering,
 * and UI option generation.
 */
export const JOURNEY_CONVERSATION_PREFERENCES = [
  'QUIET',
  'MODERATE',
  'SOCIAL',
] as const satisfies readonly JourneyConversationPreference[];

/**
 * Runtime guard for JourneyConversationPreference.
 */
export function isJourneyConversationPreference(
  value: unknown,
): value is JourneyConversationPreference {
  return (
    typeof value === 'string' &&
    (JOURNEY_CONVERSATION_PREFERENCES as readonly string[]).includes(value)
  );
}
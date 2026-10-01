// -----------------------------------------------------------------------------
// sisiMove — Public Journey Preferences
// -----------------------------------------------------------------------------
//
// Traveller-facing preferences attached to a Journey.
//
// These frontend types intentionally do not import Prisma enums. The frontend
// owns its public API contract independently from the backend persistence
// implementation.
// -----------------------------------------------------------------------------

export type PublicJourneySmokingPolicy =
  | "ALLOWED"
  | "NOT_ALLOWED";

export type PublicJourneyPetsPolicy =
  | "ALLOWED"
  | "NOT_ALLOWED"
  | "SERVICE_ANIMALS_ONLY";

export type PublicJourneyLuggagePolicy =
  | "NONE"
  | "LIMITED"
  | "STANDARD"
  | "LARGE";

export type PublicJourneyConversationPreference =
  | "QUIET"
  | "MODERATE"
  | "SOCIAL";

export type PublicJourneyMusicPreference =
  | "NONE"
  | "LOW"
  | "MODERATE"
  | "ANY";

export interface PublicJourneyPreferences {
  smoking: PublicJourneySmokingPolicy;

  pets: PublicJourneyPetsPolicy;

  luggage: PublicJourneyLuggagePolicy;

  conversation: PublicJourneyConversationPreference;

  music: PublicJourneyMusicPreference;
}
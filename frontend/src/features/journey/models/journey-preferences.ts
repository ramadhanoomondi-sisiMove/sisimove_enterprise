// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Model
// -----------------------------------------------------------------------------
//
// Passenger-facing preferences attached to a Journey.
// -----------------------------------------------------------------------------

export enum JourneySmokingPolicy {
  ALLOWED = 'ALLOWED',
  NOT_ALLOWED = 'NOT_ALLOWED',
}

export enum JourneyPetsPolicy {
  ALLOWED = 'ALLOWED',
  NOT_ALLOWED = 'NOT_ALLOWED',
  SERVICE_ANIMALS_ONLY = 'SERVICE_ANIMALS_ONLY',
}

export enum JourneyLuggagePolicy {
  NONE = 'NONE',
  LIMITED = 'LIMITED',
  STANDARD = 'STANDARD',
  LARGE = 'LARGE',
}

export enum JourneyConversationPreference {
  QUIET = 'QUIET',
  MODERATE = 'MODERATE',
  SOCIAL = 'SOCIAL',
}

export enum JourneyMusicPreference {
  NONE = 'NONE',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  ANY = 'ANY',
}

export interface JourneyPreferences {
  publicId: string;

  smoking: JourneySmokingPolicy;

  pets: JourneyPetsPolicy;

  luggage: JourneyLuggagePolicy;

  conversation: JourneyConversationPreference;

  music: JourneyMusicPreference;
}
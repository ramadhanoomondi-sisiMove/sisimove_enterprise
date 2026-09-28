// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Mapper
// -----------------------------------------------------------------------------

import type { JourneyPreferences } from "../models/journey-preferences";
import type { JourneySmokingPolicy } from "../models/journey-smoking-policy";
import type { JourneyPetsPolicy } from "../models/journey-pets-policy";
import type { JourneyLuggagePolicy } from "../models/journey-luggage-policy";
import type { JourneyConversationPreference } from "../models/journey-conversation-preference";
import type { JourneyMusicPreference } from "../models/journey-music-preference";

export interface JourneyPreferencesResponse {
  readonly smoking: string;
  readonly pets: string;
  readonly luggage: string;
  readonly conversation: string;
  readonly music: string;
}

export const JourneyPreferencesMapper = {
  fromResponse(
    response: JourneyPreferencesResponse,
  ): JourneyPreferences {
    return {
      smoking: response.smoking as JourneySmokingPolicy,
      pets: response.pets as JourneyPetsPolicy,
      luggage: response.luggage as JourneyLuggagePolicy,
      conversation:
        response.conversation as JourneyConversationPreference,
      music: response.music as JourneyMusicPreference,
    };
  },
};
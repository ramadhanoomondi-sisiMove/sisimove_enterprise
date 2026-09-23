// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Schema
// -----------------------------------------------------------------------------

import { z } from 'zod';

import {
  JourneyConversationPreference,
  JourneyLuggagePolicy,
  JourneyMusicPreference,
  JourneyPetsPolicy,
  JourneySmokingPolicy,
} from '../models/journey-preferences';

export const journeyPreferencesSchema = z.object({
  smoking: z
    .nativeEnum(JourneySmokingPolicy)
    .default(JourneySmokingPolicy.NOT_ALLOWED),

  pets: z
    .nativeEnum(JourneyPetsPolicy)
    .default(JourneyPetsPolicy.NOT_ALLOWED),

  luggage: z
    .nativeEnum(JourneyLuggagePolicy)
    .default(JourneyLuggagePolicy.STANDARD),

  conversation: z
    .nativeEnum(JourneyConversationPreference)
    .default(JourneyConversationPreference.MODERATE),

  music: z
    .nativeEnum(JourneyMusicPreference)
    .default(JourneyMusicPreference.LOW),
});

export type JourneyPreferencesInput = z.infer<
  typeof journeyPreferencesSchema
>;
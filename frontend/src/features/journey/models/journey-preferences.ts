// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Model
// -----------------------------------------------------------------------------
//
// Frontend representation of Journey preferences exposed by the Journey HTTP
// API.
//
// Preferences describe the environment and policies configured for a Journey.
//
// The individual preference values are represented by their corresponding
// frontend enum types rather than arbitrary strings.
//
// Internal database identifiers are intentionally excluded.
//
// -----------------------------------------------------------------------------

import type { JourneyConversationPreference } from './journey-conversation-preference';
import type { JourneyLuggagePolicy } from './journey-luggage-policy';
import type { JourneyMusicPreference } from './journey-music-preference';
import type { JourneyPetsPolicy } from './journey-pets-policy';
import type { JourneySmokingPolicy } from './journey-smoking-policy';

/**
 * Journey preferences.
 */
export interface JourneyPreferences {
  /**
   * Public identifier of the preferences configuration.
   */
  publicId: string;

  /**
   * Smoking policy for the Journey.
   */
  smoking: JourneySmokingPolicy;

  /**
   * Pets policy for the Journey.
   */
  pets: JourneyPetsPolicy;

  /**
   * Luggage policy for the Journey.
   */
  luggage: JourneyLuggagePolicy;

  /**
   * Preferred conversation environment for the Journey.
   */
  conversation: JourneyConversationPreference;

  /**
   * Preferred music environment for the Journey.
   */
  music: JourneyMusicPreference;

  /**
   * Creation timestamp returned by the API, when available.
   */
  createdAt?: string;

  /**
   * Last update timestamp returned by the API, when available.
   */
  updatedAt?: string;
}
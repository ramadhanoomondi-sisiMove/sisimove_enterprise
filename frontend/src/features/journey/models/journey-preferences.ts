import type { JourneySmokingPolicy } from './journey-smoking-policy';
import type { JourneyPetsPolicy } from './journey-pets-policy';
import type { JourneyLuggagePolicy } from './journey-luggage-policy';
import type { JourneyConversationPreference } from './journey-conversation-preference';
import type { JourneyMusicPreference } from './journey-music-preference';

// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Model
// -----------------------------------------------------------------------------
//
// Frontend projection of JourneyPreferences.
//
// Preferences are explicit backend domain values. The frontend should render
// these values rather than reconstructing them from booleans or UI-specific
// assumptions.
//
// Preferences are optional on a Journey projection because the Journey
// aggregate can exist without this component.
// -----------------------------------------------------------------------------

export interface JourneyPreferences {
  /**
   * Smoking policy for the journey.
   */
  readonly smoking: JourneySmokingPolicy;

  /**
   * Pet policy for the journey.
   */
  readonly pets: JourneyPetsPolicy;

  /**
   * Permitted luggage level.
   */
  readonly luggage: JourneyLuggagePolicy;

  /**
   * Preferred conversation level.
   */
  readonly conversation: JourneyConversationPreference;

  /**
   * Preferred music level.
   */
  readonly music: JourneyMusicPreference;
}
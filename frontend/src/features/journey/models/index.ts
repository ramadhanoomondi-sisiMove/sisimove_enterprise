// -----------------------------------------------------------------------------
// sisiMove — Journey Models Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for all Journey frontend models.
//
// Consumers should import Journey models from this barrel rather than reaching
// into individual model files. This keeps the feature's public model surface
// stable if the internal file structure changes.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export type { Journey } from './journey';

// -----------------------------------------------------------------------------
// Component models
// -----------------------------------------------------------------------------

export type { JourneyAsset } from './journey-asset';
export type { JourneyCapacity } from './journey-capacity';
export type { JourneyCorridor } from './journey-corridor';
export type { JourneyPreferences } from './journey-preferences';
export type { JourneyPricing } from './journey-pricing';
export type { JourneySchedule } from './journey-schedule';
export type { JourneyVehicle } from './journey-vehicle';
export type { JourneyWaypoint } from './journey-waypoint';

// -----------------------------------------------------------------------------
// Lifecycle and component enums
// -----------------------------------------------------------------------------

export {
  JOURNEY_ASSET_TYPES,
  isJourneyAssetType,
} from './journey-asset-type';
export type { JourneyAssetType } from './journey-asset-type';

export {
  JOURNEY_CONVERSATION_PREFERENCES,
  isJourneyConversationPreference,
} from './journey-conversation-preference';
export type { JourneyConversationPreference } from './journey-conversation-preference';

export {
  JOURNEY_LUGGAGE_POLICIES,
  isJourneyLuggagePolicy,
} from './journey-luggage-policy';
export type { JourneyLuggagePolicy } from './journey-luggage-policy';

export {
  JOURNEY_MUSIC_PREFERENCES,
  isJourneyMusicPreference,
} from './journey-music-preference';
export type { JourneyMusicPreference } from './journey-music-preference';

export {
  JOURNEY_PETS_POLICIES,
  isJourneyPetsPolicy,
} from './journey-pets-policy';
export type { JourneyPetsPolicy } from './journey-pets-policy';

export {
  JOURNEY_SMOKING_POLICIES,
  isJourneySmokingPolicy,
} from './journey-smoking-policy';
export type { JourneySmokingPolicy } from './journey-smoking-policy';

export {
  JOURNEY_STATUSES,
  isJourneyStatus,
} from './journey-status';
export type { JourneyStatus } from './journey-status';

export {
  JOURNEY_WAYPOINT_TYPES,
  isJourneyWaypointType,
} from './journey-waypoint-type';
export type { JourneyWaypointType } from './journey-waypoint-type';
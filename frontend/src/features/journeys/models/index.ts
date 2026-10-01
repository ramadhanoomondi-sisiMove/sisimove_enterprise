// src/features/journeys/models/index.ts

// -----------------------------------------------------------------------------
// sisiMove — Journey Models
// -----------------------------------------------------------------------------
//
// Public barrel for Journey frontend models.
//
// Consumers should normally import Journey models through the feature
// boundary rather than importing individual model files directly.
//
// Example:
//
// import type {
//   PublicJourney,
//   MyJourney,
// } from '@/features/journeys';
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Journey
// -----------------------------------------------------------------------------

export type {
  PublicJourney,
} from './public-journey';

export type {
  PublicJourneyQuery,
} from './public-journey-query';

export type {
  PublicJourneyProvider,
} from './public-journey-provider';

export type {
  PublicJourneyRoute,
  PublicJourneyLocation,
  PublicJourneyWaypoint,
  PublicJourneyWaypointType,
} from './public-journey-route';

export type {
  PublicJourneySchedule,
} from './public-journey-schedule';

export type {
  PublicJourneyVehicle,
  PublicJourneyVehicleAsset,
} from './public-journey-vehicle';

export type {
  PublicJourneyCapacity,
} from './public-journey-capacity';

export type {
  PublicJourneyPricing,
} from './public-journey-pricing';

export type {
  PublicJourneyPreferences,
  PublicJourneySmokingPolicy,
  PublicJourneyPetsPolicy,
  PublicJourneyLuggagePolicy,
  PublicJourneyConversationPreference,
  PublicJourneyMusicPreference,
} from './public-journey-preferences';

export type {
  PublicJourneyAsset,
  PublicJourneyAssetType,
} from './public-journey-asset';

// -----------------------------------------------------------------------------
// Authenticated My Journey
// -----------------------------------------------------------------------------
//
// MyJourney is intentionally separate from PublicJourney.
//
// PublicJourney:
//   - marketplace discovery
//   - publicly discoverable
//   - publication-ready
//
// MyJourney:
//   - authenticated owner's Journey
//   - may be incomplete/draft
//   - includes lifecycle information
//   - components may be null
//
// -----------------------------------------------------------------------------

export type {
  MyJourney,
  MyJourneyAsset,
  MyJourneyCapacity,
  MyJourneyCorridor,
  MyJourneyLocation,
  MyJourneyPreferences,
  MyJourneyPricing,
  MyJourneySchedule,
  MyJourneyVehicle,
  MyJourneyWaypoint,
} from './my-journey';

// src/features/journeys/hooks/index.ts

// -----------------------------------------------------------------------------
// sisiMove — Journey Hooks Barrel
// -----------------------------------------------------------------------------
//
// Public feature boundary for Journey React hooks.
//
// Consumers should normally import hooks through:
// 
//     @/features/journeys
//
// rather than importing individual hook files directly.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Journeys
// -----------------------------------------------------------------------------

export {
  usePublicJourneys,
} from './public-use-journeys';

export type {
  PublicJourneysState,
} from './public-use-journeys';


// -----------------------------------------------------------------------------
// Public Journey
// -----------------------------------------------------------------------------

export {
  usePublicJourney,
} from './public-use-journey';

export type {
  PublicJourneyState,
} from './public-use-journey';


// -----------------------------------------------------------------------------
// Authenticated — My Journeys
// -----------------------------------------------------------------------------

export {
  useMyJourneys,
} from './use-my-journeys';

export type {
  UseMyJourneysResult,
} from './use-my-journeys';


// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Hooks
// -----------------------------------------------------------------------------
//
// Public hook exports for the Journey Demand feature.
//
// Two distinct read boundaries are exposed:
//
//     Public marketplace
//     ├── useJourneyDemands
//     └── useJourneyDemand
//
//     Authenticated owner
//     └── useMyJourneyDemands
//
// The authenticated hook is intentionally separate from the public discovery
// hooks because ownership comes from the authenticated backend session.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Journey Demand Collection
// -----------------------------------------------------------------------------

export {
  useJourneyDemands,
} from './use-journey-demands';

export type {
  PublicJourneyDemandsState,
} from './use-journey-demands';

// -----------------------------------------------------------------------------
// Public Journey Demand Detail
// -----------------------------------------------------------------------------

export {
  useJourneyDemand,
} from './use-journey-demand';

export type {
  PublicJourneyDemandState,
} from './use-journey-demand';

// -----------------------------------------------------------------------------
// Authenticated — My Journey Demands
// -----------------------------------------------------------------------------

export {
  useMyJourneyDemands,
} from './use-my-journey-demands';

export type {
  UseMyJourneyDemandsResult,
} from './use-my-journey-demands';
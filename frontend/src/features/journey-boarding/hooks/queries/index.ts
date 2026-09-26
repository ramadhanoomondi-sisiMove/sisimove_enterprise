// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Query Hooks Barrel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Re-export Journey Boarding query hooks.
// - Re-export query-specific parameter and query-key contracts where they are
//   part of the public feature hook surface.
//
// Architectural rules:
// - This file contains exports only.
// - No query logic belongs here.
// - No HTTP or domain/business logic belongs here.
// -----------------------------------------------------------------------------

export {
  useJourneyBoarding,
  journeyBoardingQueryKeys,
} from './use-journey-boarding';

export type {
  UseJourneyBoardingParams,
} from './use-journey-boarding';

export {
  useJourneyBoardingByJourney,
  journeyBoardingByJourneyQueryKeys,
} from './use-journey-boarding-by-journey';

export type {
  UseJourneyBoardingByJourneyParams,
} from './use-journey-boarding-by-journey';

export {
  useJourneyBoardingParticipants,
  journeyBoardingParticipantsQueryKeys,
} from './use-journey-boarding-participants';

export type {
  UseJourneyBoardingParticipantsParams,
} from './use-journey-boarding-participants';

export {
  useJourneyBoardings,
  journeyBoardingsQueryKeys,
} from './use-journey-boardings';
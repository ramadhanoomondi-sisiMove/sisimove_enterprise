// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Lifecycle API Barrel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Re-export Journey Boarding lifecycle API functions.
// - Re-export their request/parameter/response contracts.
// - Provide a stable import boundary for lifecycle operations.
//
// Architectural rules:
// - This file contains exports only.
// - No HTTP logic belongs here.
// - No domain/business rules belong here.
// - Keep `.api` suffixes explicit to match the feature's API file structure.
// -----------------------------------------------------------------------------

export {
  createJourneyBoarding,
} from './create-journey-boarding.api';

export type {
  CreateJourneyBoardingRequest,
  CreateJourneyBoardingResponse,
  CreateJourneyBoardingParticipantResponse,
  CreateJourneyBoardingEventResponse,
} from './create-journey-boarding.api';

export {
  openJourneyBoarding,
} from './open-journey-boarding.api';

export type {
  OpenJourneyBoardingParams,
  OpenJourneyBoardingRequest,
  OpenJourneyBoardingResponse,
  OpenJourneyBoardingParticipantResponse,
  OpenJourneyBoardingEventResponse,
} from './open-journey-boarding.api';

export {
  startJourney,
} from './start-journey.api';

export type {
  StartJourneyParams,
  StartJourneyRequest,
  StartJourneyResponse,
  StartJourneyParticipantResponse,
  StartJourneyEventResponse,
} from './start-journey.api';

export {
  cancelJourneyBoarding,
} from './cancel-journey-boarding.api';

export type {
  CancelJourneyBoardingParams,
  CancelJourneyBoardingRequest,
  CancelJourneyBoardingResponse,
  CancelJourneyBoardingParticipantResponse,
  CancelJourneyBoardingEventResponse,
} from './cancel-journey-boarding.api';
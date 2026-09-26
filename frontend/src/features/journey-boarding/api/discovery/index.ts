// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Discovery API
// -----------------------------------------------------------------------------
//
// Barrel for Journey Boarding discovery/read API adapters.
//
// Responsibilities:
// - Provide a single import surface for discovery API functions.
// - Re-export discovery transport contracts.
// - Keep feature consumers independent from individual API file locations.
//
// Non-responsibilities:
// - No HTTP execution.
// - No mapping.
// - No business/domain logic.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Get Journey Boarding
// -----------------------------------------------------------------------------

export {
  getJourneyBoarding,
} from './get-journey-boarding.api';

export type {
  GetJourneyBoardingParams,
  GetJourneyBoardingResponse,
  GetJourneyBoardingParticipantResponse,
  GetJourneyBoardingEventResponse,
} from './get-journey-boarding.api';

// -----------------------------------------------------------------------------
// Get Journey Boarding By Journey
// -----------------------------------------------------------------------------

export {
  getJourneyBoardingByJourney,
} from './get-journey-boarding-by-journey.api';

export type {
  GetJourneyBoardingByJourneyParams,
  GetJourneyBoardingByJourneyResponse,
  GetJourneyBoardingByJourneyParticipantResponse,
  GetJourneyBoardingByJourneyEventResponse,
} from './get-journey-boarding-by-journey.api';

// -----------------------------------------------------------------------------
// Get Journey Boarding Participants
// -----------------------------------------------------------------------------

export {
  getJourneyBoardingParticipants,
} from './get-journey-boarding-participants.api';

export type {
  GetJourneyBoardingParticipantsParams,
  GetJourneyBoardingParticipantsResponse,
} from './get-journey-boarding-participants.api';

// -----------------------------------------------------------------------------
// List Journey Boardings
// -----------------------------------------------------------------------------

export {
  listJourneyBoardings,
} from './list-journey-boardings.api';

export type {
  ListJourneyBoardingsResponse,
} from './list-journey-boardings.api';
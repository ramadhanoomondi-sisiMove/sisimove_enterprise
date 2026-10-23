
/**
 * sisiMove — Journey Mapper Exports
 *
 * Central export point for journey response mappers, backend response
 * contracts, mapped journey types, and convenience mapping functions.
 *
 * This barrel file only re-exports existing declarations.
 * It contains no mapping logic or business rules.
 */

// -----------------------------------------------------------------------------
// Journey
// -----------------------------------------------------------------------------

export {
  JourneyResponseMapper,
  mapJourneyResponse,
  mapJourneyResponses,
} from './journey.mapper';

export type {
  JourneyBackendResponse,
  MappedJourney,
} from './journey.mapper';

// -----------------------------------------------------------------------------
// Journey booking
// -----------------------------------------------------------------------------

export {
  JourneyBookingResponseMapper,
  mapJourneyBookingResponse,
  mapJourneyBookingResponses,
} from './journey-booking.mapper';

export type {
  JourneyBookingBackendResponse,
} from './journey-booking.mapper';

// -----------------------------------------------------------------------------
// Journey boarding
// -----------------------------------------------------------------------------

export {
  JourneyBoardingResponseMapper,
} from './journey-boarding.mapper';

export type {
  JourneyBoardingBackendResponse,
} from './journey-boarding.mapper';

// -----------------------------------------------------------------------------
// Journey completion
// -----------------------------------------------------------------------------

export {
  JourneyCompletionResponseMapper,
} from './journey-completion.mapper';


// -----------------------------------------------------------------------------
// Journey settlement
// -----------------------------------------------------------------------------

export {
  JourneySettlementResponseMapper,
} from './journey-settlement.mapper';

export type {
  JourneySettlementBackendResponse,
} from './journey-settlement.mapper';

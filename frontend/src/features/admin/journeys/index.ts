/**
 * sisiMove — Journeys Feature
 *
 * Public entry point for the Journeys feature.
 *
 * Exposes:
 * - Journey API adapters
 * - React Query hooks
 * - Domain models and enums
 * - Backend response mappers
 * - Journey formatting and status utilities
 *
 * This file only re-exports existing feature modules.
 */

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export {
  journeysApi,
} from './api/journeys.api';

export {
  journeyBookingsApi,
} from './api/journey-bookings.api';

export {
  journeyBoardingsApi,
} from './api/journey-boardings.api';

export {
  journeyCompletionsApi,
} from './api/journey-completions.api';

export {
  journeySettlementsApi,
} from './api/journey-settlements.api';

export type {
  ListJourneySettlementsQuery,
  CreateJourneySettlementRequest,
  JourneySettlementCommandRequest,
  SubmitJourneySettlementRequest,
  ProcessJourneySettlementRequest,
  CompleteJourneySettlementRequest,
  FailJourneySettlementRequest,
  HoldJourneySettlementRequest,
  CancelJourneySettlementRequest,
  GetJourneySettlementByCompletionQuery,
  JourneySettlementStatus,
} from './api/journey-settlements.api';

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export {
  useJourneys,
  journeysQueryKeys,
} from './hooks/useJourneys';

export {
  useJourney,
  journeyQueryKeys,
} from './hooks/useJourney';

export {
  useJourneyFilters,
} from './hooks/useJourneyFilters';

export type {
  JourneyFilters,
  JourneyFilterUpdates,
} from './hooks/useJourneyFilters';

export {
  useJourneyBookings,
  journeyBookingsQueryKeys,
} from './hooks/useJourneyBookings';

export {
  useJourneyBoarding,
  journeyBoardingQueryKeys,
} from './hooks/useJourneyBoarding';

export {
  useJourneyCompletion,
  journeyCompletionQueryKeys,
} from './hooks/useJourneyCompletion';

export {
  useJourneySettlementsByJourney,
  journeySettlementsByJourneyQueryKeys,
} from './hooks/useJourneySettlement';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export * from './models';

// -----------------------------------------------------------------------------
// Mappers
// -----------------------------------------------------------------------------

export * from './mappers';

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

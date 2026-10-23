
/**
 * sisiMove — Journey Models
 *
 * Central export point for journey domain and API response models.
 *
 * Keep model definitions in their individual files. This file only
 * re-exports public types and constants.
 */

// -----------------------------------------------------------------------------
// Journey
// -----------------------------------------------------------------------------

export type {
  Journey,
  JourneyResponseModel,
  JourneyPublicId,
  JourneyProviderPublicId,
  JourneyCoordinates,
  JourneyWaypoint,
  JourneyCorridor,
  JourneySchedule,
  JourneyVehicle,
  JourneyCapacity,
  JourneyPricing,
  JourneyPreferences,
  JourneyAsset,
  JourneyAuditFields,
} from './journey.model';

// -----------------------------------------------------------------------------
// Journey enums
// -----------------------------------------------------------------------------

export {
  JOURNEY_STATUSES,
  type JourneyStatus,
  type JourneyStatusGroup,
  type JourneyStatusInput,
  type JourneyStatusMetadata,
  type JourneyStatusVariant,
  type JourneyWaypointType,
  type JourneyAssetType,
  type JourneySmokingPreference,
  type JourneyPetsPreference,
  type JourneyLuggagePreference,
  type JourneyConversationPreference,
  type JourneyMusicPreference,
} from './journey.enums';

// -----------------------------------------------------------------------------
// Filters, pagination, and sorting
// -----------------------------------------------------------------------------

export {
  DEFAULT_JOURNEY_FILTERS,
  DEFAULT_JOURNEY_PAGINATION,
  DEFAULT_JOURNEY_SORT,
  type JourneyFilters,
  type JourneyPagination,
  type JourneySortDirection,
  type JourneySortField,
  type JourneySort,
  type JourneyDirectoryQuery,
} from './journey-filters.model';

// -----------------------------------------------------------------------------
// Metrics
// -----------------------------------------------------------------------------

export type {
  JourneyStatusCounts,
  JourneyLifecycleMetrics,
  JourneyOperationsMetrics,
  JourneyActivityMetrics,
  JourneyMetrics,
  JourneyMetricTrend,
  JourneyMetricComparison,
} from './journey-metrics.model';

// -----------------------------------------------------------------------------
// Bookings
// -----------------------------------------------------------------------------

export type {
  JourneyBookingStatus,
  JourneyBookingCoordinates,
  JourneyBookingSnapshotVehicle,
  JourneyBookingSnapshot,
  JourneyBookingPricing,
  JourneyBookingPaymentStatus,
  JourneyBookingPayment,
  JourneyBookingCancellation,
  JourneyBooking,
  JourneyBookingResponseModel,
  JourneyBookingsResponseModel,
} from './journey-booking.model';

// -----------------------------------------------------------------------------
// Boarding
// -----------------------------------------------------------------------------

export type {
  JourneyBoardingStatus,
  JourneyBoardingParticipantRole,
  JourneyBoardingParticipantStatus,
  JourneyBoardingEventType,
  JourneyBoardingParticipant,
  JourneyBoardingEvent,
  JourneyBoarding,
  JourneyBoardingResponseModel,
} from './journey-boarding.model';

// -----------------------------------------------------------------------------
// Completion
// -----------------------------------------------------------------------------

export type {
  JourneyCompletionStatus,
  JourneyCompletionConfirmationRole,
  JourneyCompletionConfirmationStatus,
  JourneyCompletionDisputeStatus,
  JourneyCompletionConfirmation,
  JourneyCompletionDispute,
  JourneyCompletion,
  JourneyCompletionResponseModel,
} from './journey-completion.model';

// -----------------------------------------------------------------------------
// Settlement
// -----------------------------------------------------------------------------

export type {
  JourneySettlementStatus,
  JourneySettlement,
  JourneySettlementResponseModel,
} from './journey-settlement.model';

// src/features/journey-booking/hooks/mutations/index.ts

// -----------------------------------------------------------------------------
// Journey Booking — Mutation Hooks Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for Journey Booking React Query mutation hooks.
//
// Mutation hooks expose backend-owned Journey Booking operations to the React
// UI while keeping HTTP communication inside the API layer.
//
// Supported mutations:
//
// Lifecycle:
// - Create
// - Confirm
// - Cancel
// - Complete
// - Expire
//
// Booking preparation:
// - Create Snapshot
// - Set Pricing
//
// Payment:
// - Create Payment
// - Authorize Payment
//
// The backend JourneyBooking aggregate remains authoritative for invariants,
// validation, state transitions, timestamps, versioning, and domain events.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Lifecycle mutations
// -----------------------------------------------------------------------------

export {
  useCreateJourneyBooking,
} from './use-create-journey-booking';

export {
  useConfirmJourneyBooking,
  type ConfirmJourneyBookingVariables,
} from './use-confirm-journey-booking';

export {
  useCancelJourneyBooking,
  type CancelJourneyBookingVariables,
} from './use-cancel-journey-booking';

export {
  useCompleteJourneyBooking,
  type CompleteJourneyBookingVariables,
} from './use-complete-journey-booking';

export {
  useExpireJourneyBooking,
  type ExpireJourneyBookingVariables,
} from './use-expire-journey-booking';

// -----------------------------------------------------------------------------
// Snapshot
// -----------------------------------------------------------------------------

export {
  useCreateJourneyBookingSnapshot,
  type CreateJourneyBookingSnapshotVariables,
} from './use-create-journey-booking-snapshot';

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

export {
  useSetJourneyBookingPricing,
  type SetJourneyBookingPricingVariables,
} from './use-set-journey-booking-pricing';

// -----------------------------------------------------------------------------
// Payment
// -----------------------------------------------------------------------------

export {
  useCreateJourneyBookingPayment,
  type CreateJourneyBookingPaymentVariables,
} from './use-create-journey-booking-payment';

export {
  useAuthorizeJourneyBookingPayment,
  type AuthorizeJourneyBookingPaymentVariables,
  type UseAuthorizeJourneyBookingPaymentOptions,
} from './use-authorize-journey-booking-payment';
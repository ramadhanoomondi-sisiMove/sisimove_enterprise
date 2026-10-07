// frontend/src/features/journey-booking/api/journey-bookings/index.ts

// -----------------------------------------------------------------------------
// Journey Booking — API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for Journey Booking API operations.
//
// Lifecycle operations:
// - Create
// - Confirm
// - Cancel
// - Complete
// - Expire
//
// Booking preparation operations:
// - Snapshot
// - Pricing
//
// Payment operations:
// - Create Payment
//
// The frontend does not implement Journey Booking domain rules itself.
// Each operation delegates to the backend, where the aggregate remains
// authoritative for invariants, validation, state transitions, timestamps,
// versioning, and domain events.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------------

export {
  createJourneyBooking,
  type CreateJourneyBookingRequest,
  type CreateJourneyBookingResponse,
} from './create-journey-booking.api';

export {
  confirmJourneyBooking,
  type ConfirmJourneyBookingRequest,
  type ConfirmJourneyBookingResponse,
} from './confirm-journey-booking.api';

export {
  cancelJourneyBooking,
  type CancelJourneyBookingRequest,
  type CancelJourneyBookingResponse,
} from './cancel-journey-booking.api';

export {
  completeJourneyBooking,
  type CompleteJourneyBookingResponse,
} from './complete-journey-booking.api';

export {
  expireJourneyBooking,
  type ExpireJourneyBookingResponse,
} from './expire-journey-booking.api';

// -----------------------------------------------------------------------------
// Snapshot
// -----------------------------------------------------------------------------

export {
  createJourneyBookingSnapshot,
  type CreateJourneyBookingSnapshotRequest,
  type CreateJourneyBookingSnapshotResponse,
} from './create-journey-booking-snapshot.api';

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

export {
  setJourneyBookingPricing,
  type SetJourneyBookingPricingRequest,
  type SetJourneyBookingPricingResponse,
} from './set-journey-booking-pricing.api';

// -----------------------------------------------------------------------------
// Payment
// -----------------------------------------------------------------------------

export {
  createJourneyBookingPayment,
  type CreateJourneyBookingPaymentRequest,
  type CreateJourneyBookingPaymentResponse,
} from './create-journey-booking-payment.api';
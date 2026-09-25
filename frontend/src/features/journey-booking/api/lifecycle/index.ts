// -----------------------------------------------------------------------------
// Journey Booking — Lifecycle API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for Journey Booking lifecycle mutations.
//
// These operations represent state transitions owned by the backend
// JourneyBooking aggregate:
//
// - Create
// - Confirm
// - Cancel
// - Complete
// - Expire
//
// The frontend does not implement lifecycle transitions itself. Each operation
// delegates to the Journey Booking HTTP API, where the aggregate remains
// authoritative for invariants, validation, state transitions, timestamps,
// versioning, and domain events.
//
// Payment operations intentionally live in the separate payment API boundary.
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
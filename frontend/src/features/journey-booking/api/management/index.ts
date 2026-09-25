// -----------------------------------------------------------------------------
// Journey Booking — Management API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for authenticated Journey Booking management/read operations.
//
// Management APIs represent the current authenticated passenger's booking
// collection. The backend derives the passenger identity from the authenticated
// session, so callers do not provide a passenger public identifier.
//
// This boundary is intentionally separate from:
//
// - discovery APIs, which query bookings using explicit identifiers;
// - lifecycle APIs, which mutate booking state;
// - payment APIs, which mutate booking-local payment state.
//
// The barrel contains exports only. HTTP behavior remains inside the concrete
// API implementation.
// -----------------------------------------------------------------------------

export {
  getMyJourneyBookings,
  type GetMyJourneyBookingsResponse,
} from './get-my-journey-bookings.api';
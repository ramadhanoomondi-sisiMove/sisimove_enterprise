// -----------------------------------------------------------------------------
// Journey Booking — Discovery API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for Journey Booking discovery/read API operations.
//
// Discovery APIs answer questions about existing bookings:
//
// - Get one booking by its public identifier.
// - Find bookings associated with a Journey.
// - Find bookings associated with a passenger.
// - Find bookings by lifecycle status.
// - Find a booking for a Journey/passenger pair.
// - Find a booking by financial transaction identifier.
//
// These functions are intentionally kept separate from:
// - authenticated "my bookings" management,
// - lifecycle mutations,
// - payment mutations.
//
// The barrel contains exports only. HTTP behavior remains inside the
// corresponding feature API modules.
// -----------------------------------------------------------------------------

export {
  getJourneyBooking,
  type GetJourneyBookingResponse,
} from './get-journey-booking.api';

export {
  findJourneyBookingsByJourney,
  type FindJourneyBookingsByJourneyResponse,
} from './find-journey-bookings-by-journey.api';

export {
  findJourneyBookingsByPassenger,
  type FindJourneyBookingsByPassengerResponse,
} from './find-journey-bookings-by-passenger.api';

export {
  findJourneyBookingsByStatus,
  type FindJourneyBookingsByStatusResponse,
} from './find-journey-bookings-by-status.api';

export {
  findJourneyBookingsByJourneyAndPassenger,
  type FindJourneyBookingsByJourneyAndPassengerResponse,
} from './find-journey-bookings-by-journey-and-passenger.api';

export {
  findJourneyBookingByTransaction,
  type FindJourneyBookingByTransactionResponse,
} from './find-journey-booking-by-transaction.api';
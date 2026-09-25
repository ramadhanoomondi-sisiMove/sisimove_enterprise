// -----------------------------------------------------------------------------
// Journey Booking — Mapper Barrel
// -----------------------------------------------------------------------------
//
// Public mapper surface for the Journey Booking feature.
//
// Each mapper owns one transport-to-application boundary:
//
// - snapshot
// - pricing
// - payment
// - cancellation
// - complete Journey Booking response
//
// Consumers should import mappers through this barrel rather than reaching into
// individual implementation files.
//
// Mapper functions translate API representations only. They do not perform
// domain calculations, lifecycle transitions, pricing calculations, or payment
// decisions.
// -----------------------------------------------------------------------------

export {
  mapJourneyBookingSnapshot,
  type JourneyBookingSnapshotApiResponse,
} from './journey-booking-snapshot.mapper';

export {
  mapJourneyBookingPricing,
  type JourneyBookingPricingApiResponse,
} from './journey-booking-pricing.mapper';

export {
  mapJourneyBookingPayment,
  type JourneyBookingPaymentApiResponse,
} from './journey-booking-payment.mapper';

export {
  mapJourneyBookingCancellation,
  type JourneyBookingCancellationApiResponse,
} from './journey-booking-cancellation.mapper';

export {
  mapJourneyBooking,
  mapJourneyBookings,
  type JourneyBookingApiResponse,
} from './journey-booking.mapper';
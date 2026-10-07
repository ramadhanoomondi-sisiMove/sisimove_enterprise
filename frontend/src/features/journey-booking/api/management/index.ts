// src/features/journey-booking/api/management/index.ts

// -----------------------------------------------------------------------------
// Journey Booking — Management API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for authenticated Journey Booking management/read operations.
//
// The collection and detailed collection are intentionally separate:
//
//   getMyJourneyBookings()
//       → GET /journey-bookings/mine
//
//   getMyJourneyBookingDetails()
//       → GET /journey-bookings/mine/detail
//
// Passenger identity is always derived by the backend.
// -----------------------------------------------------------------------------

export {
  getMyJourneyBookings,
  type GetMyJourneyBookingsResponse,
} from './get-my-journey-bookings.api';


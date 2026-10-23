
/**
 * sisiMove — Admin Bookings Feature
 *
 * Public exports for the admin bookings feature.
 *
 * Admin users manage existing bookings. Booking creation is not
 * exposed through this feature's public API.
 */

// API
export {
    adminBookingsApi,
} from './api/admin-bookings.api';

// Query hooks
export {
  useAdminBookings,
  useAdminBookingCount,
} from './hooks/useAdminBookings';

export {
  useAdminBooking,
} from './hooks/useAdminBooking';

export {
  useAdminBookingsByJourney,
  useAdminBookingsByPassenger,
  useAdminBookingsByStatus,
  useAdminBookingsByJourneyAndPassenger,
  useAdminBookingByTransaction,
} from './hooks/useAdminBookingFilters';

// Mutation hooks
export {
  useConfirmAdminBooking,
  useCancelAdminBooking,
  useCompleteAdminBooking,
  useExpireAdminBooking,
  useCreateAdminBookingSnapshot,
  useSetAdminBookingPricing,
  useCreateAdminBookingPayment,
  useAuthorizeAdminBookingPayment,
  useCaptureAdminBookingPayment,
  useFailAdminBookingPayment,
  useRefundAdminBookingPayment,
  usePartiallyRefundAdminBookingPayment,
  adminBookingQueryKeys,
} from './hooks/useAdminMutations';

// Models and enums
export * from './models';

// Mappers
export * from './mappers';

// Utilities
export * from './utils';

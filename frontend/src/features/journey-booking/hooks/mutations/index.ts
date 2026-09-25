//src/features/journey-booking/hooks/mutations/index.ts
// -----------------------------------------------------------------------------
// Journey Booking — Mutation Hooks Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for Journey Booking React Query mutation hooks.
//
// Mutation hooks expose backend-owned booking lifecycle transitions to the
// React UI while keeping HTTP communication and response mapping inside their
// respective layers.
//
// Supported lifecycle mutations:
//
// - Create
// - Confirm
// - Cancel
// - Complete
// - Expire
//
// Payment mutations are intentionally outside this barrel. They belong to the
// separate payment API boundary and are not part of the booking lifecycle
// mutation surface.
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
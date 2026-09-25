//src/components/journey-booking/index.ts
// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Components
// -----------------------------------------------------------------------------
//
// Public barrel export for all Journey Booking presentation components.
//
// Responsibilities:
// - Expose Journey Booking UI components through one feature-local entry point.
// - Preserve component-folder boundaries.
// - Keep consumers independent from individual component file paths.
//
// Non-responsibilities:
// - Defining components.
// - Containing business logic.
// - Performing API calls.
// - Managing booking state.
// - Navigating between routes.
//
// The component implementations remain responsible for their own presentation
// concerns. This barrel only defines the public component surface.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Booking Status
// -----------------------------------------------------------------------------

export {
  JourneyBookingStatusBadge,
  type JourneyBookingStatusBadgeProps,
} from './booking-status';

// -----------------------------------------------------------------------------
// Booking Summary
// -----------------------------------------------------------------------------

export {
  JourneyBookingSummary,
  type JourneyBookingSummaryProps,
} from './booking-summary';

// -----------------------------------------------------------------------------
// Booking Snapshot
// -----------------------------------------------------------------------------

export {
  JourneyBookingSnapshot,
  type JourneyBookingSnapshotProps,
} from './booking-snapshot';

// -----------------------------------------------------------------------------
// Booking Pricing
// -----------------------------------------------------------------------------

export {
  JourneyBookingPricing,
  type JourneyBookingPricingProps,
} from './booking-pricing';

// -----------------------------------------------------------------------------
// Booking Payment
// -----------------------------------------------------------------------------

export {
  JourneyBookingPayment,
  type JourneyBookingPaymentProps,
} from './booking-payment';

// -----------------------------------------------------------------------------
// Booking Cancellation
// -----------------------------------------------------------------------------

export {
  JourneyBookingCancellation,
  type JourneyBookingCancellationProps,
} from './booking-cancellation';

// -----------------------------------------------------------------------------
// Booking Actions
// -----------------------------------------------------------------------------

export {
  JourneyBookingActions,
  type JourneyBookingActionsProps,
  ConfirmJourneyBookingAction,
  type ConfirmJourneyBookingActionProps,
  CancelJourneyBookingAction,
  type CancelJourneyBookingActionProps,
} from './booking-actions';

// -----------------------------------------------------------------------------
// Booking Card
// -----------------------------------------------------------------------------

export {
  JourneyBookingCard,
  type JourneyBookingCardProps,
} from './booking-card';
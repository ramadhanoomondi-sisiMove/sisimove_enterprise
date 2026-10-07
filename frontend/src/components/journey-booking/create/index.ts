// src/features/journey-booking/components/create/index.ts

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Create Components Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for the Journey Booking creation workflow.
//
// Workflow:
//
// 1. Seats
// 2. Journey Snapshot
// 3. Pricing
// 4. Payment
// 5. Review
//
// The form orchestrator owns workflow state and persistence.
// These components remain presentation/workflow UI components.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Form
// -----------------------------------------------------------------------------

export {
  JourneyBookingForm,
  type JourneyBookingFormProps,
  type JourneyBookingFormJourney,
  type JourneyBookingFormCoordinates,
} from "./journey-booking-form";

// -----------------------------------------------------------------------------
// Progress
// -----------------------------------------------------------------------------

export {
  JourneyBookingProgress,
  JOURNEY_BOOKING_STEPS,
  type JourneyBookingProgressProps,
  type JourneyBookingStepId,
} from "./journey-booking-progress";

// -----------------------------------------------------------------------------
// Step 1 — Seats
// -----------------------------------------------------------------------------

export {
  JourneyBookingSeats,
  type JourneyBookingSeatsProps,
} from "./journey-booking-seats";

// -----------------------------------------------------------------------------
// Step 2 — Journey Snapshot
// -----------------------------------------------------------------------------

export {
  JourneyBookingSnapshot,
  type JourneyBookingSnapshotProps,
  type JourneyBookingSnapshotValues,
} from "./journey-booking-snapshot";

// -----------------------------------------------------------------------------
// Step 3 — Pricing
// -----------------------------------------------------------------------------

export {
  JourneyBookingPricing,
  type JourneyBookingPricingProps,
  type JourneyBookingPricingValues,
} from "./journey-booking-pricing";

// -----------------------------------------------------------------------------
// Step 4 — Payment
// -----------------------------------------------------------------------------

export {
  JourneyBookingPayment,
  type JourneyBookingPaymentProps,
  type JourneyBookingPaymentValues,
  type JourneyBookingPaymentStatus,
} from "./journey-booking-payment";

// -----------------------------------------------------------------------------
// Step 5 — Review
// -----------------------------------------------------------------------------

export {
  JourneyBookingReview,
  type JourneyBookingReviewProps,
  type JourneyBookingReviewValues,
} from "./journey-booking-review";
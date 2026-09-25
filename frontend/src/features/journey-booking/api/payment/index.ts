// -----------------------------------------------------------------------------
// Journey Booking — Payment API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for Journey Booking payment-state mutations.
//
// These operations update the payment state owned by the JourneyBooking
// aggregate:
//
// - Authorize
// - Capture
// - Fail
// - Refund
// - Partially refund
//
// The Journey Booking context does not process money itself. It records and
// validates booking-local payment state and references the external financial
// transaction through transactionPublicId.
//
// The backend JourneyBooking aggregate remains authoritative for all payment
// state transitions and invariants.
//
// Payment APIs are deliberately kept separate from booking lifecycle APIs.
// -----------------------------------------------------------------------------

export {
  authorizeJourneyBookingPayment,
  type AuthorizeJourneyBookingPaymentRequest,
  type AuthorizeJourneyBookingPaymentResponse,
} from './authorize-journey-booking-payment.api';

export {
  captureJourneyBookingPayment,
  type CaptureJourneyBookingPaymentRequest,
  type CaptureJourneyBookingPaymentResponse,
} from './capture-journey-booking-payment.api';

export {
  failJourneyBookingPayment,
  type FailJourneyBookingPaymentRequest,
  type FailJourneyBookingPaymentResponse,
} from './fail-journey-booking-payment.api';

export {
  refundJourneyBookingPayment,
  type RefundJourneyBookingPaymentRequest,
  type RefundJourneyBookingPaymentResponse,
} from './refund-journey-booking-payment.api';

export {
  partiallyRefundJourneyBookingPayment,
  type PartiallyRefundJourneyBookingPaymentRequest,
  type PartiallyRefundJourneyBookingPaymentResponse,
} from './partially-refund-journey-booking-payment.api';
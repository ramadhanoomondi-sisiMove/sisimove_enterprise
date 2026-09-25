// -----------------------------------------------------------------------------
// Journey Booking — Payment Mapper
// -----------------------------------------------------------------------------
//
// Maps the Journey Booking payment representation returned by the HTTP API
// into the frontend/application payment model.
//
// Payment state belongs to the JourneyBooking aggregate, while actual payment
// processing is performed by the financial/payment infrastructure outside this
// bounded context.
//
// The frontend must therefore:
//
// - display the payment state returned by the backend;
// - preserve transaction references when supplied;
// - display failure information when supplied;
// - never infer payment success from booking status;
// - never perform payment-state transitions locally.
//
// In particular, `AUTHORIZED`, `CAPTURED`, `FAILED`, and refund states are
// distinct payment states and must remain independent from Journey Booking's
// lifecycle status.
// -----------------------------------------------------------------------------

import type {
  JourneyBookingPayment,
  JourneyBookingPaymentStatus,
} from '../models';

/**
 * Transport representation returned by the Journey Booking HTTP API.
 *
 * Date values have already been serialized by the HTTP boundary and are
 * represented as ISO timestamp strings in the frontend transport model.
 */
export interface JourneyBookingPaymentApiResponse {
  publicId: string;
  status: string;
  amount: number;
  currency: string;
  transactionPublicId?: string;
  authorizedAt?: string;
  capturedAt?: string;
  failedAt?: string;
  refundedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Narrows an API payment status into the frontend payment-status union.
 *
 * The backend is authoritative for the actual value. This function exists so
 * malformed or unsupported transport data cannot silently enter the typed
 * application model.
 */
function mapPaymentStatus(
  value: string,
): JourneyBookingPaymentStatus {
  const statuses: readonly JourneyBookingPaymentStatus[] = [
    'PENDING',
    'AUTHORIZED',
    'CAPTURED',
    'FAILED',
    'PARTIALLY_REFUNDED',
    'REFUNDED',
  ];

  if (!statuses.includes(value as JourneyBookingPaymentStatus)) {
    throw new TypeError(
      `Unsupported Journey Booking payment status: ${value}`,
    );
  }

  return value as JourneyBookingPaymentStatus;
}

/**
 * Maps a Journey Booking payment API response into the frontend model.
 */
export function mapJourneyBookingPayment(
  response: JourneyBookingPaymentApiResponse,
): JourneyBookingPayment {
  if (!response || typeof response !== 'object') {
    throw new TypeError(
      'Journey Booking payment response is required.',
    );
  }

  return {
    publicId: response.publicId,
    status: mapPaymentStatus(response.status),
    amount: response.amount,
    currency: response.currency,
    transactionPublicId: response.transactionPublicId,
    authorizedAt: response.authorizedAt,
    capturedAt: response.capturedAt,
    failedAt: response.failedAt,
    refundedAt: response.refundedAt,
    failureReason: response.failureReason,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}
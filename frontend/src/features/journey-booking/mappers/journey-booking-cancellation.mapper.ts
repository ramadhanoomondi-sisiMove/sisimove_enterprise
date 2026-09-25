// -----------------------------------------------------------------------------
// Journey Booking — Cancellation Mapper
// -----------------------------------------------------------------------------
//
// Maps the Journey Booking cancellation representation returned by the HTTP
// API into the frontend/application cancellation model.
//
// Cancellation is historical booking state. The frontend displays the reason,
// actor reference, optional explanation, and cancellation timestamps returned
// by the backend.
//
// The frontend does not determine whether a booking can be cancelled and does
// not validate cancellation business rules. Those rules belong to the
// JourneyBooking aggregate.
// -----------------------------------------------------------------------------

import type {
  JourneyBookingCancellation,
  JourneyBookingCancellationReason,
} from '../models';

/**
 * Transport representation returned by the Journey Booking HTTP API.
 *
 * This mirrors the backend JourneyBookingCancellationResponse shape while
 * remaining independent from backend/domain classes.
 */
export interface JourneyBookingCancellationApiResponse {
  publicId: string;
  reason: string;
  cancelledByPublicId?: string;
  reasonDescription?: string;
  cancelledAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Narrows the cancellation reason received from the API into the frontend
 * cancellation-reason union.
 *
 * Unsupported values are rejected rather than silently entering the
 * application model as an invalid state.
 */
function mapCancellationReason(
  value: string,
): JourneyBookingCancellationReason {
  const reasons: readonly JourneyBookingCancellationReason[] = [
    'PASSENGER_REQUEST',
    'PROVIDER_REQUEST',
    'JOURNEY_CANCELLED',
    'NO_SHOW',
    'SYSTEM',
    'OTHER',
  ];

  if (!reasons.includes(value as JourneyBookingCancellationReason)) {
    throw new TypeError(
      `Unsupported Journey Booking cancellation reason: ${value}`,
    );
  }

  return value as JourneyBookingCancellationReason;
}

/**
 * Maps a Journey Booking cancellation API response into the frontend model.
 */
export function mapJourneyBookingCancellation(
  response: JourneyBookingCancellationApiResponse,
): JourneyBookingCancellation {
  if (!response || typeof response !== 'object') {
    throw new TypeError(
      'Journey Booking cancellation response is required.',
    );
  }

  return {
    publicId: response.publicId,
    reason: mapCancellationReason(response.reason),
    cancelledByPublicId: response.cancelledByPublicId,
    reasonDescription: response.reasonDescription,
    cancelledAt: response.cancelledAt,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}
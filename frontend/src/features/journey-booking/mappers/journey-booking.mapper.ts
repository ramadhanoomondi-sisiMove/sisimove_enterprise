// -----------------------------------------------------------------------------
// Journey Booking — Aggregate Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Journey Booking HTTP response into the frontend
// application model.
//
// The backend response mapper intentionally exposes one consistent
// JourneyBookingResponse shape for:
//
// - single-booking responses;
// - collection responses;
// - lifecycle mutation responses.
//
// This frontend mapper therefore provides one canonical translation point for
// all Journey Booking responses.
//
// The frontend model contains only transport-safe/application-facing values.
// Backend entities, value objects, Prisma types, and aggregate classes never
// cross this boundary.
//
// Important:
//
// Booking lifecycle status and payment status are independent concerns.
// This mapper preserves both exactly as returned by the backend. The frontend
// must not derive one from the other.
// -----------------------------------------------------------------------------

import type { JourneyBooking } from '../models';

import {
  mapJourneyBookingCancellation,
  type JourneyBookingCancellationApiResponse,
} from './journey-booking-cancellation.mapper';

import {
  mapJourneyBookingPayment,
  type JourneyBookingPaymentApiResponse,
} from './journey-booking-payment.mapper';

import {
  mapJourneyBookingPricing,
  type JourneyBookingPricingApiResponse,
} from './journey-booking-pricing.mapper';

import {
  mapJourneyBookingSnapshot,
  type JourneyBookingSnapshotApiResponse,
} from './journey-booking-snapshot.mapper';

/**
 * Transport representation returned by the Journey Booking HTTP API.
 *
 * This mirrors the backend JourneyBookingResponse shape.
 *
 * The nested child values remain transport representations until delegated to
 * their dedicated mappers.
 */
export interface JourneyBookingApiResponse {
  publicId: string;
  journeyPublicId: string;
  passengerPublicId: string;
  status: string;
  seats: number;

  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  expiredAt?: string;

  version: number;

  snapshot?: JourneyBookingSnapshotApiResponse;
  pricing?: JourneyBookingPricingApiResponse;
  payment?: JourneyBookingPaymentApiResponse;
  cancellation?: JourneyBookingCancellationApiResponse;

  createdAt: string;
  updatedAt: string;
}

/**
 * Maps a Journey Booking API response into the frontend application model.
 *
 * Child components are delegated to their dedicated mappers so that each
 * transport shape has one authoritative translation point.
 */
export function mapJourneyBooking(
  response: JourneyBookingApiResponse,
): JourneyBooking {
  if (!response || typeof response !== 'object') {
    throw new TypeError(
      'Journey Booking response is required.',
    );
  }

  return {
    publicId: response.publicId,
    journeyPublicId: response.journeyPublicId,
    passengerPublicId: response.passengerPublicId,
    status: mapJourneyBookingStatus(response.status),
    seats: response.seats,

    snapshot:
      response.snapshot === undefined
        ? undefined
        : mapJourneyBookingSnapshot(response.snapshot),

    pricing:
      response.pricing === undefined
        ? undefined
        : mapJourneyBookingPricing(response.pricing),

    payment:
      response.payment === undefined
        ? undefined
        : mapJourneyBookingPayment(response.payment),

    cancellation:
      response.cancellation === undefined
        ? undefined
        : mapJourneyBookingCancellation(response.cancellation),

    confirmedAt: response.confirmedAt,
    cancelledAt: response.cancelledAt,
    completedAt: response.completedAt,
    expiredAt: response.expiredAt,

    version: response.version,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

/**
 * Maps a collection of Journey Booking API responses.
 *
 * The backend returns the same JourneyBookingResponse shape for collection
 * endpoints; there is intentionally no separate frontend list-item model.
 */
export function mapJourneyBookings(
  responses: readonly JourneyBookingApiResponse[],
): JourneyBooking[] {
  return responses.map(mapJourneyBooking);
}

/**
 * Narrows the lifecycle status returned by the API into the frontend
 * JourneyBookingStatus union.
 *
 * Lifecycle transitions remain backend-owned. This function only protects the
 * application boundary from unsupported transport values.
 */
function mapJourneyBookingStatus(
  value: string,
): JourneyBooking['status'] {
  const statuses: readonly JourneyBooking['status'][] = [
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
    'EXPIRED',
  ];

  if (!statuses.includes(value as JourneyBooking['status'])) {
    throw new TypeError(
      `Unsupported Journey Booking status: ${value}`,
    );
  }

  return value as JourneyBooking['status'];
}
// frontend/src/features/journey-booking/api/journey-bookings/set-journey-booking-pricing.api.ts

import { authenticatedApiClient } from '@/features/authentication/http';
import type { JourneyBooking } from '../../models/journey-booking';

export interface SetJourneyBookingPricingRequest {
  pricePerSeat: number;
  seats: number;
  subtotal: number;
  discountAmount?: number;
  adjustmentAmount?: number;
  totalAmount: number;
  currency: string;
  correlationId?: string;
  causationId?: string;
}

export type SetJourneyBookingPricingResponse = JourneyBooking;

export async function setJourneyBookingPricing(
  journeyBookingPublicId: string,
  request: SetJourneyBookingPricingRequest,
): Promise<SetJourneyBookingPricingResponse> {
  const bookingPublicId = journeyBookingPublicId.trim();

  if (!bookingPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  if (!Number.isFinite(request.pricePerSeat) || request.pricePerSeat < 0) {
    throw new TypeError(
      'Journey Booking price per seat must be a non-negative number.',
    );
  }

  if (!Number.isInteger(request.seats) || request.seats < 1) {
    throw new TypeError(
      'Journey Booking seats must be a positive integer.',
    );
  }

  if (!Number.isFinite(request.subtotal) || request.subtotal < 0) {
    throw new TypeError(
      'Journey Booking subtotal must be a non-negative number.',
    );
  }

  if (
    request.discountAmount !== undefined &&
    (!Number.isFinite(request.discountAmount) ||
      request.discountAmount < 0)
  ) {
    throw new TypeError(
      'Journey Booking discount amount must be a non-negative number.',
    );
  }

  if (
    request.adjustmentAmount !== undefined &&
    !Number.isFinite(request.adjustmentAmount)
  ) {
    throw new TypeError(
      'Journey Booking adjustment amount must be a valid number.',
    );
  }

  if (!Number.isFinite(request.totalAmount) || request.totalAmount < 0) {
    throw new TypeError(
      'Journey Booking total amount must be a non-negative number.',
    );
  }

  const currency = request.currency.trim();

  if (!currency) {
    throw new TypeError(
      'Journey Booking currency is required.',
    );
  }

  return authenticatedApiClient.post<SetJourneyBookingPricingResponse>(
    `/journey-bookings/${encodeURIComponent(bookingPublicId)}/pricing`,
    {
      pricePerSeat: request.pricePerSeat,
      seats: request.seats,
      subtotal: request.subtotal,
      discountAmount: request.discountAmount,
      adjustmentAmount: request.adjustmentAmount,
      totalAmount: request.totalAmount,
      currency,
      correlationId: request.correlationId,
      causationId: request.causationId,
    },
  );
}
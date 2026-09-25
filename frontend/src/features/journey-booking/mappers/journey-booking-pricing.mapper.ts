// -----------------------------------------------------------------------------
// Journey Booking — Pricing Mapper
// -----------------------------------------------------------------------------
//
// Maps the Journey Booking pricing representation returned by the HTTP API
// into the frontend/application pricing model.
//
// Pricing values are integer minor units (for example, KES cents) as defined
// by the backend financial model. The frontend deliberately keeps them as
// numbers and does not perform currency arithmetic or derive totals locally.
//
// The backend JourneyBooking aggregate remains authoritative for:
//
// - subtotal calculation
// - discounts
// - adjustments
// - total amount
// - pricing consistency
//
// This mapper is therefore a transport-to-application translation boundary,
// not a pricing calculation layer.
// -----------------------------------------------------------------------------

import type { JourneyBookingPricing } from '../models';

/**
 * Transport representation returned by the Journey Booking HTTP API.
 *
 * This mirrors the backend JourneyBookingPricingResponse shape while keeping
 * the frontend independent from backend/domain classes.
 */
export interface JourneyBookingPricingApiResponse {
  publicId: string;
  pricePerSeat: number;
  seats: number;
  subtotal: number;
  discountAmount: number;
  adjustmentAmount: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Maps a Journey Booking pricing API response into the frontend model.
 *
 * No pricing values are recalculated here. The values returned by the backend
 * are treated as authoritative booking-time pricing.
 */
export function mapJourneyBookingPricing(
  response: JourneyBookingPricingApiResponse,
): JourneyBookingPricing {
  if (!response || typeof response !== 'object') {
    throw new TypeError(
      'Journey Booking pricing response is required.',
    );
  }

  return {
    publicId: response.publicId,
    pricePerSeat: response.pricePerSeat,
    seats: response.seats,
    subtotal: response.subtotal,
    discountAmount: response.discountAmount,
    adjustmentAmount: response.adjustmentAmount,
    totalAmount: response.totalAmount,
    currency: response.currency,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}
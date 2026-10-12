
// frontend/src/features/journey-booking/models/journey-booking-detail.ts

// -----------------------------------------------------------------------------
// SisiMove — Journey Booking Detail Model
// -----------------------------------------------------------------------------
//
// Frontend application model for Journey Booking detail and booking-list
// surfaces.
//
// The backend response is authoritative for booking state and journey activity.
// This model represents the REST response without reproducing backend domain
// entities, value objects, or lifecycle behavior.
//
// IMPORTANT:
//
// - `journey` is nullable because a Journey may no longer be available.
// - `snapshot` preserves the historical Journey data captured at booking time.
// - `activitySummary` is returned alongside `booking` by the detail endpoint.
// - The frontend consumes activity counts rather than calculating them.
// -----------------------------------------------------------------------------

import type { JourneyBookingCancellationReason } from './journey-booking-cancellation-reason';
import type { JourneyBookingPaymentStatus } from './journey-booking-payment-status';
import type { JourneyBookingStatus } from './journey-booking-status';

// -----------------------------------------------------------------------------
// Journey Booking Detail — Activity Summary
// -----------------------------------------------------------------------------

/**
 * Backend-provided activity counts for the Journey associated with a booking.
 *
 * These counts are computed by the backend application query handler.
 */
export interface JourneyBookingActivitySummary {
  /**
   * Number of bookings associated with the same Journey.
   */
  readonly associatedBookingsCount: number;

  /**
   * Number of participants associated with Journey Boarding.
   */
  readonly participantsCount: number;

  /**
   * Number of visible messages associated with the Journey.
   */
  readonly messagesCount: number;

  /**
   * Number of unread incoming messages for the authenticated passenger.
   */
  readonly unreadMessagesCount: number;
}

// -----------------------------------------------------------------------------
// Journey Booking Detail — Snapshot
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailSnapshot {
  readonly publicId: string;

  readonly originName: string;
  readonly destinationName: string;

  readonly originCoordinates: {
    readonly latitude: number;
    readonly longitude: number;
  };

  readonly destinationCoordinates: {
    readonly latitude: number;
    readonly longitude: number;
  };

  readonly departureAt: string;
  readonly arrivalAt: string | null;

  readonly timezone: string;

  readonly vehicleMake: string | null;
  readonly vehicleModel: string | null;
  readonly vehicleYear: number | null;
  readonly vehicleColor: string | null;
  readonly vehicleRegistration: string | null;

  readonly createdAt: string;
  readonly updatedAt: string;
}

// -----------------------------------------------------------------------------
// Journey Booking Detail — Pricing
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailPricing {
  readonly publicId: string;

  /**
   * Monetary values are represented in the smallest currency unit.
   */
  readonly pricePerSeat: number;
  readonly seats: number;
  readonly subtotal: number;
  readonly discountAmount: number;
  readonly adjustmentAmount: number;
  readonly totalAmount: number;

  readonly currency: string;

  readonly createdAt: string;
  readonly updatedAt: string;
}

// -----------------------------------------------------------------------------
// Journey Booking Detail — Payment
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailPayment {
  readonly publicId: string;

  readonly status: JourneyBookingPaymentStatus;

  /**
   * Monetary amount represented in the smallest currency unit.
   */
  readonly amount: number;

  readonly currency: string;

  readonly transactionPublicId: string | null;

  readonly authorizedAt: string | null;
  readonly capturedAt: string | null;
  readonly failedAt: string | null;
  readonly refundedAt: string | null;

  readonly failureReason: string | null;

  readonly createdAt: string;
  readonly updatedAt: string;
}

// -----------------------------------------------------------------------------
// Journey Booking Detail — Cancellation
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailCancellation {
  readonly publicId: string;

  readonly reason: JourneyBookingCancellationReason;

  readonly cancelledByPublicId: string | null;
  readonly reasonDescription: string | null;

  readonly cancelledAt: string;

  readonly createdAt: string;
  readonly updatedAt: string;
}

// -----------------------------------------------------------------------------
// Journey Booking Detail — Provider Traveller
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailProviderTraveller {
  readonly publicId: string;
  readonly handle: string;
  readonly bio: string | null;

  readonly avatar: {
    readonly publicId: string;
  } | null;

  readonly countryCode: string;
}

// -----------------------------------------------------------------------------
// Journey Booking Detail — Provider Trust
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailProviderTrustBadgeAsset {
  readonly publicId: string;
  readonly url: string;
  readonly alt: string;
}

export interface JourneyBookingDetailProviderTrustBadge {
  readonly publicId: string;
  readonly type: string;
  readonly name: string;
  readonly description: string | null;

  readonly asset: JourneyBookingDetailProviderTrustBadgeAsset | null;
}

export interface JourneyBookingDetailProviderTrust {
  readonly verificationLevel: string;

  readonly ratingAverage: number;
  readonly ratingCount: number;
  readonly completedJourneys: number;

  readonly badges: readonly JourneyBookingDetailProviderTrustBadge[];
}

// -----------------------------------------------------------------------------
// Journey Booking Detail — Provider
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailProvider {
  readonly traveller: JourneyBookingDetailProviderTraveller;

  readonly trust: JourneyBookingDetailProviderTrust;
}

// -----------------------------------------------------------------------------
// Journey Booking Detail — Journey
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailJourney {
  readonly publicId: string;
  readonly providerPublicId: string;

  readonly status: string;

  readonly publishedAt: string | null;
  readonly startedAt: string | null;
  readonly completionRequestedAt: string | null;
  readonly completedAt: string | null;
  readonly cancelledAt: string | null;
  readonly expiredAt: string | null;

  readonly version: number;

  readonly provider: JourneyBookingDetailProvider | null;
}

// -----------------------------------------------------------------------------
// Journey Booking Detail — Booking
// -----------------------------------------------------------------------------

export interface JourneyBookingDetail {
  readonly publicId: string;
  readonly journeyPublicId: string;
  readonly passengerPublicId: string;

  readonly status: JourneyBookingStatus;

  /**
   * Number of seats reserved by the passenger.
   */
  readonly seats: number;

  readonly confirmedAt: string | null;
  readonly cancelledAt: string | null;
  readonly completedAt: string | null;
  readonly expiredAt: string | null;

  /**
   * Current Journey context.
   */
  readonly journey: JourneyBookingDetailJourney | null;

  /**
   * Historical Journey snapshot captured when the booking was created.
   */
  readonly snapshot: JourneyBookingDetailSnapshot | null;

  readonly pricing: JourneyBookingDetailPricing | null;
  readonly payment: JourneyBookingDetailPayment | null;
  readonly cancellation: JourneyBookingDetailCancellation | null;

  readonly version: number;

  readonly createdAt: string;
  readonly updatedAt: string;
}

// -----------------------------------------------------------------------------
// API Response — Detail
// -----------------------------------------------------------------------------

/**
 * Matches the backend JourneyBookingDetailResponse.
 *
 * `activitySummary` is a sibling of `booking`, not a property nested inside it.
 */
export interface JourneyBookingDetailResponse {
  readonly booking: JourneyBookingDetail;
  readonly activitySummary: JourneyBookingActivitySummary | null;
}

// -----------------------------------------------------------------------------
// API Response — Collection
// -----------------------------------------------------------------------------

/**
 * Collection response for booking-list surfaces.
 *
 * Activity summaries are optional at the collection-item level because the
 * backend collection handler may expose a different response contract.
 */
export interface JourneyBookingDetailCollectionResponse {
  readonly bookings: readonly JourneyBookingDetail[];
}

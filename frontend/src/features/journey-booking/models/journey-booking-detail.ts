// frontend/src/features/journey-booking/models/journey-booking-detail.ts

// -----------------------------------------------------------------------------
// SisiMove — Journey Booking Detail Model
// -----------------------------------------------------------------------------
//
// Frontend application model for Journey Booking detail and booking-list
// surfaces.
//
// This model mirrors the stable application response exposed by the backend.
// It intentionally does not reproduce backend domain entities or value
// objects.
//
// The JourneyBookingDetail model is the canonical booking representation
// consumed by presentation components that require the complete booking
// snapshot, pricing, payment, cancellation, and optional journey context.
//
// IMPORTANT:
//
// `journey` is nullable because a booking may reference a Journey that is no
// longer available in the current application state.
//
// `snapshot` is also nullable, but when present it remains the authoritative
// historical representation of the Journey at booking time.
//
// -----------------------------------------------------------------------------

import type { JourneyBookingCancellationReason } from './journey-booking-cancellation-reason';
import type { JourneyBookingPaymentStatus } from './journey-booking-payment-status';
import type { JourneyBookingStatus } from './journey-booking-status';

// -----------------------------------------------------------------------------
// Journey Booking Detail — Snapshot
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailSnapshot {
  /**
   * Historical snapshot identifier.
   */
  readonly publicId: string;

  /**
   * Historical Journey route.
   *
   * These values belong to the booking snapshot and must not be replaced
   * with current Journey values.
   */
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

  /**
   * Historical vehicle information.
   */
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
  /**
   * Public booking identifier.
   */
  readonly publicId: string;

  /**
   * References the Journey associated with this booking.
   */
  readonly journeyPublicId: string;

  /**
   * Passenger associated with the booking.
   */
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
   *
   * This is intentionally nullable.
   */
  readonly journey: JourneyBookingDetailJourney | null;

  /**
   * Historical Journey snapshot captured when the booking was created.
   *
   * Booking presentation should prefer this data over the current Journey.
   */
  readonly snapshot: JourneyBookingDetailSnapshot | null;

  /**
   * Historical booking pricing.
   */
  readonly pricing: JourneyBookingDetailPricing | null;

  /**
   * Booking payment information.
   */
  readonly payment: JourneyBookingDetailPayment | null;

  /**
   * Cancellation information, when applicable.
   */
  readonly cancellation: JourneyBookingDetailCancellation | null;

  readonly version: number;

  readonly createdAt: string;
  readonly updatedAt: string;
}

// -----------------------------------------------------------------------------
// API Response — Detail
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailResponse {
  readonly booking: JourneyBookingDetail;
}

// -----------------------------------------------------------------------------
// API Response — Collection
// -----------------------------------------------------------------------------
//
// The booking-list endpoint should return the same complete booking shape when
// JourneyBookingCard consumes JourneyBookingDetail.
//
// Keeping a dedicated collection response makes the API boundary explicit
// without introducing a second incompatible booking model.
//
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailCollectionResponse {
  readonly bookings: readonly JourneyBookingDetail[];
}

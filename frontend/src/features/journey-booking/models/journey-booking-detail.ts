// frontend/src/features/journey-booking/models/journey-booking-detail.ts

// -----------------------------------------------------------------------------
// SisiMove — Journey Booking Detail Model
// -----------------------------------------------------------------------------
//
// Frontend application model for the detailed Journey Booking view.
//
// This model mirrors the stable application response exposed by the backend.
// It intentionally does not reproduce backend domain entities or value
// objects.
//
// The model is used by the API adapter and can later be transformed by the
// feature mapper into UI-specific view models.
//
// -----------------------------------------------------------------------------

import type { JourneyBookingCancellationReason } from './journey-booking-cancellation-reason';
import type { JourneyBookingPaymentStatus } from './journey-booking-payment-status';
import type { JourneyBookingStatus } from './journey-booking-status';

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

  readonly seats: number;

  readonly confirmedAt: string | null;
  readonly cancelledAt: string | null;
  readonly completedAt: string | null;
  readonly expiredAt: string | null;

  readonly journey: JourneyBookingDetailJourney | null;
  readonly snapshot: JourneyBookingDetailSnapshot | null;
  readonly pricing: JourneyBookingDetailPricing | null;
  readonly payment: JourneyBookingDetailPayment | null;
  readonly cancellation: JourneyBookingDetailCancellation | null;

  readonly version: number;

  readonly createdAt: string;
  readonly updatedAt: string;
}

// -----------------------------------------------------------------------------
// API Response Model
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailResponse {
  readonly booking: JourneyBookingDetail;
}

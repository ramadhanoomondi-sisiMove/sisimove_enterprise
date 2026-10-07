// -----------------------------------------------------------------------------
// Journey Booking — Detail Response
// -----------------------------------------------------------------------------

// =============================================================================
// Booking Detail Snapshot
// =============================================================================

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

  readonly departureAt: Date;
  readonly arrivalAt: Date | null;
  readonly timezone: string;

  readonly vehicleMake: string | null;
  readonly vehicleModel: string | null;
  readonly vehicleYear: number | null;
  readonly vehicleColor: string | null;
  readonly vehicleRegistration: string | null;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// =============================================================================
// Booking Detail Pricing
// =============================================================================

export interface JourneyBookingDetailPricing {
  readonly publicId: string;

  readonly pricePerSeat: number;
  readonly seats: number;
  readonly subtotal: number;
  readonly discountAmount: number;
  readonly adjustmentAmount: number;
  readonly totalAmount: number;
  readonly currency: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// =============================================================================
// Booking Detail Payment
// =============================================================================

export interface JourneyBookingDetailPayment {
  readonly publicId: string;

  readonly status: string;
  readonly amount: number;
  readonly currency: string;

  readonly transactionPublicId: string | null;

  readonly authorizedAt: Date | null;
  readonly capturedAt: Date | null;
  readonly failedAt: Date | null;
  readonly refundedAt: Date | null;

  readonly failureReason: string | null;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// =============================================================================
// Booking Detail Cancellation
// =============================================================================

export interface JourneyBookingDetailCancellation {
  readonly publicId: string;

  readonly reason: string;
  readonly cancelledByPublicId: string | null;
  readonly reasonDescription: string | null;
  readonly cancelledAt: Date;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// =============================================================================
// Journey Detail Provider
// =============================================================================

export interface JourneyBookingDetailProvider {
  readonly traveller: {
    readonly publicId: string;
    readonly handle: string;
    readonly bio: string | null;
    readonly avatar: {
      readonly publicId: string;
    } | null;
    readonly countryCode: string;
  };

  readonly trust: {
    readonly verificationLevel: string;
    readonly ratingAverage: number;
    readonly ratingCount: number;
    readonly completedJourneys: number;

    readonly badges: Array<{
      readonly publicId: string;
      readonly type: string;
      readonly name: string;
      readonly description: string | null;

      readonly asset: {
        readonly publicId: string;
        readonly url: string;
        readonly alt: string;
      } | null;
    }>;
  };
}

// =============================================================================
// Journey Detail
// =============================================================================

export interface JourneyBookingDetailJourney {
  readonly publicId: string;
  readonly providerPublicId: string;

  readonly status: string;

  readonly publishedAt: Date | null;
  readonly startedAt: Date | null;
  readonly completionRequestedAt: Date | null;
  readonly completedAt: Date | null;
  readonly cancelledAt: Date | null;
  readonly expiredAt: Date | null;

  readonly version: number;

  readonly provider: JourneyBookingDetailProvider | null;
}

// =============================================================================
// Booking Detail
// =============================================================================

export interface JourneyBookingDetail {
  readonly publicId: string;
  readonly journeyPublicId: string;
  readonly passengerPublicId: string;

  readonly status: string;
  readonly seats: number;

  readonly confirmedAt: Date | null;
  readonly cancelledAt: Date | null;
  readonly completedAt: Date | null;
  readonly expiredAt: Date | null;

  readonly journey: JourneyBookingDetailJourney | null;

  readonly snapshot: JourneyBookingDetailSnapshot | null;
  readonly pricing: JourneyBookingDetailPricing | null;
  readonly payment: JourneyBookingDetailPayment | null;
  readonly cancellation: JourneyBookingDetailCancellation | null;

  readonly version: number;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// =============================================================================
// Journey Booking Detail Response
// =============================================================================

export interface JourneyBookingDetailResponse {
  readonly booking: JourneyBookingDetail;
}

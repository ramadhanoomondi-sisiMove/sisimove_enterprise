import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";

/**
 * sisiMove — Admin Member Bookings API
 *
 * Reads detailed bookings for a selected passenger using:
 * GET /journey-bookings/passenger/:passengerPublicId/detail
 *
 * Response shape follows JourneyBookingDetailResponse:
 * {
 *   booking: JourneyBookingDetail,
 *   activitySummary: JourneyBookingActivitySummary | null
 * }
 *
 * Dates are serialized as ISO strings in the HTTP JSON response.
 */

export interface MemberBookingApiResponse {
  booking: {
    publicId: string;
    journeyPublicId: string;
    passengerPublicId: string;
    status: string;
    seats: number;
    confirmedAt: string | null;
    cancelledAt: string | null;
    completedAt: string | null;
    expiredAt: string | null;
    journey: {
      publicId: string;
      providerPublicId: string;
      status: string;
      publishedAt: string | null;
      startedAt: string | null;
      completionRequestedAt: string | null;
      completedAt: string | null;
      cancelledAt: string | null;
      expiredAt: string | null;
      version: number;
      provider: {
        traveller: {
          publicId: string;
          handle: string;
          bio: string | null;
          avatar: string | null;
          countryCode: string | null;
        };
        trust: {
          verificationLevel: string;
          ratingAverage: number | null;
          ratingCount: number;
          completedJourneys: number;
          badges: Array<{
            publicId: string;
            type: string;
            name: string;
            description: string | null;
            asset: {
              publicId: string;
              url: string;
              alt: string | null;
            } | null;
          }>;
        };
      };
    };
    snapshot: {
      publicId: string;
      originName: string;
      destinationName: string;
      originCoordinates: {
        latitude: number;
        longitude: number;
      };
      destinationCoordinates: {
        latitude: number;
        longitude: number;
      };
      departureAt: string;
      arrivalAt: string | null;
      timezone: string;
      vehicleMake: string | null;
      vehicleModel: string | null;
      vehicleYear: number | null;
      vehicleColor: string | null;
      vehicleRegistration: string | null;
      createdAt: string;
      updatedAt: string;
    } | null;
    pricing: {
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
    } | null;
    payment: {
      publicId: string;
      status: string;
      amount: number;
      currency: string;
      transactionPublicId: string | null;
      authorizedAt: string | null;
      capturedAt: string | null;
      failedAt: string | null;
      refundedAt: string | null;
      failureReason: string | null;
      createdAt: string;
      updatedAt: string;
    } | null;
    cancellation: {
      publicId: string;
      reason: string;
      cancelledByPublicId: string | null;
      reasonDescription: string | null;
      cancelledAt: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    version: number;
    createdAt: string;
    updatedAt: string;
  };
  activitySummary: {
    associatedBookingsCount: number;
    participantsCount: number;
    messagesCount: number;
    unreadMessagesCount: number;
  } | null;
}

export const memberBookingsApi = {
  /**
   * Returns detailed bookings belonging to the specified passenger.
   *
   * Backend:
   * GET /journey-bookings/passenger/:passengerPublicId/detail
   */
  async getByPassengerPublicId(
    passengerPublicId: string,
  ): Promise<MemberBookingApiResponse[]> {
    const id = encodeURIComponent(passengerPublicId);

    return authenticatedApiClient.get<MemberBookingApiResponse[]>(
      `/journey-bookings/passenger/${id}/detail`,
    );
  },
};

export default memberBookingsApi;

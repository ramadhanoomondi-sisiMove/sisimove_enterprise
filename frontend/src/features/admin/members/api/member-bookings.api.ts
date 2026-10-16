import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";

/**
 * sisiMove — Admin Member Bookings API
 *
 * Reads bookings for a selected passenger using the existing backend route.
 * The backend protects this endpoint with the `booking:read` permission.
 *
 * Dates are serialized as ISO strings in the HTTP JSON response.
 */
export interface MemberBookingApiResponse {
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
  snapshot?: {
    publicId: string;
    originName: string;
    destinationName: string;
    originCoordinates: { latitude: number; longitude: number };
    destinationCoordinates: { latitude: number; longitude: number };
    departureAt: string;
    arrivalAt?: string;
    timezone: string;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: number;
    vehicleColor?: string;
    vehicleRegistration?: string;
    createdAt: string;
    updatedAt: string;
  };
  pricing?: {
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
  };
  payment?: {
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
  };
  cancellation?: {
    publicId: string;
    reason: string;
    cancelledByPublicId?: string;
    reasonDescription?: string;
    cancelledAt: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const memberBookingsApi = {
  /**
   * Returns bookings belonging to the specified passenger identity.
   *
   * Backend: GET /journey-bookings/passenger/:passengerPublicId
   */
  async getByPassengerPublicId(
    passengerPublicId: string,
  ): Promise<MemberBookingApiResponse[]> {
    const id = encodeURIComponent(passengerPublicId);

    return authenticatedApiClient.get<MemberBookingApiResponse[]>(
      `/journey-bookings/passenger/${id}`,
    );
  },
};

export default memberBookingsApi;

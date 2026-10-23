
/**
 * sisiMove — Journey Bookings API
 *
 * HTTP adapter for the Journey Booking REST API.
 *
 * Responsibilities:
 * - Expose confirmed backend booking endpoints.
 * - Use the authenticated API client for protected requests.
 * - Encode public IDs and status path parameters safely.
 * - Keep HTTP transport separate from response mapping.
 *
 * Backend source:
 * JourneyBookingController
 *
 * Base route: /journey-bookings
 */

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import type { JourneyBookingBackendResponse } from '../mappers/journey-booking.mapper';

import type { JourneyBookingStatus } from '../models/journey-booking.model';

// -----------------------------------------------------------------------------
// Query / request contracts
// -----------------------------------------------------------------------------

export interface CreateJourneyBookingRequest {
  journeyPublicId: string;
  seats: number;
}

export interface CreateJourneyBookingSnapshotRequest {
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
  timezone: string;
  correlationId?: string;
  arrivalAt?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleColor?: string;
  vehicleRegistration?: string;
  causationId?: string;
}

export interface SetJourneyBookingPricingRequest {
  pricePerSeat: number;
  seats: number;
  subtotal: number;
  totalAmount: number;
  currency: string;
  correlationId?: string;
  discountAmount?: number;
  adjustmentAmount?: number;
  causationId?: string;
}

export interface CreateJourneyBookingPaymentRequest {
  status: string;
  amount: number;
  currency: string;
  correlationId?: string;
  transactionPublicId?: string;
  causationId?: string;
}

export interface AuthorizeJourneyBookingPaymentRequest {
  transactionPublicId: string;
}

export interface CancelJourneyBookingRequest {
  reason: string;
  reasonDescription?: string;
  cancelledAt?: string;
}

export interface FailJourneyBookingPaymentRequest {
  failureReason: string;
}

export interface PartiallyRefundJourneyBookingPaymentRequest {
  refundedAmount: number;
  remainingAmount: number;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

const BASE_PATH = '/journey-bookings';

function encodePathSegment(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return encodeURIComponent(normalized);
}

export const journeyBookingsApi = {
  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  /**
   * GET /journey-bookings/mine
   * Returns the authenticated passenger's bookings.
   */
  async getMine(): Promise<readonly JourneyBookingBackendResponse[]> {
    return authenticatedApiClient.get<JourneyBookingBackendResponse[]>(
      `${BASE_PATH}/mine`,
    );
  },

  /**
   * GET /journey-bookings/mine/detail
   * Returns detailed bookings for the authenticated passenger.
   */
  async getMineDetail<TResponse = unknown>(): Promise<readonly TResponse[]> {
    return authenticatedApiClient.get<TResponse[]>(
      `${BASE_PATH}/mine/detail`,
    );
  },

  /**
   * GET /journey-bookings/journey/:journeyPublicId
   */
  async getByJourney(
    journeyPublicId: string,
  ): Promise<readonly JourneyBookingBackendResponse[]> {
    const id = encodePathSegment(journeyPublicId, 'journeyPublicId');

    return authenticatedApiClient.get<JourneyBookingBackendResponse[]>(
      `${BASE_PATH}/journey/${id}`,
    );
  },

  /**
   * GET /journey-bookings/passenger/:passengerPublicId
   */
  async getByPassenger(
    passengerPublicId: string,
  ): Promise<readonly JourneyBookingBackendResponse[]> {
    const id = encodePathSegment(passengerPublicId, 'passengerPublicId');

    return authenticatedApiClient.get<JourneyBookingBackendResponse[]>(
      `${BASE_PATH}/passenger/${id}`,
    );
  },

  /**
   * GET /journey-bookings/passenger/:passengerPublicId/detail
   */
  async getDetailedByPassenger<TResponse = unknown>(
    passengerPublicId: string,
  ): Promise<readonly TResponse[]> {
    const id = encodePathSegment(passengerPublicId, 'passengerPublicId');

    return authenticatedApiClient.get<TResponse[]>(
      `${BASE_PATH}/passenger/${id}/detail`,
    );
  },

  /**
   * GET /journey-bookings/status/:status
   */
  async getByStatus(
    status: JourneyBookingStatus | string,
  ): Promise<readonly JourneyBookingBackendResponse[]> {
    const normalizedStatus = encodePathSegment(status, 'status');

    return authenticatedApiClient.get<JourneyBookingBackendResponse[]>(
      `${BASE_PATH}/status/${normalizedStatus}`,
    );
  },

  /**
   * GET /journey-bookings/journey/:journeyPublicId/passenger/:passengerPublicId
   */
  async getByJourneyAndPassenger(
    journeyPublicId: string,
    passengerPublicId: string,
  ): Promise<readonly JourneyBookingBackendResponse[]> {
    const journeyId = encodePathSegment(journeyPublicId, 'journeyPublicId');
    const passengerId = encodePathSegment(
      passengerPublicId,
      'passengerPublicId',
    );

    return authenticatedApiClient.get<JourneyBookingBackendResponse[]>(
      `${BASE_PATH}/journey/${journeyId}/passenger/${passengerId}`,
    );
  },

  /**
   * GET /journey-bookings/transaction/:transactionPublicId
   */
  async getByTransaction(
    transactionPublicId: string,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      transactionPublicId,
      'transactionPublicId',
    );

    return authenticatedApiClient.get<JourneyBookingBackendResponse>(
      `${BASE_PATH}/transaction/${id}`,
    );
  },

  /**
   * GET /journey-bookings/count
   */
  async getCount(): Promise<number> {
    return authenticatedApiClient.get<number>(`${BASE_PATH}/count`);
  },

  /**
   * GET /journey-bookings/:journeyBookingPublicId
   */
  async getByPublicId(
    journeyBookingPublicId: string,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.get<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}`,
    );
  },

  /**
   * GET /journey-bookings/:journeyBookingPublicId/detail
   *
   * This backend route returns the authenticated passenger's detail view
   * and enforces ownership.
   */
  async getDetail<TResponse = unknown>(
    journeyBookingPublicId: string,
  ): Promise<TResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.get<TResponse>(
      `${BASE_PATH}/${id}/detail`,
    );
  },

  // ---------------------------------------------------------------------------
  // Booking commands
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-bookings
   */
  async create(
    request: CreateJourneyBookingRequest,
  ): Promise<JourneyBookingBackendResponse> {
    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      BASE_PATH,
      request,
    );
  },

  /**
   * POST /journey-bookings/:journeyBookingPublicId/snapshot
   */
  async createSnapshot(
    journeyBookingPublicId: string,
    request: CreateJourneyBookingSnapshotRequest,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/snapshot`,
      request,
    );
  },

  /**
   * POST /journey-bookings/:journeyBookingPublicId/pricing
   */
  async setPricing(
    journeyBookingPublicId: string,
    request: SetJourneyBookingPricingRequest,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/pricing`,
      request,
    );
  },

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment
   */
  async createPayment(
    journeyBookingPublicId: string,
    request: CreateJourneyBookingPaymentRequest,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/payment`,
      request,
    );
  },

  /**
   * POST /journey-bookings/:journeyBookingPublicId/confirm
   *
   * The backend performs payment authorization, financial hold creation,
   * booking confirmation, and capacity reservation atomically.
   */
  async confirm(
    journeyBookingPublicId: string,
    request: AuthorizeJourneyBookingPaymentRequest,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/confirm`,
      request,
    );
  },

  /**
   * POST /journey-bookings/:journeyBookingPublicId/cancel
   */
  async cancel(
    journeyBookingPublicId: string,
    request: CancelJourneyBookingRequest,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/cancel`,
      request,
    );
  },

  /**
   * POST /journey-bookings/:journeyBookingPublicId/complete
   */
  async complete(
    journeyBookingPublicId: string,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/complete`,
    );
  },

  /**
   * POST /journey-bookings/:journeyBookingPublicId/expire
   */
  async expire(
    journeyBookingPublicId: string,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/expire`,
    );
  },

  // ---------------------------------------------------------------------------
  // Payment commands
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment/authorize
   *
   * Standalone authorization. Normal booking confirmation should use confirm().
   */
  async authorizePayment(
    journeyBookingPublicId: string,
    request: AuthorizeJourneyBookingPaymentRequest,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/payment/authorize`,
      request,
    );
  },

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment/capture
   */
  async capturePayment(
    journeyBookingPublicId: string,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/payment/capture`,
    );
  },

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment/fail
   */
  async failPayment(
    journeyBookingPublicId: string,
    request: FailJourneyBookingPaymentRequest,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/payment/fail`,
      request,
    );
  },

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment/refund
   */
  async refundPayment(
    journeyBookingPublicId: string,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/payment/refund`,
    );
  },

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment/refund/partial
   */
  async partiallyRefundPayment(
    journeyBookingPublicId: string,
    request: PartiallyRefundJourneyBookingPaymentRequest,
  ): Promise<JourneyBookingBackendResponse> {
    const id = encodePathSegment(
      journeyBookingPublicId,
      'journeyBookingPublicId',
    );

    return authenticatedApiClient.post<JourneyBookingBackendResponse>(
      `${BASE_PATH}/${id}/payment/refund/partial`,
      request,
    );
  },
};

export default journeyBookingsApi;

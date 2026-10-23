
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Admin Bookings
 * Admin Bookings API Adapter
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Retrieve, inspect, count, and filter existing journey bookings.
 * - Manage supported booking lifecycle transitions.
 * - Manage booking snapshots, pricing, and payment components where supported.
 * - Execute supported payment lifecycle operations.
 * - Map backend DTOs into normalized AdminBooking models.
 * - Keep HTTP and response-mapping concerns outside React components.
 *
 * Security:
 * - Protected endpoints require JWT authentication and appropriate permissions.
 * - Backend authorization, domain rules, and payment workflows remain authoritative.
 * - This adapter never reads authSessionStorage directly.
 * - Booking creation remains part of the passenger booking workflow.
 *
 * Backend contract:
 * - GET /journey-bookings/all
 * - GET /journey-bookings/count
 * - GET /journey-bookings/:journeyBookingPublicId
 * - GET /journey-bookings/journey/:journeyPublicId
 * - GET /journey-bookings/passenger/:passengerPublicId
 * - GET /journey-bookings/status/:status
 * - GET /journey-bookings/journey/:journeyPublicId/passenger/:passengerPublicId
 * - GET /journey-bookings/transaction/:transactionPublicId
 * - POST /journey-bookings/:journeyBookingPublicId/confirm
 * - POST /journey-bookings/:journeyBookingPublicId/cancel
 * - POST /journey-bookings/:journeyBookingPublicId/complete
 * - POST /journey-bookings/:journeyBookingPublicId/expire
 * - POST /journey-bookings/:journeyBookingPublicId/snapshot
 * - POST /journey-bookings/:journeyBookingPublicId/pricing
 * - POST /journey-bookings/:journeyBookingPublicId/payment
 * - POST /journey-bookings/:journeyBookingPublicId/payment/authorize
 * - POST /journey-bookings/:journeyBookingPublicId/payment/capture
 * - POST /journey-bookings/:journeyBookingPublicId/payment/fail
 * - POST /journey-bookings/:journeyBookingPublicId/payment/refund
 * - POST /journey-bookings/:journeyBookingPublicId/payment/refund/partial
 *
 * -----------------------------------------------------------------------------
 */

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import type {
  AdminBooking,
  AdminBookingApiResponse,
} from '../models/admin-booking.model';

import { AdminBookingMapper } from '../mappers/admin-booking.mapper';

// =============================================================================
// Request Models
// =============================================================================

export interface CreateAdminBookingSnapshotRequest {
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
  readonly timezone: string;
  readonly arrivalAt?: string;
  readonly vehicleMake?: string;
  readonly vehicleModel?: string;
  readonly vehicleYear?: number;
  readonly vehicleColor?: string;
  readonly vehicleRegistration?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
}

export interface SetAdminBookingPricingRequest {
  readonly pricePerSeat: number;
  readonly seats: number;
  readonly subtotal: number;
  readonly totalAmount: number;
  readonly currency: string;
  readonly discountAmount?: number;
  readonly adjustmentAmount?: number;
  readonly correlationId?: string;
  readonly causationId?: string;
}

export interface CreateAdminBookingPaymentRequest {
  readonly status: string;
  readonly amount: number;
  readonly currency: string;
  readonly transactionPublicId?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
}

export interface AuthorizeAdminBookingPaymentRequest {
  readonly transactionPublicId: string;
}

export interface CancelAdminBookingRequest {
  readonly reason: string;
  readonly reasonDescription?: string;
  readonly cancelledAt?: string;
}

export interface FailAdminBookingPaymentRequest {
  readonly failureReason: string;
}

export interface PartialAdminBookingRefundRequest {
  readonly refundedAmount: number;
  readonly remainingAmount: number;
}

// =============================================================================
// API Adapter
// =============================================================================

class AdminBookingsApi {
  private readonly basePath = '/journey-bookings';

  // ===========================================================================
  // QUERY OPERATIONS
  // ===========================================================================

  /**
   * GET /journey-bookings/all
   *
   * Retrieves all existing bookings returned by the backend.
   * The current endpoint returns a bare array, not a paginated response.
   */
  public async getAll(): Promise<AdminBooking[]> {
    const responses =
      await authenticatedApiClient.get<AdminBookingApiResponse[]>(
        `${this.basePath}/all`,
      );

    return AdminBookingMapper.fromResponses(responses);
  }

  /**
   * GET /journey-bookings/:journeyBookingPublicId
   */
  public async getByPublicId(
    journeyBookingPublicId: string,
  ): Promise<AdminBooking> {
    const id = this.assertPublicId(journeyBookingPublicId);

    const response =
      await authenticatedApiClient.get<AdminBookingApiResponse>(
        `${this.basePath}/${encodeURIComponent(id)}`,
      );

    return AdminBookingMapper.fromResponse(response);
  }

  /**
   * GET /journey-bookings/count
   */
  public async count(): Promise<number> {
    return authenticatedApiClient.get<number>(
      `${this.basePath}/count`,
    );
  }

  /**
   * GET /journey-bookings/journey/:journeyPublicId
   */
  public async getByJourney(
    journeyPublicId: string,
  ): Promise<AdminBooking[]> {
    const id = this.assertPublicId(journeyPublicId);

    return this.getMappedCollection(
      `${this.basePath}/journey/${encodeURIComponent(id)}`,
    );
  }

  /**
   * GET /journey-bookings/passenger/:passengerPublicId
   */
  public async getByPassenger(
    passengerPublicId: string,
  ): Promise<AdminBooking[]> {
    const id = this.assertPublicId(passengerPublicId);

    return this.getMappedCollection(
      `${this.basePath}/passenger/${encodeURIComponent(id)}`,
    );
  }

  /**
   * GET /journey-bookings/status/:status
   */
  public async getByStatus(
    status: string,
  ): Promise<AdminBooking[]> {
    const normalizedStatus = status.trim().toUpperCase();

    if (!normalizedStatus) {
      throw new Error('Booking status is required.');
    }

    return this.getMappedCollection(
      `${this.basePath}/status/${encodeURIComponent(normalizedStatus)}`,
    );
  }

  /**
   * GET /journey-bookings/journey/:journeyPublicId/passenger/:passengerPublicId
   */
  public async getByJourneyAndPassenger(
    journeyPublicId: string,
    passengerPublicId: string,
  ): Promise<AdminBooking[]> {
    const journeyId = this.assertPublicId(journeyPublicId);
    const passengerId = this.assertPublicId(passengerPublicId);

    return this.getMappedCollection(
      `${this.basePath}/journey/${encodeURIComponent(journeyId)}` +
        `/passenger/${encodeURIComponent(passengerId)}`,
    );
  }

  /**
   * GET /journey-bookings/transaction/:transactionPublicId
   */
  public async getByTransaction(
    transactionPublicId: string,
  ): Promise<AdminBooking> {
    const transactionId = this.assertPublicId(transactionPublicId);

    const response =
      await authenticatedApiClient.get<AdminBookingApiResponse>(
        `${this.basePath}/transaction/${encodeURIComponent(transactionId)}`,
      );

    return AdminBookingMapper.fromResponse(response);
  }

  // ===========================================================================
  // BOOKING LIFECYCLE
  // ===========================================================================

  /**
   * POST /journey-bookings/:journeyBookingPublicId/confirm
   *
   * Uses the backend's atomic payment-and-confirmation workflow.
   */
  public async confirm(
    journeyBookingPublicId: string,
    request: AuthorizeAdminBookingPaymentRequest,
  ): Promise<AdminBooking> {
    this.assertPublicId(request.transactionPublicId);

    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/confirm`,
      request,
    );
  }

  /**
   * POST /journey-bookings/:journeyBookingPublicId/cancel
   */
  public async cancel(
    journeyBookingPublicId: string,
    request: CancelAdminBookingRequest,
  ): Promise<AdminBooking> {
    if (!request.reason.trim()) {
      throw new Error('Cancellation reason is required.');
    }

    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/cancel`,
      request,
    );
  }

  /**
   * POST /journey-bookings/:journeyBookingPublicId/complete
   */
  public async complete(
    journeyBookingPublicId: string,
  ): Promise<AdminBooking> {
    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/complete`,
    );
  }

  /**
   * POST /journey-bookings/:journeyBookingPublicId/expire
   */
  public async expire(
    journeyBookingPublicId: string,
  ): Promise<AdminBooking> {
    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/expire`,
    );
  }

  // ===========================================================================
  // BOOKING COMPONENTS
  // ===========================================================================

  /**
   * POST /journey-bookings/:journeyBookingPublicId/snapshot
   *
   * Creates the booking's route, schedule, and vehicle snapshot.
   * This is not a general-purpose snapshot edit operation.
   */
  public async createSnapshot(
    journeyBookingPublicId: string,
    request: CreateAdminBookingSnapshotRequest,
  ): Promise<AdminBooking> {
    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/snapshot`,
      request,
    );
  }

  /**
   * POST /journey-bookings/:journeyBookingPublicId/pricing
   *
   * Creates or updates pricing, according to the backend implementation.
   */
  public async setPricing(
    journeyBookingPublicId: string,
    request: SetAdminBookingPricingRequest,
  ): Promise<AdminBooking> {
    this.assertPositiveInteger(request.seats, 'Seats');

    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/pricing`,
      request,
    );
  }

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment
   *
   * Creates a payment component. This does not replace the confirmation
   * workflow or guarantee that money has been settled.
   */
  public async createPayment(
    journeyBookingPublicId: string,
    request: CreateAdminBookingPaymentRequest,
  ): Promise<AdminBooking> {
    if (!request.status.trim()) {
      throw new Error('Payment status is required.');
    }

    if (!Number.isFinite(request.amount) || request.amount < 0) {
      throw new Error('Payment amount must be a valid non-negative number.');
    }

    if (!request.currency.trim()) {
      throw new Error('Payment currency is required.');
    }

    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/payment`,
      request,
    );
  }

  // ===========================================================================
  // PAYMENT LIFECYCLE
  // ===========================================================================

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment/authorize
   */
  public async authorizePayment(
    journeyBookingPublicId: string,
    request: AuthorizeAdminBookingPaymentRequest,
  ): Promise<AdminBooking> {
    this.assertPublicId(request.transactionPublicId);

    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/payment/authorize`,
      request,
    );
  }

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment/capture
   */
  public async capturePayment(
    journeyBookingPublicId: string,
  ): Promise<AdminBooking> {
    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/payment/capture`,
    );
  }

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment/fail
   */
  public async failPayment(
    journeyBookingPublicId: string,
    request: FailAdminBookingPaymentRequest,
  ): Promise<AdminBooking> {
    if (!request.failureReason.trim()) {
      throw new Error('Payment failure reason is required.');
    }

    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/payment/fail`,
      request,
    );
  }

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment/refund
   */
  public async refundPayment(
    journeyBookingPublicId: string,
  ): Promise<AdminBooking> {
    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/payment/refund`,
    );
  }

  /**
   * POST /journey-bookings/:journeyBookingPublicId/payment/refund/partial
   */
  public async partiallyRefundPayment(
    journeyBookingPublicId: string,
    request: PartialAdminBookingRefundRequest,
  ): Promise<AdminBooking> {
    if (
      !Number.isFinite(request.refundedAmount) ||
      request.refundedAmount <= 0
    ) {
      throw new Error('Refunded amount must be greater than zero.');
    }

    if (
      !Number.isFinite(request.remainingAmount) ||
      request.remainingAmount < 0
    ) {
      throw new Error('Remaining amount must be a valid non-negative number.');
    }

    return this.postBookingAction(
      `${this.bookingPath(journeyBookingPublicId)}/payment/refund/partial`,
      request,
    );
  }

  // ===========================================================================
  // INTERNAL HELPERS
  // ===========================================================================

  private async getMappedCollection(
    path: string,
  ): Promise<AdminBooking[]> {
    const responses =
      await authenticatedApiClient.get<AdminBookingApiResponse[]>(path);

    return AdminBookingMapper.fromResponses(responses);
  }

  private async postBookingAction(
    path: string,
    body?: unknown,
  ): Promise<AdminBooking> {
    const response =
      await authenticatedApiClient.post<AdminBookingApiResponse>(
        path,
        body,
      );

    return AdminBookingMapper.fromResponse(response);
  }

  private bookingPath(journeyBookingPublicId: string): string {
    const id = this.assertPublicId(journeyBookingPublicId);

    return `${this.basePath}/${encodeURIComponent(id)}`;
  }

  private assertPublicId(value: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error('A public ID is required.');
    }

    return normalized;
  }

  private assertPositiveInteger(
    value: number,
    fieldName: string,
  ): void {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(`${fieldName} must be a positive integer.`);
    }
  }
}

// =============================================================================
// Shared Instance
// =============================================================================

export const adminBookingsApi = new AdminBookingsApi();

export default adminBookingsApi;

//src/features/admin/bookings/mappers/admin-booking.mapper.ts
import {
  AdminBookingCancellationReason,
  AdminBookingPaymentStatus,
  AdminBookingStatus,
} from '../models/admin-booking.enums';

import type {
  AdminBooking,
  AdminBookingApiResponse,
  AdminBookingCancellation,
  AdminBookingPayment,
  AdminBookingPricing,
  AdminBookingSnapshot,
  AdminBookingSnapshotVehicle,
} from '../models/admin-booking.model';

/**
 * sisiMove — Admin Booking Mapper
 *
 * Converts the frontend-owned API response contract into the
 * normalized AdminBooking model.
 *
 * This mapper performs no API requests and no domain mutations.
 */
export class AdminBookingMapper {
  public static fromResponse(
    response: AdminBookingApiResponse,
  ): AdminBooking {
    const snapshot = response.snapshot;
    const pricing = response.pricing;
    const payment = response.payment;
    const cancellation = response.cancellation;

    const vehicle: AdminBookingSnapshotVehicle | null = snapshot
      ? {
          make: snapshot.vehicleMake ?? null,
          model: snapshot.vehicleModel ?? null,
          year: snapshot.vehicleYear ?? null,
          color: snapshot.vehicleColor ?? null,
          registration: snapshot.vehicleRegistration ?? null,
        }
      : null;

    const mappedSnapshot: AdminBookingSnapshot | null = snapshot
      ? {
          originName: snapshot.originName,
          destinationName: snapshot.destinationName,
          originCoordinates: {
            latitude: snapshot.originCoordinates.latitude,
            longitude: snapshot.originCoordinates.longitude,
          },
          destinationCoordinates: {
            latitude: snapshot.destinationCoordinates.latitude,
            longitude: snapshot.destinationCoordinates.longitude,
          },
          departureAt: snapshot.departureAt,
          arrivalAt: snapshot.arrivalAt ?? null,
          timezone: snapshot.timezone,
          vehicle,
        }
      : null;

    const mappedPricing: AdminBookingPricing | null = pricing
      ? {
          pricePerSeat: pricing.pricePerSeat,
          seats: pricing.seats,
          subtotal: pricing.subtotal,
          discountAmount: pricing.discountAmount,
          adjustmentAmount: pricing.adjustmentAmount,
          totalAmount: pricing.totalAmount,
          currency: pricing.currency,
        }
      : null;

    const mappedPayment: AdminBookingPayment | null = payment
      ? {
          status: payment.status as AdminBookingPaymentStatus,
          amount: payment.amount,
          currency: payment.currency,
          transactionPublicId: payment.transactionPublicId ?? null,
          authorizedAt: payment.authorizedAt ?? null,
          capturedAt: payment.capturedAt ?? null,
          failedAt: payment.failedAt ?? null,
          refundedAt: payment.refundedAt ?? null,
          failureReason: payment.failureReason ?? null,
        }
      : null;

    const mappedCancellation: AdminBookingCancellation | null =
      cancellation
        ? {
            reason: cancellation.reason as AdminBookingCancellationReason,
            cancelledByPublicId:
              cancellation.cancelledByPublicId ?? null,
            reasonDescription: cancellation.reasonDescription ?? null,
            cancelledAt: cancellation.cancelledAt,
          }
        : null;

    return {
      publicId: response.publicId,
      journeyPublicId: response.journeyPublicId,
      passengerPublicId: response.passengerPublicId,
      status: response.status as AdminBookingStatus,
      seats: response.seats,
      confirmedAt: response.confirmedAt ?? null,
      cancelledAt: response.cancelledAt ?? null,
      completedAt: response.completedAt ?? null,
      expiredAt: response.expiredAt ?? null,
      version: response.version,
      snapshot: mappedSnapshot,
      pricing: mappedPricing,
      payment: mappedPayment,
      cancellation: mappedCancellation,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  public static fromResponses(
    responses: readonly AdminBookingApiResponse[],
  ): AdminBooking[] {
    return responses.map((response) => this.fromResponse(response));
  }
}

export default AdminBookingMapper;

// src/domains/journey-booking/presentation/rest/mappers/journey-booking-response.mapper.ts

// -----------------------------------------------------------------------------
// Journey Booking — REST Response Mapper
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyBookingAggregate } from '../../../domain/aggregates/journey-booking.aggregate';

import type { JourneyBookingEntity } from '../../../domain/entities/journey-booking.entity';

import type { JourneyBookingSnapshotEntity } from '../../../domain/entities/journey-booking-snapshot.entity';

import type { JourneyBookingPricingEntity } from '../../../domain/entities/journey-booking-pricing.entity';

import type { JourneyBookingPaymentEntity } from '../../../domain/entities/journey-booking-payment.entity';

import type { JourneyBookingCancellationEntity } from '../../../domain/entities/journey-booking-cancellation.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * REST representation of a Journey Booking.
 *
 * Domain value objects are deliberately converted to primitives at the
 * presentation boundary.
 */
export interface JourneyBookingResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  journeyPublicId: string;

  passengerPublicId: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  status: string;

  seats: number;

  confirmedAt: Date | undefined;

  cancelledAt: Date | undefined;

  completedAt: Date | undefined;

  expiredAt: Date | undefined;

  version: number;

  // ===========================================================================
  // Components
  // ===========================================================================

  snapshot: JourneyBookingSnapshotResponse | undefined;

  pricing: JourneyBookingPricingResponse | undefined;

  payment: JourneyBookingPaymentResponse | undefined;

  cancellation: JourneyBookingCancellationResponse | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Snapshot Response
// -----------------------------------------------------------------------------

export interface JourneyBookingSnapshotResponse {
  publicId: string;

  originName: string;

  destinationName: string;

  originCoordinates: unknown;

  destinationCoordinates: unknown;

  departureAt: unknown;

  arrivalAt: unknown;

  timezone: string;

  vehicleMake: string | undefined;

  vehicleModel: string | undefined;

  vehicleYear: number | undefined;

  vehicleColor: string | undefined;

  vehicleRegistration: string | undefined;

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Pricing Response
// -----------------------------------------------------------------------------

export interface JourneyBookingPricingResponse {
  publicId: string;

  pricePerSeat: number;

  seats: number;

  subtotal: number;

  discountAmount: number;

  adjustmentAmount: number;

  totalAmount: number;

  currency: string;

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Payment Response
// -----------------------------------------------------------------------------

export interface JourneyBookingPaymentResponse {
  publicId: string;

  status: string;

  amount: number;

  currency: string;

  transactionPublicId: string | undefined;

  authorizedAt: Date | undefined;

  capturedAt: Date | undefined;

  failedAt: Date | undefined;

  refundedAt: Date | undefined;

  failureReason: string | undefined;

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Cancellation Response
// -----------------------------------------------------------------------------

export interface JourneyBookingCancellationResponse {
  publicId: string;

  reason: string;

  cancelledByPublicId: string | undefined;

  reasonDescription: string | undefined;

  cancelledAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Journey Booking domain objects into REST response objects.
 *
 * Responsibilities:
 *
 * - Convert value objects into primitive values.
 * - Preserve optional aggregate components as undefined.
 * - Keep domain entities out of the HTTP response.
 * - Avoid exposing Entity internals, props, or UniqueEntityId objects.
 *
 * The mapper accepts both the aggregate and root entity so collection queries
 * can map JourneyBookingEntity instances without requiring aggregate
 * rehydration.
 */
export class JourneyBookingResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  public static toResponse(
    aggregate: JourneyBookingAggregate,
  ): JourneyBookingResponse {
    return this.fromEntity(aggregate.journeyBooking);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  public static fromEntity(
    booking: JourneyBookingEntity,
  ): JourneyBookingResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: booking.publicId.value,

      journeyPublicId: booking.journeyPublicId.value,

      passengerPublicId: booking.passengerPublicId.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: booking.status.value,

      seats: booking.seats.value,

      confirmedAt: booking.confirmedAt,

      cancelledAt: booking.cancelledAt,

      completedAt: booking.completedAt,

      expiredAt: booking.expiredAt,

      version: booking.version,

      // -----------------------------------------------------------------------
      // Components
      // -----------------------------------------------------------------------

      snapshot:
        booking.snapshot !== undefined
          ? this.mapSnapshot(booking.snapshot)
          : undefined,

      pricing:
        booking.pricing !== undefined
          ? this.mapPricing(booking.pricing)
          : undefined,

      payment:
        booking.payment !== undefined
          ? this.mapPayment(booking.payment)
          : undefined,

      cancellation:
        booking.cancellation !== undefined
          ? this.mapCancellation(booking.cancellation)
          : undefined,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: booking.createdAt,

      updatedAt: booking.updatedAt,
    };
  }

  // ===========================================================================
  // Collection
  // ===========================================================================

  public static fromEntities(
    bookings: readonly JourneyBookingEntity[],
  ): JourneyBookingResponse[] {
    return bookings.map((booking) => this.fromEntity(booking));
  }

  // ===========================================================================
  // Snapshot
  // ===========================================================================

  private static mapSnapshot(
    snapshot: JourneyBookingSnapshotEntity,
  ): JourneyBookingSnapshotResponse {
    return {
      publicId: snapshot.publicId.value,

      originName: snapshot.originName.value,

      destinationName: snapshot.destinationName.value,

      originCoordinates: snapshot.originCoordinates,

      destinationCoordinates: snapshot.destinationCoordinates,

      departureAt: snapshot.departureAt,

      arrivalAt: snapshot.arrivalAt,

      timezone: snapshot.timezone.value,

      vehicleMake: snapshot.vehicleMake,

      vehicleModel: snapshot.vehicleModel,

      vehicleYear: snapshot.vehicleYear,

      vehicleColor: snapshot.vehicleColor,

      vehicleRegistration: snapshot.vehicleRegistration,

      createdAt: snapshot.createdAt,

      updatedAt: snapshot.updatedAt,
    };
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  private static mapPricing(
    pricing: JourneyBookingPricingEntity,
  ): JourneyBookingPricingResponse {
    return {
      publicId: pricing.publicId.value,

      pricePerSeat: pricing.pricePerSeat.value,

      seats: pricing.seats.value,

      subtotal: pricing.subtotal.value,

      discountAmount: pricing.discountAmount.value,

      adjustmentAmount: pricing.adjustmentAmount.value,

      totalAmount: pricing.totalAmount.value,

      currency: pricing.currency.value,

      createdAt: pricing.createdAt,

      updatedAt: pricing.updatedAt,
    };
  }

  // ===========================================================================
  // Payment
  // ===========================================================================

  private static mapPayment(
    payment: JourneyBookingPaymentEntity,
  ): JourneyBookingPaymentResponse {
    return {
      publicId: payment.publicId.value,

      status: payment.status.value,

      amount: payment.amount.value,

      currency: payment.currency.value,

      transactionPublicId: payment.transactionPublicId?.value,

      authorizedAt: payment.authorizedAt,

      capturedAt: payment.capturedAt,

      failedAt: payment.failedAt,

      refundedAt: payment.refundedAt,

      failureReason: payment.failureReason?.value,

      createdAt: payment.createdAt,

      updatedAt: payment.updatedAt,
    };
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  private static mapCancellation(
    cancellation: JourneyBookingCancellationEntity,
  ): JourneyBookingCancellationResponse {
    return {
      publicId: cancellation.publicId.value,

      reason: cancellation.reason.value,

      cancelledByPublicId: cancellation.cancelledByPublicId?.value,

      reasonDescription: cancellation.reasonDescription?.value,

      cancelledAt: cancellation.cancelledAt,

      createdAt: cancellation.createdAt,

      updatedAt: cancellation.updatedAt,
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBookingResponseMapper;

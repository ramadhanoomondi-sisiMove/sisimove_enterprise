// -----------------------------------------------------------------------------
// Journey Booking Prisma Mapper
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  JourneyBooking as PrismaJourneyBooking,
  JourneyBookingCancellation as PrismaJourneyBookingCancellation,
  JourneyBookingPayment as PrismaJourneyBookingPayment,
  JourneyBookingPricing as PrismaJourneyBookingPricing,
  JourneyBookingSnapshot as PrismaJourneyBookingSnapshot,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import { JourneyBookingAggregate } from '../../../../domain/aggregates/journey-booking.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import { JourneyBookingEntity } from '../../../../domain/entities/journey-booking.entity';
import { JourneyBookingSnapshotEntity } from '../../../../domain/entities/journey-booking-snapshot.entity';
import { JourneyBookingPricingEntity } from '../../../../domain/entities/journey-booking-pricing.entity';
import { JourneyBookingPaymentEntity } from '../../../../domain/entities/journey-booking-payment.entity';
import { JourneyBookingCancellationEntity } from '../../../../domain/entities/journey-booking-cancellation.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyBookingPublicId,
  JourneyBookingJourneyPublicId,
  JourneyBookingPassengerPublicId,
  JourneyBookingStatus,
  JourneyBookingSeats,
  JourneyBookingSnapshotPublicId,
  JourneyBookingOriginName,
  JourneyBookingDestinationName,
  JourneyBookingCoordinates,
  JourneyBookingDepartureAt,
  JourneyBookingArrivalAt,
  JourneyBookingTimezone,
  JourneyBookingPricingPublicId,
  JourneyBookingPricePerSeat,
  JourneyBookingSubtotal,
  JourneyBookingDiscountAmount,
  JourneyBookingAdjustmentAmount,
  JourneyBookingTotalAmount,
  JourneyBookingCurrency,
  JourneyBookingPaymentPublicId,
  JourneyBookingPaymentStatus,
  JourneyBookingPaymentAmount,
  JourneyBookingTransactionPublicId,
  JourneyBookingPaymentFailureReason,
  JourneyBookingCancellationPublicId,
  JourneyBookingCancellationReason,
  JourneyBookingCancelledByPublicId,
  JourneyBookingCancellationReasonDescription,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma Types
// =============================================================================

export type JourneyBookingWithComponents = PrismaJourneyBooking & {
  snapshot?: PrismaJourneyBookingSnapshot | null;
  pricing?: PrismaJourneyBookingPricing | null;
  payment?: PrismaJourneyBookingPayment | null;
  cancellation?: PrismaJourneyBookingCancellation | null;
};

// =============================================================================
// Persistence Component Types
// =============================================================================

export interface JourneyBookingSnapshotPersistence {
  id: string;
  publicId: string;
  bookingId: string;

  originName: string;
  originLatitude: number;
  originLongitude: number;

  destinationName: string;
  destinationLatitude: number;
  destinationLongitude: number;

  departureAt: Date;
  arrivalAt: Date | null;
  timezone: string;

  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: number | null;
  vehicleColor: string | null;
  vehicleRegistration: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface JourneyBookingPricingPersistence {
  id: string;
  publicId: string;
  bookingId: string;

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

export interface JourneyBookingPaymentPersistence {
  id: string;
  publicId: string;
  bookingId: string;

  status: JourneyBookingPaymentStatus['value'];

  amount: number;
  currency: string;

  transactionPublicId: string | null;

  authorizedAt: Date | null;
  capturedAt: Date | null;
  failedAt: Date | null;
  refundedAt: Date | null;

  failureReason: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface JourneyBookingCancellationPersistence {
  id: string;
  publicId: string;
  bookingId: string;

  reason: JourneyBookingCancellationReason['value'];

  cancelledByPublicId: string | null;
  reasonDescription: string | null;

  cancelledAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// Persistence Type
// =============================================================================

export interface JourneyBookingPersistence {
  journeyBooking: {
    id: string;
    publicId: string;

    journeyPublicId: string;
    passengerPublicId: string;

    status: JourneyBookingStatus['value'];

    seats: number;

    confirmedAt: Date | null;
    cancelledAt: Date | null;
    completedAt: Date | null;
    expiredAt: Date | null;

    version: number;

    createdAt: Date;
    updatedAt: Date;
  };

  snapshot?: JourneyBookingSnapshotPersistence;
  pricing?: JourneyBookingPricingPersistence;
  payment?: JourneyBookingPaymentPersistence;
  cancellation?: JourneyBookingCancellationPersistence;
}

// =============================================================================
// Mapper
// =============================================================================

export class JourneyBookingPrismaMapper {
  // ===========================================================================
  // Aggregate -> Domain
  // ===========================================================================

  public static toDomain(
    record: JourneyBookingWithComponents,
  ): JourneyBookingAggregate {
    // -------------------------------------------------------------------------
    // Components
    // -------------------------------------------------------------------------

    const snapshot =
      record.snapshot !== undefined && record.snapshot !== null
        ? this.snapshotToDomain(record.snapshot)
        : undefined;

    const pricing =
      record.pricing !== undefined && record.pricing !== null
        ? this.pricingToDomain(record.pricing)
        : undefined;

    const payment =
      record.payment !== undefined && record.payment !== null
        ? this.paymentToDomain(record.payment)
        : undefined;

    const cancellation =
      record.cancellation !== undefined && record.cancellation !== null
        ? this.cancellationToDomain(record.cancellation)
        : undefined;

    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new JourneyBookingPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    const entity = JourneyBookingEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // References
        // ---------------------------------------------------------------------

        journeyPublicId: new JourneyBookingJourneyPublicId(
          record.journeyPublicId,
        ),

        passengerPublicId: new JourneyBookingPassengerPublicId(
          record.passengerPublicId,
        ),

        // ---------------------------------------------------------------------
        // State
        // ---------------------------------------------------------------------

        status: JourneyBookingStatus.create(record.status),

        seats: JourneyBookingSeats.create(record.seats),

        // ---------------------------------------------------------------------
        // Components
        // ---------------------------------------------------------------------

        snapshot,
        pricing,
        payment,
        cancellation,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        confirmedAt: record.confirmedAt ?? undefined,

        cancelledAt: record.cancelledAt ?? undefined,

        completedAt: record.completedAt ?? undefined,

        expiredAt: record.expiredAt ?? undefined,

        // ---------------------------------------------------------------------
        // Concurrency
        // ---------------------------------------------------------------------

        version: record.version,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );

    // Rehydration must not emit a Created event.
    // correlationId is therefore intentionally not required here.
    return JourneyBookingAggregate.rehydrate(
      entity,
      snapshot,
      pricing,
      payment,
      cancellation,
    );
  }

  // ===========================================================================
  // Aggregate -> Persistence
  // ===========================================================================

  public static toPersistence(
    aggregate: JourneyBookingAggregate,
  ): JourneyBookingPersistence {
    // JourneyBookingAggregate exposes its entity through `journeyBooking`.
    const entity = aggregate.journeyBooking;

    const bookingId = aggregate.aggregateId.toString();

    const persistence: JourneyBookingPersistence = {
      journeyBooking: {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        id: bookingId,

        publicId: entity.publicId.value,

        // ---------------------------------------------------------------------
        // References
        // ---------------------------------------------------------------------

        journeyPublicId: entity.journeyPublicId.value,

        passengerPublicId: entity.passengerPublicId.value,

        // ---------------------------------------------------------------------
        // State
        // ---------------------------------------------------------------------

        status: entity.status.value,

        seats: entity.seats.value,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        confirmedAt: entity.confirmedAt ?? null,

        cancelledAt: entity.cancelledAt ?? null,

        completedAt: entity.completedAt ?? null,

        expiredAt: entity.expiredAt ?? null,

        // ---------------------------------------------------------------------
        // Concurrency
        // ---------------------------------------------------------------------

        version: entity.version,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: entity.createdAt,

        updatedAt: entity.updatedAt,
      },
    };

    // -------------------------------------------------------------------------
    // Snapshot
    // -------------------------------------------------------------------------

    if (entity.snapshot !== undefined) {
      persistence.snapshot = this.snapshotToPersistence(
        entity.snapshot,
        bookingId,
      );
    }

    // -------------------------------------------------------------------------
    // Pricing
    // -------------------------------------------------------------------------

    if (entity.pricing !== undefined) {
      persistence.pricing = this.pricingToPersistence(
        entity.pricing,
        bookingId,
      );
    }

    // -------------------------------------------------------------------------
    // Payment
    // -------------------------------------------------------------------------

    if (entity.payment !== undefined) {
      persistence.payment = this.paymentToPersistence(
        entity.payment,
        bookingId,
      );
    }

    // -------------------------------------------------------------------------
    // Cancellation
    // -------------------------------------------------------------------------

    if (entity.cancellation !== undefined) {
      persistence.cancellation = this.cancellationToPersistence(
        entity.cancellation,
        bookingId,
      );
    }

    return persistence;
  }
  // ===========================================================================
  // Snapshot
  // ===========================================================================

  public static snapshotToDomain(
    record: PrismaJourneyBookingSnapshot,
  ): JourneyBookingSnapshotEntity {
    const publicId = new JourneyBookingSnapshotPublicId(record.publicId);

    return JourneyBookingSnapshotEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Origin
        // ---------------------------------------------------------------------

        originName: JourneyBookingOriginName.create(record.originName),

        originCoordinates: JourneyBookingCoordinates.create(
          Number(record.originLatitude),
          Number(record.originLongitude),
        ),

        // ---------------------------------------------------------------------
        // Destination
        // ---------------------------------------------------------------------

        destinationName: JourneyBookingDestinationName.create(
          record.destinationName,
        ),

        destinationCoordinates: JourneyBookingCoordinates.create(
          Number(record.destinationLatitude),
          Number(record.destinationLongitude),
        ),

        // ---------------------------------------------------------------------
        // Schedule
        // ---------------------------------------------------------------------

        departureAt: JourneyBookingDepartureAt.create(record.departureAt),

        arrivalAt:
          record.arrivalAt !== null
            ? JourneyBookingArrivalAt.create(record.arrivalAt)
            : undefined,

        timezone: JourneyBookingTimezone.create(record.timezone),

        // ---------------------------------------------------------------------
        // Vehicle Snapshot
        // ---------------------------------------------------------------------

        vehicleMake: record.vehicleMake ?? undefined,

        vehicleModel: record.vehicleModel ?? undefined,

        vehicleYear: record.vehicleYear ?? undefined,

        vehicleColor: record.vehicleColor ?? undefined,

        vehicleRegistration: record.vehicleRegistration ?? undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  public static snapshotToPersistence(
    entity: JourneyBookingSnapshotEntity,
    bookingId: string,
  ): JourneyBookingSnapshotPersistence {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Relationship
      // -----------------------------------------------------------------------

      bookingId,

      // -----------------------------------------------------------------------
      // Origin
      // -----------------------------------------------------------------------

      originName: entity.originName.value,

      originLatitude: entity.originCoordinates.latitude,

      originLongitude: entity.originCoordinates.longitude,

      // -----------------------------------------------------------------------
      // Destination
      // -----------------------------------------------------------------------

      destinationName: entity.destinationName.value,

      destinationLatitude: entity.destinationCoordinates.latitude,

      destinationLongitude: entity.destinationCoordinates.longitude,

      // -----------------------------------------------------------------------
      // Schedule
      // -----------------------------------------------------------------------

      departureAt: entity.departureAt.toDate(),

      arrivalAt: entity.arrivalAt?.toDate() ?? null,

      timezone: entity.timezone.value,

      // -----------------------------------------------------------------------
      // Vehicle Snapshot
      // -----------------------------------------------------------------------

      vehicleMake: entity.vehicleMake ?? null,

      vehicleModel: entity.vehicleModel ?? null,

      vehicleYear: entity.vehicleYear ?? null,

      vehicleColor: entity.vehicleColor ?? null,

      vehicleRegistration: entity.vehicleRegistration ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  public static pricingToDomain(
    record: PrismaJourneyBookingPricing,
  ): JourneyBookingPricingEntity {
    const publicId = new JourneyBookingPricingPublicId(record.publicId);

    return JourneyBookingPricingEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Pricing Snapshot
        // ---------------------------------------------------------------------

        pricePerSeat: new JourneyBookingPricePerSeat(
          Number(record.pricePerSeat),
        ),

        seats: JourneyBookingSeats.create(record.seats),

        subtotal: new JourneyBookingSubtotal(Number(record.subtotal)),

        discountAmount: new JourneyBookingDiscountAmount(
          Number(record.discountAmount),
        ),

        adjustmentAmount: new JourneyBookingAdjustmentAmount(
          Number(record.adjustmentAmount),
        ),

        totalAmount: new JourneyBookingTotalAmount(Number(record.totalAmount)),

        // ---------------------------------------------------------------------
        // Currency
        // ---------------------------------------------------------------------

        currency: new JourneyBookingCurrency(record.currency),

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  public static pricingToPersistence(
    entity: JourneyBookingPricingEntity,
    bookingId: string,
  ): JourneyBookingPricingPersistence {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Relationship
      // -----------------------------------------------------------------------

      bookingId,

      // -----------------------------------------------------------------------
      // Pricing Snapshot
      // -----------------------------------------------------------------------

      pricePerSeat: entity.pricePerSeat.value,

      seats: entity.seats.value,

      subtotal: entity.subtotal.value,

      discountAmount: entity.discountAmount.value,

      adjustmentAmount: entity.adjustmentAmount.value,

      totalAmount: entity.totalAmount.value,

      // -----------------------------------------------------------------------
      // Currency
      // -----------------------------------------------------------------------

      currency: entity.currency.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Payment
  // ===========================================================================

  public static paymentToDomain(
    record: PrismaJourneyBookingPayment,
  ): JourneyBookingPaymentEntity {
    const publicId = new JourneyBookingPaymentPublicId(record.publicId);

    return JourneyBookingPaymentEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Status
        // ---------------------------------------------------------------------

        status: JourneyBookingPaymentStatus.create(record.status),

        // ---------------------------------------------------------------------
        // Amount
        // ---------------------------------------------------------------------

        amount: new JourneyBookingPaymentAmount(Number(record.amount)),

        // ---------------------------------------------------------------------
        // Currency
        // ---------------------------------------------------------------------

        currency: new JourneyBookingCurrency(record.currency),

        // ---------------------------------------------------------------------
        // Transaction
        // ---------------------------------------------------------------------

        transactionPublicId:
          record.transactionPublicId !== null
            ? new JourneyBookingTransactionPublicId(record.transactionPublicId)
            : undefined,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        authorizedAt: record.authorizedAt ?? undefined,

        capturedAt: record.capturedAt ?? undefined,

        failedAt: record.failedAt ?? undefined,

        refundedAt: record.refundedAt ?? undefined,

        // ---------------------------------------------------------------------
        // Failure
        // ---------------------------------------------------------------------

        failureReason:
          record.failureReason !== null
            ? JourneyBookingPaymentFailureReason.create(record.failureReason)
            : undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  public static paymentToPersistence(
    entity: JourneyBookingPaymentEntity,
    bookingId: string,
  ): JourneyBookingPaymentPersistence {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Relationship
      // -----------------------------------------------------------------------

      bookingId,

      // -----------------------------------------------------------------------
      // Status
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      amount: entity.amount.value,

      // -----------------------------------------------------------------------
      // Currency
      // -----------------------------------------------------------------------

      currency: entity.currency.value,

      // -----------------------------------------------------------------------
      // Transaction
      // -----------------------------------------------------------------------

      transactionPublicId: entity.transactionPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      authorizedAt: entity.authorizedAt ?? null,

      capturedAt: entity.capturedAt ?? null,

      failedAt: entity.failedAt ?? null,

      refundedAt: entity.refundedAt ?? null,

      // -----------------------------------------------------------------------
      // Failure
      // -----------------------------------------------------------------------

      failureReason: entity.failureReason?.value ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  public static cancellationToDomain(
    record: PrismaJourneyBookingCancellation,
  ): JourneyBookingCancellationEntity {
    const publicId = new JourneyBookingCancellationPublicId(record.publicId);

    return JourneyBookingCancellationEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Reason
        // ---------------------------------------------------------------------

        reason: JourneyBookingCancellationReason.create(record.reason),

        // ---------------------------------------------------------------------
        // Actor
        // ---------------------------------------------------------------------

        cancelledByPublicId:
          record.cancelledByPublicId !== null
            ? new JourneyBookingCancelledByPublicId(record.cancelledByPublicId)
            : undefined,

        // ---------------------------------------------------------------------
        // Description
        // ---------------------------------------------------------------------

        reasonDescription:
          record.reasonDescription !== null
            ? JourneyBookingCancellationReasonDescription.create(
                record.reasonDescription,
              )
            : undefined,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        cancelledAt: record.cancelledAt,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  public static cancellationToPersistence(
    entity: JourneyBookingCancellationEntity,
    bookingId: string,
  ): JourneyBookingCancellationPersistence {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Relationship
      // -----------------------------------------------------------------------

      bookingId,

      // -----------------------------------------------------------------------
      // Reason
      // -----------------------------------------------------------------------

      reason: entity.reason.value,

      // -----------------------------------------------------------------------
      // Actor
      // -----------------------------------------------------------------------

      cancelledByPublicId: entity.cancelledByPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Description
      // -----------------------------------------------------------------------

      reasonDescription: entity.reasonDescription?.value ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      cancelledAt: entity.cancelledAt,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  public static toDomainComponent(
    record:
      | PrismaJourneyBookingSnapshot
      | PrismaJourneyBookingPricing
      | PrismaJourneyBookingPayment
      | PrismaJourneyBookingCancellation,
  ):
    | JourneyBookingSnapshotEntity
    | JourneyBookingPricingEntity
    | JourneyBookingPaymentEntity
    | JourneyBookingCancellationEntity {
    // -------------------------------------------------------------------------
    // Snapshot
    // -------------------------------------------------------------------------

    if ('originName' in record && 'destinationName' in record) {
      return this.snapshotToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Pricing
    // -------------------------------------------------------------------------

    if ('pricePerSeat' in record && 'subtotal' in record) {
      return this.pricingToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Payment
    // -------------------------------------------------------------------------

    if ('transactionPublicId' in record && 'amount' in record) {
      return this.paymentToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Cancellation
    // -------------------------------------------------------------------------

    if ('cancelledByPublicId' in record && 'reason' in record) {
      return this.cancellationToDomain(record);
    }

    // -------------------------------------------------------------------------
    // Exhaustive Guard
    // -------------------------------------------------------------------------

    throw new Error('Unsupported Journey Booking component record.');
  }
}

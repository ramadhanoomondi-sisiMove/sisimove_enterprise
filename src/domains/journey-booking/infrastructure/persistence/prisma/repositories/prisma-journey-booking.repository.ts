// src/domains/journey-booking/infrastructure/persistence/repositories/prisma-journey-booking.repository.ts

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, $Enums } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBookingAggregate } from '../../../../domain/aggregates/journey-booking.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { JourneyBookingEntity } from '../../../../domain/entities/journey-booking.entity';
import type { JourneyBookingSnapshotEntity } from '../../../../domain/entities/journey-booking-snapshot.entity';
import type { JourneyBookingPricingEntity } from '../../../../domain/entities/journey-booking-pricing.entity';
import type { JourneyBookingPaymentEntity } from '../../../../domain/entities/journey-booking-payment.entity';
import type { JourneyBookingCancellationEntity } from '../../../../domain/entities/journey-booking-cancellation.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBookingRepository } from '../../../../domain/repositories/journey-booking.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyBookingCancellationPublicId,
  JourneyBookingCancellationReason,
  JourneyBookingJourneyPublicId,
  JourneyBookingPassengerPublicId,
  JourneyBookingPaymentPublicId,
  JourneyBookingPaymentStatus,
  JourneyBookingPricingPublicId,
  JourneyBookingPublicId,
  JourneyBookingSnapshotPublicId,
  JourneyBookingStatus,
  JourneyBookingTransactionPublicId,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Internal Entity ID
// -----------------------------------------------------------------------------
//
// JourneyBooking does not expose a JourneyBookingId value object from the
// domain/value-objects barrel.
//
// The internal persistence identity belongs to the entity itself, while the
// public identity is represented by JourneyBookingPublicId.
//
// Deriving the type from the entity keeps this repository aligned with the
// actual domain model without introducing a duplicate ID value object.
//

type JourneyBookingId = JourneyBookingEntity['id'];

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  JourneyBookingPrismaMapper,
  type JourneyBookingWithComponents,
} from '../../../persistence/prisma/mappers/journey-booking-prisma.mapper';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

export class PrismaJourneyBookingRepository implements JourneyBookingRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  /**
   * Converts the domain booking status into the Prisma generated enum.
   *
   * The domain owns lifecycle semantics.
   * Prisma only represents the persisted value.
   */
  private toPrismaJourneyBookingStatus(
    value: string,
  ): $Enums.JourneyBookingStatus {
    return value as $Enums.JourneyBookingStatus;
  }

  /**
   * Converts the domain payment status into the Prisma generated enum.
   */
  private toPrismaJourneyBookingPaymentStatus(
    value: string,
  ): $Enums.JourneyBookingPaymentStatus {
    return value as $Enums.JourneyBookingPaymentStatus;
  }

  /**
   * Converts the domain cancellation reason into the Prisma generated enum.
   */
  private toPrismaJourneyBookingCancellationReason(
    value: string,
  ): $Enums.JourneyBookingCancellationReason {
    return value as $Enums.JourneyBookingCancellationReason;
  }

  // ===========================================================================
  // Include Graph
  // ===========================================================================

  /**
   * Complete aggregate reconstruction graph.
   *
   * JourneyBooking is the aggregate root. Its snapshot, pricing, payment,
   * and cancellation records are aggregate-owned components.
   */
  private readonly include = {
    snapshot: true,
    pricing: true,
    payment: true,
    cancellation: true,
  } satisfies Prisma.JourneyBookingInclude;

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  public async save(aggregate: JourneyBookingAggregate): Promise<void> {
    const persistence = JourneyBookingPrismaMapper.toPersistence(aggregate);

    await this.prisma.$transaction(async (tx) => {
      const journeyBookingId = persistence.journeyBooking.id;

      // -----------------------------------------------------------------------
      // Journey Booking
      // -----------------------------------------------------------------------

      await tx.journeyBooking.upsert({
        where: {
          id: journeyBookingId,
        },

        // ---------------------------------------------------------------------
        // Create
        // ---------------------------------------------------------------------

        create: {
          id: persistence.journeyBooking.id,
          publicId: persistence.journeyBooking.publicId,
          journeyPublicId: persistence.journeyBooking.journeyPublicId,
          passengerPublicId: persistence.journeyBooking.passengerPublicId,

          status: this.toPrismaJourneyBookingStatus(
            persistence.journeyBooking.status,
          ),

          seats: persistence.journeyBooking.seats,
          confirmedAt: persistence.journeyBooking.confirmedAt,
          cancelledAt: persistence.journeyBooking.cancelledAt,
          completedAt: persistence.journeyBooking.completedAt,
          expiredAt: persistence.journeyBooking.expiredAt,
          version: persistence.journeyBooking.version,
          createdAt: persistence.journeyBooking.createdAt,
          updatedAt: persistence.journeyBooking.updatedAt,
        },

        // ---------------------------------------------------------------------
        // Update
        // ---------------------------------------------------------------------

        update: {
          publicId: persistence.journeyBooking.publicId,
          journeyPublicId: persistence.journeyBooking.journeyPublicId,
          passengerPublicId: persistence.journeyBooking.passengerPublicId,

          status: this.toPrismaJourneyBookingStatus(
            persistence.journeyBooking.status,
          ),

          seats: persistence.journeyBooking.seats,
          confirmedAt: persistence.journeyBooking.confirmedAt,
          cancelledAt: persistence.journeyBooking.cancelledAt,
          completedAt: persistence.journeyBooking.completedAt,
          expiredAt: persistence.journeyBooking.expiredAt,
          version: persistence.journeyBooking.version,
          updatedAt: persistence.journeyBooking.updatedAt,
        },
      });

      // -----------------------------------------------------------------------
      // Snapshot
      // -----------------------------------------------------------------------

      if (persistence.snapshot !== undefined) {
        const snapshot = persistence.snapshot;

        await tx.journeyBookingSnapshot.upsert({
          where: {
            id: snapshot.id,
          },

          // -------------------------------------------------------------------
          // Create
          // -------------------------------------------------------------------

          create: {
            id: snapshot.id,
            publicId: snapshot.publicId,
            bookingId: snapshot.bookingId,
            originName: snapshot.originName,
            originLatitude: snapshot.originLatitude,
            originLongitude: snapshot.originLongitude,
            destinationName: snapshot.destinationName,
            destinationLatitude: snapshot.destinationLatitude,
            destinationLongitude: snapshot.destinationLongitude,
            departureAt: snapshot.departureAt,
            arrivalAt: snapshot.arrivalAt,
            timezone: snapshot.timezone,
            vehicleMake: snapshot.vehicleMake,
            vehicleModel: snapshot.vehicleModel,
            vehicleYear: snapshot.vehicleYear,
            vehicleColor: snapshot.vehicleColor,
            vehicleRegistration: snapshot.vehicleRegistration,
            createdAt: snapshot.createdAt,
            updatedAt: snapshot.updatedAt,
          },

          // -------------------------------------------------------------------
          // Update
          // -------------------------------------------------------------------

          update: {
            publicId: snapshot.publicId,
            bookingId: snapshot.bookingId,
            originName: snapshot.originName,
            originLatitude: snapshot.originLatitude,
            originLongitude: snapshot.originLongitude,
            destinationName: snapshot.destinationName,
            destinationLatitude: snapshot.destinationLatitude,
            destinationLongitude: snapshot.destinationLongitude,
            departureAt: snapshot.departureAt,
            arrivalAt: snapshot.arrivalAt,
            timezone: snapshot.timezone,
            vehicleMake: snapshot.vehicleMake,
            vehicleModel: snapshot.vehicleModel,
            vehicleYear: snapshot.vehicleYear,
            vehicleColor: snapshot.vehicleColor,
            vehicleRegistration: snapshot.vehicleRegistration,
            updatedAt: snapshot.updatedAt,
          },
        });
      } else {
        // ---------------------------------------------------------------------
        // No Snapshot
        // ---------------------------------------------------------------------

        await tx.journeyBookingSnapshot.deleteMany({
          where: {
            bookingId: journeyBookingId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Pricing
      // -----------------------------------------------------------------------

      if (persistence.pricing !== undefined) {
        const pricing = persistence.pricing;

        await tx.journeyBookingPricing.upsert({
          where: {
            id: pricing.id,
          },

          // -------------------------------------------------------------------
          // Create
          // -------------------------------------------------------------------

          create: {
            id: pricing.id,
            publicId: pricing.publicId,
            bookingId: pricing.bookingId,
            pricePerSeat: pricing.pricePerSeat,
            seats: pricing.seats,
            subtotal: pricing.subtotal,
            discountAmount: pricing.discountAmount,
            adjustmentAmount: pricing.adjustmentAmount,
            totalAmount: pricing.totalAmount,
            currency: pricing.currency,
            createdAt: pricing.createdAt,
            updatedAt: pricing.updatedAt,
          },

          // -------------------------------------------------------------------
          // Update
          // -------------------------------------------------------------------

          update: {
            publicId: pricing.publicId,
            bookingId: pricing.bookingId,
            pricePerSeat: pricing.pricePerSeat,
            seats: pricing.seats,
            subtotal: pricing.subtotal,
            discountAmount: pricing.discountAmount,
            adjustmentAmount: pricing.adjustmentAmount,
            totalAmount: pricing.totalAmount,
            currency: pricing.currency,
            updatedAt: pricing.updatedAt,
          },
        });
      } else {
        // ---------------------------------------------------------------------
        // No Pricing
        // ---------------------------------------------------------------------

        await tx.journeyBookingPricing.deleteMany({
          where: {
            bookingId: journeyBookingId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Payment
      // -----------------------------------------------------------------------

      if (persistence.payment !== undefined) {
        const payment = persistence.payment;

        await tx.journeyBookingPayment.upsert({
          where: {
            id: payment.id,
          },

          // -------------------------------------------------------------------
          // Create
          // -------------------------------------------------------------------

          create: {
            id: payment.id,
            publicId: payment.publicId,
            bookingId: payment.bookingId,

            status: this.toPrismaJourneyBookingPaymentStatus(payment.status),

            amount: payment.amount,
            currency: payment.currency,
            transactionPublicId: payment.transactionPublicId,
            authorizedAt: payment.authorizedAt,
            capturedAt: payment.capturedAt,
            failedAt: payment.failedAt,
            refundedAt: payment.refundedAt,
            failureReason: payment.failureReason,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
          },

          // -------------------------------------------------------------------
          // Update
          // -------------------------------------------------------------------

          update: {
            publicId: payment.publicId,
            bookingId: payment.bookingId,

            status: this.toPrismaJourneyBookingPaymentStatus(payment.status),

            amount: payment.amount,
            currency: payment.currency,
            transactionPublicId: payment.transactionPublicId,
            authorizedAt: payment.authorizedAt,
            capturedAt: payment.capturedAt,
            failedAt: payment.failedAt,
            refundedAt: payment.refundedAt,
            failureReason: payment.failureReason,
            updatedAt: payment.updatedAt,
          },
        });
      } else {
        // ---------------------------------------------------------------------
        // No Payment
        // ---------------------------------------------------------------------

        await tx.journeyBookingPayment.deleteMany({
          where: {
            bookingId: journeyBookingId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Cancellation
      // -----------------------------------------------------------------------

      if (persistence.cancellation !== undefined) {
        const cancellation = persistence.cancellation;

        await tx.journeyBookingCancellation.upsert({
          where: {
            id: cancellation.id,
          },

          // -------------------------------------------------------------------
          // Create
          // -------------------------------------------------------------------

          create: {
            id: cancellation.id,
            publicId: cancellation.publicId,
            bookingId: cancellation.bookingId,

            reason: this.toPrismaJourneyBookingCancellationReason(
              cancellation.reason,
            ),

            cancelledByPublicId: cancellation.cancelledByPublicId,
            reasonDescription: cancellation.reasonDescription,
            cancelledAt: cancellation.cancelledAt,
            createdAt: cancellation.createdAt,
            updatedAt: cancellation.updatedAt,
          },

          // -------------------------------------------------------------------
          // Update
          // -------------------------------------------------------------------

          update: {
            publicId: cancellation.publicId,
            bookingId: cancellation.bookingId,

            reason: this.toPrismaJourneyBookingCancellationReason(
              cancellation.reason,
            ),

            cancelledByPublicId: cancellation.cancelledByPublicId,
            reasonDescription: cancellation.reasonDescription,
            cancelledAt: cancellation.cancelledAt,
            updatedAt: cancellation.updatedAt,
          },
        });
      } else {
        // ---------------------------------------------------------------------
        // No Cancellation
        // ---------------------------------------------------------------------

        await tx.journeyBookingCancellation.deleteMany({
          where: {
            bookingId: journeyBookingId,
          },
        });
      }
    });
  }

  // ===========================================================================
  // Aggregate Lookup
  // ===========================================================================

  public async findById(
    id: JourneyBookingId,
  ): Promise<JourneyBookingAggregate | null> {
    const record = await this.prisma.journeyBooking.findUnique({
      where: {
        id: id.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByPublicId(
    publicId: JourneyBookingPublicId,
  ): Promise<JourneyBookingAggregate | null> {
    const record = await this.prisma.journeyBooking.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByJourneyPublicId(
    journeyPublicId: JourneyBookingJourneyPublicId,
  ): Promise<JourneyBookingAggregate[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByPassengerPublicId(
    passengerPublicId: JourneyBookingPassengerPublicId,
  ): Promise<JourneyBookingAggregate[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        passengerPublicId: passengerPublicId.value,
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByStatus(
    status: JourneyBookingStatus,
  ): Promise<JourneyBookingAggregate[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        status: this.toPrismaJourneyBookingStatus(status.value),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByJourneyAndStatus(
    journeyPublicId: JourneyBookingJourneyPublicId,
    status: JourneyBookingStatus,
  ): Promise<JourneyBookingAggregate[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,

        status: this.toPrismaJourneyBookingStatus(status.value),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByPassengerAndStatus(
    passengerPublicId: JourneyBookingPassengerPublicId,
    status: JourneyBookingStatus,
  ): Promise<JourneyBookingAggregate[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        passengerPublicId: passengerPublicId.value,

        status: this.toPrismaJourneyBookingStatus(status.value),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Delete / Exists
  // ===========================================================================

  public async delete(id: JourneyBookingId): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const journeyBookingId = id.value;

      // -----------------------------------------------------------------------
      // Components
      // -----------------------------------------------------------------------

      await tx.journeyBookingSnapshot.deleteMany({
        where: {
          bookingId: journeyBookingId,
        },
      });

      await tx.journeyBookingPricing.deleteMany({
        where: {
          bookingId: journeyBookingId,
        },
      });

      await tx.journeyBookingPayment.deleteMany({
        where: {
          bookingId: journeyBookingId,
        },
      });

      await tx.journeyBookingCancellation.deleteMany({
        where: {
          bookingId: journeyBookingId,
        },
      });

      // -----------------------------------------------------------------------
      // Root
      // -----------------------------------------------------------------------

      await tx.journeyBooking.delete({
        where: {
          id: journeyBookingId,
        },
      });
    });
  }

  public async exists(id: JourneyBookingId): Promise<boolean> {
    const count = await this.prisma.journeyBooking.count({
      where: {
        id: id.value,
      },
    });

    return count > 0;
  }

  public async existsByPublicId(
    publicId: JourneyBookingPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyBooking.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }

  public async existsByJourneyPublicId(
    journeyPublicId: JourneyBookingJourneyPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyBooking.count({
      where: {
        journeyPublicId: journeyPublicId.value,
      },
    });

    return count > 0;
  }

  public async existsByPassengerPublicId(
    passengerPublicId: JourneyBookingPassengerPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyBooking.count({
      where: {
        passengerPublicId: passengerPublicId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Root Entity Queries
  // ===========================================================================

  public async findJourneyBookingById(
    id: JourneyBookingId,
  ): Promise<JourneyBookingEntity | null> {
    const record = await this.prisma.journeyBooking.findUnique({
      where: {
        id: id.value,
      },
    });

    return record === null
      ? null
      : JourneyBookingPrismaMapper.toDomain(record).journeyBooking;
  }

  public async findJourneyBookingByPublicId(
    publicId: JourneyBookingPublicId,
  ): Promise<JourneyBookingEntity | null> {
    const record = await this.prisma.journeyBooking.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : JourneyBookingPrismaMapper.toDomain(record).journeyBooking;
  }

  public async findJourneyBookings(): Promise<JourneyBookingEntity[]> {
    const records = await this.prisma.journeyBooking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(
      (record) => JourneyBookingPrismaMapper.toDomain(record).journeyBooking,
    );
  }

  public async findJourneyBookingsByJourneyPublicId(
    journeyPublicId: JourneyBookingJourneyPublicId,
  ): Promise<JourneyBookingEntity[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(
      (record) => JourneyBookingPrismaMapper.toDomain(record).journeyBooking,
    );
  }

  public async findJourneyBookingsByPassengerPublicId(
    passengerPublicId: JourneyBookingPassengerPublicId,
  ): Promise<JourneyBookingEntity[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        passengerPublicId: passengerPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(
      (record) => JourneyBookingPrismaMapper.toDomain(record).journeyBooking,
    );
  }

  public async findJourneyBookingsByStatus(
    status: JourneyBookingStatus,
  ): Promise<JourneyBookingEntity[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        status: this.toPrismaJourneyBookingStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(
      (record) => JourneyBookingPrismaMapper.toDomain(record).journeyBooking,
    );
  }

  public async findJourneyBookingsByJourneyAndStatus(
    journeyPublicId: JourneyBookingJourneyPublicId,
    status: JourneyBookingStatus,
  ): Promise<JourneyBookingEntity[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,

        status: this.toPrismaJourneyBookingStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(
      (record) => JourneyBookingPrismaMapper.toDomain(record).journeyBooking,
    );
  }

  public async findJourneyBookingsByPassengerAndStatus(
    passengerPublicId: JourneyBookingPassengerPublicId,
    status: JourneyBookingStatus,
  ): Promise<JourneyBookingEntity[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        passengerPublicId: passengerPublicId.value,

        status: this.toPrismaJourneyBookingStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(
      (record) => JourneyBookingPrismaMapper.toDomain(record).journeyBooking,
    );
  }

  // ===========================================================================
  // Journey + Passenger Queries
  // ===========================================================================

  public async findJourneyBookingsByJourneyAndPassenger(
    journeyPublicId: JourneyBookingJourneyPublicId,
    passengerPublicId: JourneyBookingPassengerPublicId,
  ): Promise<JourneyBookingEntity[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,
        passengerPublicId: passengerPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(
      (record) => JourneyBookingPrismaMapper.toDomain(record).journeyBooking,
    );
  }

  public async existsActiveBookingByJourneyAndPassenger(
    journeyPublicId: JourneyBookingJourneyPublicId,
    passengerPublicId: JourneyBookingPassengerPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyBooking.count({
      where: {
        journeyPublicId: journeyPublicId.value,
        passengerPublicId: passengerPublicId.value,

        status: {
          notIn: [
            this.toPrismaJourneyBookingStatus('CANCELLED'),
            this.toPrismaJourneyBookingStatus('COMPLETED'),
            this.toPrismaJourneyBookingStatus('EXPIRED'),
          ],
        },
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Snapshot
  // ===========================================================================

  public async findSnapshot(
    journeyBookingId: JourneyBookingId,
  ): Promise<JourneyBookingSnapshotEntity | null> {
    const record = await this.prisma.journeyBookingSnapshot.findUnique({
      where: {
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.snapshotToDomain(record);
  }

  public async findSnapshotById(
    journeyBookingId: JourneyBookingId,
    snapshotId: JourneyBookingSnapshotPublicId,
  ): Promise<JourneyBookingSnapshotEntity | null> {
    const record = await this.prisma.journeyBookingSnapshot.findFirst({
      where: {
        publicId: snapshotId.value,
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.snapshotToDomain(record);
  }

  public async findSnapshotByPublicId(
    journeyBookingId: JourneyBookingId,
    snapshotPublicId: JourneyBookingSnapshotPublicId,
  ): Promise<JourneyBookingSnapshotEntity | null> {
    const record = await this.prisma.journeyBookingSnapshot.findFirst({
      where: {
        publicId: snapshotPublicId.value,
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.snapshotToDomain(record);
  }

  public async existsSnapshot(
    journeyBookingId: JourneyBookingId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyBookingSnapshot.count({
      where: {
        bookingId: journeyBookingId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  public async findPricing(
    journeyBookingId: JourneyBookingId,
  ): Promise<JourneyBookingPricingEntity | null> {
    const record = await this.prisma.journeyBookingPricing.findUnique({
      where: {
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.pricingToDomain(record);
  }

  public async findPricingById(
    journeyBookingId: JourneyBookingId,
    pricingPublicId: JourneyBookingPricingPublicId,
  ): Promise<JourneyBookingPricingEntity | null> {
    const record = await this.prisma.journeyBookingPricing.findFirst({
      where: {
        publicId: pricingPublicId.value,
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.pricingToDomain(record);
  }

  public async findPricingByPublicId(
    journeyBookingId: JourneyBookingId,
    pricingPublicId: JourneyBookingPricingPublicId,
  ): Promise<JourneyBookingPricingEntity | null> {
    const record = await this.prisma.journeyBookingPricing.findFirst({
      where: {
        publicId: pricingPublicId.value,
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.pricingToDomain(record);
  }

  public async existsPricing(
    journeyBookingId: JourneyBookingId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyBookingPricing.count({
      where: {
        bookingId: journeyBookingId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Payment
  // ===========================================================================

  public async findPayment(
    journeyBookingId: JourneyBookingId,
  ): Promise<JourneyBookingPaymentEntity | null> {
    const record = await this.prisma.journeyBookingPayment.findUnique({
      where: {
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.paymentToDomain(record);
  }

  public async findPaymentById(
    journeyBookingId: JourneyBookingId,
    paymentPublicId: JourneyBookingPaymentPublicId,
  ): Promise<JourneyBookingPaymentEntity | null> {
    const record = await this.prisma.journeyBookingPayment.findFirst({
      where: {
        publicId: paymentPublicId.value,
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.paymentToDomain(record);
  }

  public async findPaymentByPublicId(
    journeyBookingId: JourneyBookingId,
    paymentPublicId: JourneyBookingPaymentPublicId,
  ): Promise<JourneyBookingPaymentEntity | null> {
    const record = await this.prisma.journeyBookingPayment.findFirst({
      where: {
        publicId: paymentPublicId.value,
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.paymentToDomain(record);
  }

  /**
   * Finds Journey Bookings whose payment is in the specified payment status.
   */
  public async findJourneyBookingsByPaymentStatus(
    status: JourneyBookingPaymentStatus,
  ): Promise<JourneyBookingEntity[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        payment: {
          is: {
            status: this.toPrismaJourneyBookingPaymentStatus(status.value),
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(
      (record) => JourneyBookingPrismaMapper.toDomain(record).journeyBooking,
    );
  }

  /**
   * Finds a payment by its financial transaction public ID.
   */
  public async findPaymentByTransactionPublicId(
    transactionPublicId: JourneyBookingTransactionPublicId,
  ): Promise<JourneyBookingPaymentEntity | null> {
    const record = await this.prisma.journeyBookingPayment.findFirst({
      where: {
        transactionPublicId: transactionPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.paymentToDomain(record);
  }

  public async findPaymentsByStatus(
    journeyBookingId: JourneyBookingId,
    status: JourneyBookingPaymentStatus,
  ): Promise<JourneyBookingPaymentEntity[]> {
    const records = await this.prisma.journeyBookingPayment.findMany({
      where: {
        bookingId: journeyBookingId.value,

        status: this.toPrismaJourneyBookingPaymentStatus(status.value),
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyBookingPrismaMapper.paymentToDomain(record),
    );
  }

  public async existsPayment(
    journeyBookingId: JourneyBookingId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyBookingPayment.count({
      where: {
        bookingId: journeyBookingId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  public async findCancellation(
    journeyBookingId: JourneyBookingId,
  ): Promise<JourneyBookingCancellationEntity | null> {
    const record = await this.prisma.journeyBookingCancellation.findUnique({
      where: {
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.cancellationToDomain(record);
  }

  public async findCancellationById(
    journeyBookingId: JourneyBookingId,
    cancellationPublicId: JourneyBookingCancellationPublicId,
  ): Promise<JourneyBookingCancellationEntity | null> {
    const record = await this.prisma.journeyBookingCancellation.findFirst({
      where: {
        publicId: cancellationPublicId.value,
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.cancellationToDomain(record);
  }

  public async findCancellationByPublicId(
    journeyBookingId: JourneyBookingId,
    cancellationPublicId: JourneyBookingCancellationPublicId,
  ): Promise<JourneyBookingCancellationEntity | null> {
    const record = await this.prisma.journeyBookingCancellation.findFirst({
      where: {
        publicId: cancellationPublicId.value,
        bookingId: journeyBookingId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return JourneyBookingPrismaMapper.cancellationToDomain(record);
  }

  /**
   * Finds Journey Bookings cancelled for the specified reason.
   */
  public async findJourneyBookingsByCancellationReason(
    reason: JourneyBookingCancellationReason,
  ): Promise<JourneyBookingEntity[]> {
    const records = await this.prisma.journeyBooking.findMany({
      where: {
        cancellation: {
          is: {
            reason: this.toPrismaJourneyBookingCancellationReason(reason.value),
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(
      (record) => JourneyBookingPrismaMapper.toDomain(record).journeyBooking,
    );
  }

  public async findCancellationsByReason(
    journeyBookingId: JourneyBookingId,
    reason: JourneyBookingCancellationReason,
  ): Promise<JourneyBookingCancellationEntity[]> {
    const records = await this.prisma.journeyBookingCancellation.findMany({
      where: {
        bookingId: journeyBookingId.value,

        reason: this.toPrismaJourneyBookingCancellationReason(reason.value),
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyBookingPrismaMapper.cancellationToDomain(record),
    );
  }

  public async existsCancellation(
    journeyBookingId: JourneyBookingId,
  ): Promise<boolean> {
    const count = await this.prisma.journeyBookingCancellation.count({
      where: {
        bookingId: journeyBookingId.value,
      },
    });

    return count > 0;
  }
  // ---------------------------------------------------------------------------
  // Find By Transaction Public ID
  // ---------------------------------------------------------------------------

  public async findByTransactionPublicId(
    transactionPublicId: JourneyBookingTransactionPublicId,
  ): Promise<JourneyBookingAggregate | null> {
    const record = await this.prisma.journeyBooking.findFirst({
      where: {
        payment: {
          is: {
            transactionPublicId: transactionPublicId.value,
          },
        },
      },

      include: this.include,
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
  }
  // ===========================================================================
  // Aggregate Reconstruction
  // ===========================================================================

  private toAggregate(
    record: JourneyBookingWithComponents,
  ): JourneyBookingAggregate {
    return JourneyBookingPrismaMapper.toDomain(record);
  }
}

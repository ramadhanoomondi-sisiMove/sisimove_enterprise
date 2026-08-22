// -----------------------------------------------------------------------------
// Commercial Booking Commission Prisma Repository
// -----------------------------------------------------------------------------
//
// Prisma persistence implementation for the Commercial Booking Commission
// repository.
//
// -----------------------------------------------------------------------------
// AGGREGATE BOUNDARY
// -----------------------------------------------------------------------------
//
//   CommercialBookingCommissionAggregate
//              │
//              └── CommercialBookingCommissionEntity
//
// The aggregate is the domain lifecycle boundary.
//
// The repository persists and rehydrates that aggregate without introducing
// additional domain behavior.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This repository is responsible for:
//
// - persisting Commercial Booking Commission aggregates;
// - deleting Commercial Booking Commission aggregates;
// - rehydrating aggregates from Prisma persistence;
// - resolving the internal Commercial Commission Rule relation;
// - querying all commissions;
// - querying commissions by public identity;
// - querying commissions by Booking;
// - querying commissions by Journey;
// - querying commissions by Commercial Commission Rule;
// - querying commissions by lifecycle status;
// - querying pending commissions;
// - querying assessed commissions;
// - querying cancelled commissions;
// - supporting entity-level queries;
// - supporting existence checks.
//
// -----------------------------------------------------------------------------
// CROSS-DOMAIN REFERENCES
// -----------------------------------------------------------------------------
//
// Booking and Journey belong to other bounded contexts.
//
// Therefore:
//
//   bookingPublicId
//   journeyPublicId
//
// remain scalar public identifiers in Prisma.
//
// No Prisma relations are introduced to:
//
//   Booking
//   Journey
//   Identity
//   Wallet
//   Settlement
//
// -----------------------------------------------------------------------------
// INTERNAL COMMERCIAL RELATION
// -----------------------------------------------------------------------------
//
// CommercialCommissionRule belongs to the same Commercial bounded context.
//
// Prisma therefore maintains an internal relation:
//
//   CommercialBookingCommission.commissionRuleId
//                    │
//                    ▼
//   CommercialCommissionRule.id
//
// The domain entity intentionally stores:
//
//   commissionRulePublicId
//
// rather than the internal database identifier.
//
// The repository resolves this relationship using Prisma:
//
//   commissionRule: {
//     connect: {
//       publicId: aggregate.commissionRulePublicId,
//     },
//   }
//
// The mapper does NOT resolve this relationship.
//
// -----------------------------------------------------------------------------
// HISTORICAL SNAPSHOT RULE
// -----------------------------------------------------------------------------
//
// The following persisted values are historical assessment snapshots:
//
//   percentage
//   baseAmount
//   commissionAmount
//   currency
//
// They are authoritative once persisted.
//
// The repository MUST NOT recalculate them from the current commission rule.
//
// -----------------------------------------------------------------------------
// REHYDRATION RULE
// -----------------------------------------------------------------------------
//
// Rehydration:
//
// - restores persisted state;
// - does not execute lifecycle transitions;
// - does not create domain events;
// - does not reassess commissions;
// - does not recalculate monetary values.
//
// -----------------------------------------------------------------------------
// ARCHITECTURAL BOUNDARY
// -----------------------------------------------------------------------------
//
// Mapper:
//
//   Prisma record ↔ Domain entity
//
// Repository:
//
//   persistence coordination + queries + internal relation resolution
//
// Aggregate:
//
//   domain lifecycle + domain events
//
// Entity:
//
//   intrinsic commission state + lifecycle invariants
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionAggregate } from '../../../../domain/aggregates/commercial-booking-commission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionEntity } from '../../../../domain/entities/commercial-booking-commission.entity';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionRepository } from '../../../../domain/repositories/commercial-booking-commission.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionBookingPublicId } from '../../../../domain/value-objects/commercial-booking-commission-booking-public-id.vo';

import { CommercialBookingCommissionJourneyPublicId } from '../../../../domain/value-objects/commercial-booking-commission-journey-public-id.vo';

import { CommercialBookingCommissionPublicId } from '../../../../domain/value-objects/commercial-booking-commission-public-id.vo';

import { CommercialBookingCommissionStatus } from '../../../../domain/value-objects/commercial-booking-commission-status.vo';

import { CommercialCommissionRulePublicId } from '../../../../domain/value-objects/commercial-commission-rule-public-id.vo';

// -----------------------------------------------------------------------------
// Prisma Mapper
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionPrismaMapper } from '../mappers/commercial-booking-commission.prisma-mapper';

// =============================================================================
// Prisma Record
// =============================================================================

/**
 * Prisma persistence record required to rehydrate a Commercial Booking
 * Commission entity.
 *
 * The Commercial Commission Rule relation is included because the domain
 * stores the rule's public identifier rather than its internal Prisma
 * foreign-key identifier.
 */
type CommercialBookingCommissionRecord =
  Prisma.CommercialBookingCommissionGetPayload<{
    include: {
      commissionRule: true;
    };
  }>;

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma implementation of the Commercial Booking Commission repository.
 *
 * The repository coordinates:
 *
 *   Prisma persistence
 *          ↕
 *   CommercialBookingCommissionPrismaMapper
 *          ↕
 *   CommercialBookingCommissionEntity
 *          ↕
 *   CommercialBookingCommissionAggregate
 *
 * The repository contains no Commercial business rules.
 *
 * It is responsible only for persistence coordination and query execution.
 */
@Injectable()
export class CommercialBookingCommissionPrismaRepository implements CommercialBookingCommissionRepository {
  // ===========================================================================
  // Prisma Query Configuration
  // ===========================================================================

  /**
   * Shared Prisma include definition used whenever a complete Commercial
   * Booking Commission entity must be rehydrated.
   *
   * The relation is required because:
   *
   * Prisma stores:
   *
   *   commissionRuleId
   *
   * while the domain stores:
   *
   *   commissionRulePublicId
   */
  private static readonly include = {
    commissionRule: true,
  } satisfies Prisma.CommercialBookingCommissionInclude;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Commercial Booking Commission aggregate.
   *
   * The mapper converts the domain entity into persistence data.
   *
   * The mapper deliberately excludes the internal Prisma
   * `commissionRuleId` foreign key.
   *
   * The repository resolves that internal Commercial Commission Rule
   * relationship using the rule's public identifier.
   *
   * No commercial assessment is recalculated during persistence.
   */
  public async save(
    aggregate: CommercialBookingCommissionAggregate,
  ): Promise<void> {
    const persistence = CommercialBookingCommissionPrismaMapper.toPersistence(
      aggregate.bookingCommission,
    );

    await this.prisma.commercialBookingCommission.upsert({
      // -----------------------------------------------------------------------
      // Aggregate Identity
      // -----------------------------------------------------------------------

      where: {
        publicId: aggregate.publicId.value,
      },

      // -----------------------------------------------------------------------
      // Create
      // -----------------------------------------------------------------------

      create: {
        ...persistence,

        // ---------------------------------------------------------------------
        // Internal Commercial Relation
        // ---------------------------------------------------------------------

        commissionRule: {
          connect: {
            publicId: aggregate.commissionRulePublicId,
          },
        },
      },

      // -----------------------------------------------------------------------
      // Update
      // -----------------------------------------------------------------------

      update: {
        ...persistence,

        // ---------------------------------------------------------------------
        // Internal Commercial Relation
        // ---------------------------------------------------------------------

        commissionRule: {
          connect: {
            publicId: aggregate.commissionRulePublicId,
          },
        },
      },
    });
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Deletes a Commercial Booking Commission aggregate by public identity.
   *
   * Deletion is a persistence concern.
   *
   * No domain lifecycle transition is executed.
   */
  public async delete(
    aggregate: CommercialBookingCommissionAggregate,
  ): Promise<void> {
    await this.prisma.commercialBookingCommission.delete({
      where: {
        publicId: aggregate.publicId.value,
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds all Commercial Booking Commission aggregates.
   *
   * This is a complete aggregate query and therefore rehydrates every
   * returned record through the Prisma mapper.
   *
   * Results are deterministic and ordered by creation time descending so
   * that the newest commission records are returned first.
   */
  public async findAll(): Promise<CommercialBookingCommissionAggregate[]> {
    const records = await this.prisma.commercialBookingCommission.findMany({
      include: CommercialBookingCommissionPrismaRepository.include,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds a Commercial Booking Commission aggregate by public identity.
   *
   * Returns null when no commission exists.
   */
  public async findByPublicId(
    publicId: CommercialBookingCommissionPublicId,
  ): Promise<CommercialBookingCommissionAggregate | null> {
    const record = await this.prisma.commercialBookingCommission.findUnique({
      where: {
        publicId: publicId.value,
      },
      include: CommercialBookingCommissionPrismaRepository.include,
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
  }

  // ===========================================================================
  // Booking Query
  // ===========================================================================

  /**
   * Finds the Commercial Booking Commission associated with a Booking.
   *
   * The Booking public identifier is unique in the Commercial persistence
   * model because a Booking may have at most one Commercial Booking
   * Commission.
   */
  public async findByBookingPublicId(
    bookingPublicId: CommercialBookingCommissionBookingPublicId,
  ): Promise<CommercialBookingCommissionAggregate | null> {
    const record = await this.prisma.commercialBookingCommission.findUnique({
      where: {
        bookingPublicId: bookingPublicId.value,
      },
      include: CommercialBookingCommissionPrismaRepository.include,
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
  }

  // ===========================================================================
  // Journey Query
  // ===========================================================================

  /**
   * Finds all Commercial Booking Commission aggregates associated with a
   * Journey.
   *
   * A Journey may have multiple Bookings and therefore multiple Booking
   * Commission records.
   */
  public async findByJourneyPublicId(
    journeyPublicId: CommercialBookingCommissionJourneyPublicId,
  ): Promise<CommercialBookingCommissionAggregate[]> {
    const records = await this.prisma.commercialBookingCommission.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,
      },
      include: CommercialBookingCommissionPrismaRepository.include,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Commission Rule Query
  // ===========================================================================

  /**
   * Finds all Commercial Booking Commission aggregates associated with a
   * Commercial Commission Rule.
   *
   * The rule is an internal Commercial-domain relationship and is therefore
   * queried through the Prisma relation.
   */
  public async findByCommissionRulePublicId(
    commissionRulePublicId: CommercialCommissionRulePublicId,
  ): Promise<CommercialBookingCommissionAggregate[]> {
    const records = await this.prisma.commercialBookingCommission.findMany({
      where: {
        commissionRule: {
          publicId: commissionRulePublicId.value,
        },
      },
      include: CommercialBookingCommissionPrismaRepository.include,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Status Query
  // ===========================================================================

  /**
   * Finds all Commercial Booking Commission aggregates with the specified
   * lifecycle status.
   */
  public async findByStatus(
    status: CommercialBookingCommissionStatus,
  ): Promise<CommercialBookingCommissionAggregate[]> {
    const records = await this.prisma.commercialBookingCommission.findMany({
      where: {
        status: status.value,
      },
      include: CommercialBookingCommissionPrismaRepository.include,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Pending Query
  // ===========================================================================

  /**
   * Finds all pending Commercial Booking Commission aggregates.
   */
  public async findPending(): Promise<CommercialBookingCommissionAggregate[]> {
    return this.findByStatus(CommercialBookingCommissionStatus.pending());
  }

  // ===========================================================================
  // Assessed Query
  // ===========================================================================

  /**
   * Finds all assessed Commercial Booking Commission aggregates.
   */
  public async findAssessed(): Promise<CommercialBookingCommissionAggregate[]> {
    return this.findByStatus(CommercialBookingCommissionStatus.assessed());
  }

  // ===========================================================================
  // Cancelled Query
  // ===========================================================================

  /**
   * Finds all cancelled Commercial Booking Commission aggregates.
   */
  public async findCancelled(): Promise<
    CommercialBookingCommissionAggregate[]
  > {
    return this.findByStatus(CommercialBookingCommissionStatus.cancelled());
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds a Commercial Booking Commission entity by public identity.
   *
   * This method intentionally returns the entity directly because the
   * repository contract explicitly exposes entity-level queries.
   */
  public async findEntityByPublicId(
    publicId: CommercialBookingCommissionPublicId,
  ): Promise<CommercialBookingCommissionEntity | null> {
    const record = await this.prisma.commercialBookingCommission.findUnique({
      where: {
        publicId: publicId.value,
      },
      include: CommercialBookingCommissionPrismaRepository.include,
    });

    if (record === null) {
      return null;
    }

    return CommercialBookingCommissionPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Booking Entity Query
  // ===========================================================================

  /**
   * Finds the Commercial Booking Commission entity associated with a Booking.
   */
  public async findEntityByBookingPublicId(
    bookingPublicId: CommercialBookingCommissionBookingPublicId,
  ): Promise<CommercialBookingCommissionEntity | null> {
    const record = await this.prisma.commercialBookingCommission.findUnique({
      where: {
        bookingPublicId: bookingPublicId.value,
      },
      include: CommercialBookingCommissionPrismaRepository.include,
    });

    if (record === null) {
      return null;
    }

    return CommercialBookingCommissionPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Journey Entity Query
  // ===========================================================================

  /**
   * Finds all Commercial Booking Commission entities associated with a
   * Journey.
   */
  public async findEntitiesByJourneyPublicId(
    journeyPublicId: CommercialBookingCommissionJourneyPublicId,
  ): Promise<CommercialBookingCommissionEntity[]> {
    const records = await this.prisma.commercialBookingCommission.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,
      },
      include: CommercialBookingCommissionPrismaRepository.include,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      CommercialBookingCommissionPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Determines whether a Commercial Booking Commission exists for a public
   * identity.
   *
   * Only the persistence identity is selected because complete entity
   * rehydration is unnecessary.
   */
  public async existsByPublicId(
    publicId: CommercialBookingCommissionPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.commercialBookingCommission.findUnique({
      where: {
        publicId: publicId.value,
      },
      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Booking Existence
  // ===========================================================================

  /**
   * Determines whether a Commercial Booking Commission already exists for a
   * Booking.
   *
   * The Booking public identifier is unique in the Commercial persistence
   * model.
   */
  public async existsByBookingPublicId(
    bookingPublicId: CommercialBookingCommissionBookingPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.commercialBookingCommission.findUnique({
      where: {
        bookingPublicId: bookingPublicId.value,
      },
      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Journey Existence
  // ===========================================================================

  /**
   * Determines whether at least one Commercial Booking Commission exists for
   * a Journey.
   *
   * Journey public identity is intentionally non-unique because a Journey may
   * have multiple Booking Commission records.
   */
  public async existsByJourneyPublicId(
    journeyPublicId: CommercialBookingCommissionJourneyPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.commercialBookingCommission.findFirst({
      where: {
        journeyPublicId: journeyPublicId.value,
      },
      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Mapping
  // ===========================================================================

  /**
   * Converts a Prisma record into a Commercial Booking Commission aggregate.
   *
   * All domain reconstruction is delegated to the Prisma mapper.
   *
   * This method intentionally performs:
   *
   * - no value-object construction;
   * - no lifecycle transitions;
   * - no domain calculations;
   * - no domain event creation.
   */
  private toAggregate(
    record: CommercialBookingCommissionRecord,
  ): CommercialBookingCommissionAggregate {
    return CommercialBookingCommissionAggregate.rehydrate(
      CommercialBookingCommissionPrismaMapper.toDomain(record),
    );
  }
}

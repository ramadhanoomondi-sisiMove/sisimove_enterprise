// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Infrastructure / Persistence / Prisma
//
// Commercial Earning Commission Prisma Repository
//
// This repository implements the domain repository contract while keeping
// Prisma-specific persistence concerns entirely inside infrastructure.
//
// -----------------------------------------------------------------------------
// AGGREGATE BOUNDARY
// -----------------------------------------------------------------------------
//
//   CommercialEarningCommissionAggregate
//              │
//              └── CommercialEarningCommissionEntity
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
// - persisting Commercial Earning Commission aggregates;
// - deleting Commercial Earning Commission aggregates;
// - rehydrating Commercial Earning Commission aggregates;
// - resolving commissions by public identity;
// - resolving commissions by Settlement;
// - resolving commissions by Journey;
// - resolving commissions by Provider;
// - resolving commissions by Commercial Commission Rule;
// - resolving commissions by lifecycle status;
// - resolving pending commissions;
// - resolving assessed commissions;
// - resolving cancelled commissions;
// - resolving all commissions;
// - supporting entity-level queries;
// - supporting existence checks.
//
// -----------------------------------------------------------------------------
// BOUNDED-CONTEXT RULES
// -----------------------------------------------------------------------------
//
// External references:
//
//   Journey.publicId
//   JourneySettlement.publicId
//   Identity.publicId
//
// are stored as scalar public identifiers.
//
// CommercialCommissionRule belongs to the same Commercial bounded context,
// therefore Prisma maintains an internal relation:
//
//   CommercialEarningCommission.commissionRuleId
//                         │
//                         ▼
//   CommercialCommissionRule.id
//
// The domain, however, works with:
//
//   CommercialCommissionRule.publicId
//
// The repository translates between these two representations.
//
// -----------------------------------------------------------------------------
// CROSS-DOMAIN REFERENCES
// -----------------------------------------------------------------------------
//
// The following references intentionally remain scalar:
//
//   journeyPublicId
//   settlementPublicId
//   providerPublicId
//
// No Prisma relations are introduced to:
//
//   Journey
//   JourneySettlement
//   Identity
//   Wallet
//   Treasury
//   Accounting
//
// This preserves bounded-context ownership.
//
// -----------------------------------------------------------------------------
// INTERNAL COMMERCIAL RELATION
// -----------------------------------------------------------------------------
//
// CommercialCommissionRule is part of the same Commercial bounded context.
//
// Prisma therefore maintains:
//
//   CommercialEarningCommission.commissionRuleId
//                    │
//                    ▼
//   CommercialCommissionRule.id
//
// The domain stores:
//
//   commissionRulePublicId
//
// The repository resolves the public identifier to the internal Prisma
// foreign-key identifier during persistence.
//
// During rehydration, the repository resolves the internal relation back to
// the rule's public identifier.
//
// -----------------------------------------------------------------------------
// HISTORICAL ASSESSMENT SNAPSHOT
// -----------------------------------------------------------------------------
//
// The following values are persisted assessment snapshots:
//
//   percentage
//   baseAmount
//   commissionAmount
//   netAmount
//   currency
//
// These values are authoritative once the commission has been created.
//
// The repository MUST NOT recalculate them from the current Commercial
// Commission Rule.
//
// Rehydration restores the persisted snapshot exactly.
//
// -----------------------------------------------------------------------------
// REHYDRATION RULE
// -----------------------------------------------------------------------------
//
// Rehydration:
//
// - restores persisted state;
// - preserves internal entity identity;
// - preserves public entity identity;
// - restores the Commercial Commission Rule public identity;
// - does not execute lifecycle transitions;
// - does not create domain events;
// - does not reassess commissions;
// - does not recalculate monetary values;
// - does not apply current commercial policy.
//
// The repository contains no commercial business rules.
//
// -----------------------------------------------------------------------------
// MAPPING BOUNDARY
// -----------------------------------------------------------------------------
//
// Prisma:
//
//   CommercialEarningCommission
//
//        ↕
//
// Repository:
//
//   Prisma persistence coordination
//   Prisma relation resolution
//
//        ↕
//
// Domain:
//
//   CommercialEarningCommissionEntity
//   CommercialEarningCommissionAggregate
//
// The repository owns persistence coordination.
//
// Domain reconstruction remains explicit and deterministic.
//
// =============================================================================

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
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionAggregate } from '../../../../domain/aggregates/commercial-earning-commission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionEntity } from '../../../../domain/entities/commercial-earning-commission.entity';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { CommercialEarningCommissionRepository } from '../../../../domain/repositories/commercial-earning-commission.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { CommercialCommissionRulePublicId } from '../../../../domain/value-objects/commercial-commission-rule-public-id.vo';

import { CommercialEarningCommissionAmount } from '../../../../domain/value-objects/commercial-earning-commission-amount.vo';

import { CommercialEarningCommissionBaseAmount } from '../../../../domain/value-objects/commercial-earning-commission-base-amount.vo';

import { CommercialEarningCommissionCurrency } from '../../../../domain/value-objects/commercial-earning-commission-currency.vo';

import { CommercialEarningCommissionJourneyPublicId } from '../../../../domain/value-objects/commercial-earning-commission-journey-public-id.vo';

import { CommercialEarningCommissionNetAmount } from '../../../../domain/value-objects/commercial-earning-commission-net-amount.vo';

import { CommercialEarningCommissionPercentage } from '../../../../domain/value-objects/commercial-earning-commission-percentage.vo';

import { CommercialEarningCommissionProviderPublicId } from '../../../../domain/value-objects/commercial-earning-commission-provider-public-id.vo';

import { CommercialEarningCommissionPublicId } from '../../../../domain/value-objects/commercial-earning-commission-public-id.vo';

import { CommercialEarningCommissionSettlementPublicId } from '../../../../domain/value-objects/commercial-earning-commission-settlement-public-id.vo';

import { CommercialEarningCommissionStatus } from '../../../../domain/value-objects/commercial-earning-commission-status.vo';

// =============================================================================
// Prisma Record
// =============================================================================

/**
 * Prisma persistence record required to rehydrate a Commercial Earning
 * Commission entity.
 *
 * The Commercial Commission Rule relation is included because the domain
 * stores the rule's public identifier rather than its internal Prisma
 * foreign-key identifier.
 */
type CommercialEarningCommissionRecord =
  Prisma.CommercialEarningCommissionGetPayload<{
    include: {
      commissionRule: true;
    };
  }>;

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma implementation of the Commercial Earning Commission repository.
 *
 * The repository coordinates:
 *
 *   Prisma persistence
 *          ↕
 *   CommercialEarningCommissionEntity
 *          ↕
 *   CommercialEarningCommissionAggregate
 *
 * The repository contains no Commercial business rules.
 *
 * It is responsible only for:
 *
 * - persistence;
 * - deletion;
 * - querying;
 * - existence checks;
 * - Prisma relation resolution;
 * - domain rehydration.
 */
@Injectable()
export class CommercialEarningCommissionPrismaRepository implements CommercialEarningCommissionRepository {
  // ===========================================================================
  // Prisma Query Configuration
  // ===========================================================================

  /**
   * Shared Prisma include definition used whenever a complete Commercial
   * Earning Commission entity must be rehydrated.
   *
   * The relation is required because Prisma stores:
   *
   *   commissionRuleId
   *
   * while the domain stores:
   *
   *   commissionRulePublicId
   */
  private static readonly include = {
    commissionRule: true,
  } satisfies Prisma.CommercialEarningCommissionInclude;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Commercial Earning Commission aggregate.
   *
   * The aggregate exposes the Commercial Commission Rule through its public
   * identifier.
   *
   * Prisma requires the internal Commercial Commission Rule database ID.
   *
   * The repository therefore resolves:
   *
   *   CommercialCommissionRule.publicId
   *                ↓
   *   CommercialCommissionRule.id
   *
   * before persistence.
   *
   * Historical commission assessment values are persisted exactly as supplied
   * by the aggregate.
   *
   * No commission is recalculated.
   */
  public async save(
    aggregate: CommercialEarningCommissionAggregate,
  ): Promise<void> {
    const commissionRule =
      await this.prisma.commercialCommissionRule.findUnique({
        where: {
          publicId: aggregate.commissionRulePublicId,
        },
        select: {
          id: true,
        },
      });

    if (commissionRule === null) {
      throw new Error(
        `Commercial commission rule not found: ${aggregate.commissionRulePublicId}`,
      );
    }

    await this.prisma.commercialEarningCommission.upsert({
      // -----------------------------------------------------------------------
      // Stable Persistence Identity
      // -----------------------------------------------------------------------

      where: {
        publicId: aggregate.publicId.value,
      },

      // -----------------------------------------------------------------------
      // Create
      // -----------------------------------------------------------------------

      create: {
        id: aggregate.id.value,
        publicId: aggregate.publicId.value,

        // ---------------------------------------------------------------------
        // Cross-domain references
        // ---------------------------------------------------------------------

        journeyPublicId: aggregate.journeyPublicId,
        settlementPublicId: aggregate.settlementPublicId,
        providerPublicId: aggregate.providerPublicId,

        // ---------------------------------------------------------------------
        // Internal Commercial relation
        // ---------------------------------------------------------------------

        commissionRuleId: commissionRule.id,

        // ---------------------------------------------------------------------
        // Historical assessment snapshot
        // ---------------------------------------------------------------------

        percentage: aggregate.percentage,
        baseAmount: aggregate.baseAmount,
        commissionAmount: aggregate.commissionAmount,
        netAmount: aggregate.netAmount,
        currency: aggregate.currency,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: aggregate.status.value,
        assessedAt: aggregate.assessedAt ?? null,
        cancelledAt: aggregate.cancelledAt ?? null,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: aggregate.createdAt,
        updatedAt: aggregate.updatedAt,
      },

      // -----------------------------------------------------------------------
      // Update
      // -----------------------------------------------------------------------

      update: {
        // ---------------------------------------------------------------------
        // Cross-domain references
        // ---------------------------------------------------------------------

        journeyPublicId: aggregate.journeyPublicId,
        settlementPublicId: aggregate.settlementPublicId,
        providerPublicId: aggregate.providerPublicId,

        // ---------------------------------------------------------------------
        // Internal Commercial relation
        // ---------------------------------------------------------------------

        commissionRuleId: commissionRule.id,

        // ---------------------------------------------------------------------
        // Historical assessment snapshot
        // ---------------------------------------------------------------------

        percentage: aggregate.percentage,
        baseAmount: aggregate.baseAmount,
        commissionAmount: aggregate.commissionAmount,
        netAmount: aggregate.netAmount,
        currency: aggregate.currency,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: aggregate.status.value,
        assessedAt: aggregate.assessedAt ?? null,
        cancelledAt: aggregate.cancelledAt ?? null,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        updatedAt: aggregate.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Deletion
  // ===========================================================================

  /**
   * Deletes a Commercial Earning Commission aggregate by public identity.
   *
   * Deletion is a persistence concern.
   *
   * No domain lifecycle transition is executed.
   */
  public async delete(
    aggregate: CommercialEarningCommissionAggregate,
  ): Promise<void> {
    await this.prisma.commercialEarningCommission.delete({
      where: {
        publicId: aggregate.publicId.value,
      },
    });
  }

  // ===========================================================================
  // Find All
  // ===========================================================================

  /**
   * Finds all Commercial Earning Commission aggregates.
   *
   * Results are returned in deterministic creation order.
   *
   * The newest commissions are returned first.
   *
   * No filtering or pagination is applied because the repository contract
   * intentionally exposes this operation as an unfiltered collection query.
   */
  public async findAll(): Promise<CommercialEarningCommissionAggregate[]> {
    const records = await this.prisma.commercialEarningCommission.findMany({
      include: CommercialEarningCommissionPrismaRepository.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Find By Public ID
  // ===========================================================================

  /**
   * Finds a Commercial Earning Commission aggregate by public identity.
   *
   * Returns null when no matching commission exists.
   */
  public async findByPublicId(
    publicId: CommercialEarningCommissionPublicId,
  ): Promise<CommercialEarningCommissionAggregate | null> {
    const record = await this.prisma.commercialEarningCommission.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: CommercialEarningCommissionPrismaRepository.include,
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
  }

  // ===========================================================================
  // Find By Settlement Public ID
  // ===========================================================================

  /**
   * Finds the Commercial Earning Commission associated with a Settlement.
   *
   * A Settlement may have at most one Commercial Earning Commission.
   *
   * The uniqueness invariant is enforced by the persistence schema.
   */
  public async findBySettlementPublicId(
    settlementPublicId: CommercialEarningCommissionSettlementPublicId,
  ): Promise<CommercialEarningCommissionAggregate | null> {
    const record = await this.prisma.commercialEarningCommission.findUnique({
      where: {
        settlementPublicId: settlementPublicId.value,
      },

      include: CommercialEarningCommissionPrismaRepository.include,
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
  }

  // ===========================================================================
  // Find By Journey Public ID
  // ===========================================================================

  /**
   * Finds all Commercial Earning Commission aggregates associated with a
   * Journey.
   *
   * A Journey may produce multiple settlements and therefore multiple earning
   * commission records.
   *
   * Results are ordered deterministically by creation time.
   */
  public async findByJourneyPublicId(
    journeyPublicId: CommercialEarningCommissionJourneyPublicId,
  ): Promise<CommercialEarningCommissionAggregate[]> {
    const records = await this.prisma.commercialEarningCommission.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,
      },

      include: CommercialEarningCommissionPrismaRepository.include,

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Find By Provider Public ID
  // ===========================================================================

  /**
   * Finds all Commercial Earning Commission aggregates associated with a
   * Provider.
   *
   * providerPublicId is a cross-domain Identity public identifier.
   *
   * Results are ordered deterministically by creation time.
   */
  public async findByProviderPublicId(
    providerPublicId: CommercialEarningCommissionProviderPublicId,
  ): Promise<CommercialEarningCommissionAggregate[]> {
    const records = await this.prisma.commercialEarningCommission.findMany({
      where: {
        providerPublicId: providerPublicId.value,
      },

      include: CommercialEarningCommissionPrismaRepository.include,

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Find By Commission Rule Public ID
  // ===========================================================================

  /**
   * Finds all Commercial Earning Commission aggregates produced from a
   * specific Commercial Commission Rule.
   *
   * The domain identifies the rule through publicId.
   *
   * Prisma resolves that public identifier through its internal relation.
   */
  public async findByCommissionRulePublicId(
    commissionRulePublicId: CommercialCommissionRulePublicId,
  ): Promise<CommercialEarningCommissionAggregate[]> {
    const records = await this.prisma.commercialEarningCommission.findMany({
      where: {
        commissionRule: {
          publicId: commissionRulePublicId.value,
        },
      },

      include: CommercialEarningCommissionPrismaRepository.include,

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Find By Status
  // ===========================================================================

  /**
   * Finds all Commercial Earning Commission aggregates with the supplied
   * lifecycle status.
   */
  public async findByStatus(
    status: CommercialEarningCommissionStatus,
  ): Promise<CommercialEarningCommissionAggregate[]> {
    const records = await this.prisma.commercialEarningCommission.findMany({
      where: {
        status: status.value,
      },

      include: CommercialEarningCommissionPrismaRepository.include,

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Find Pending
  // ===========================================================================

  /**
   * Finds all pending Commercial Earning Commission aggregates.
   */
  public async findPending(): Promise<CommercialEarningCommissionAggregate[]> {
    return this.findByStatus(CommercialEarningCommissionStatus.pending());
  }

  // ===========================================================================
  // Find Assessed
  // ===========================================================================

  /**
   * Finds all assessed Commercial Earning Commission aggregates.
   */
  public async findAssessed(): Promise<CommercialEarningCommissionAggregate[]> {
    return this.findByStatus(CommercialEarningCommissionStatus.assessed());
  }

  // ===========================================================================
  // Find Cancelled
  // ===========================================================================

  /**
   * Finds all cancelled Commercial Earning Commission aggregates.
   */
  public async findCancelled(): Promise<
    CommercialEarningCommissionAggregate[]
  > {
    return this.findByStatus(CommercialEarningCommissionStatus.cancelled());
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  // ===========================================================================
  // Find Entity By Public ID
  // ===========================================================================

  /**
   * Finds a Commercial Earning Commission entity by public identity.
   *
   * The entity is returned directly because the repository contract explicitly
   * exposes entity-level persistence queries.
   */
  public async findEntityByPublicId(
    publicId: CommercialEarningCommissionPublicId,
  ): Promise<CommercialEarningCommissionEntity | null> {
    const record = await this.prisma.commercialEarningCommission.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: CommercialEarningCommissionPrismaRepository.include,
    });

    if (record === null) {
      return null;
    }

    return this.toEntity(record);
  }

  // ===========================================================================
  // Find Entity By Settlement Public ID
  // ===========================================================================

  /**
   * Finds the Commercial Earning Commission entity associated with a
   * Settlement.
   */
  public async findEntityBySettlementPublicId(
    settlementPublicId: CommercialEarningCommissionSettlementPublicId,
  ): Promise<CommercialEarningCommissionEntity | null> {
    const record = await this.prisma.commercialEarningCommission.findUnique({
      where: {
        settlementPublicId: settlementPublicId.value,
      },

      include: CommercialEarningCommissionPrismaRepository.include,
    });

    if (record === null) {
      return null;
    }

    return this.toEntity(record);
  }

  // ===========================================================================
  // Find Entities By Journey Public ID
  // ===========================================================================

  /**
   * Finds all Commercial Earning Commission entities associated with a
   * Journey.
   */
  public async findEntitiesByJourneyPublicId(
    journeyPublicId: CommercialEarningCommissionJourneyPublicId,
  ): Promise<CommercialEarningCommissionEntity[]> {
    const records = await this.prisma.commercialEarningCommission.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,
      },

      include: CommercialEarningCommissionPrismaRepository.include,

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  // ===========================================================================
  // Find Entities By Provider Public ID
  // ===========================================================================

  /**
   * Finds all Commercial Earning Commission entities associated with a
   * Provider.
   */
  public async findEntitiesByProviderPublicId(
    providerPublicId: CommercialEarningCommissionProviderPublicId,
  ): Promise<CommercialEarningCommissionEntity[]> {
    const records = await this.prisma.commercialEarningCommission.findMany({
      where: {
        providerPublicId: providerPublicId.value,
      },

      include: CommercialEarningCommissionPrismaRepository.include,

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  // ===========================================================================
  // Exists By Public ID
  // ===========================================================================

  /**
   * Determines whether a Commercial Earning Commission exists for the
   * supplied public identity.
   *
   * Only the database identity is selected because complete entity
   * reconstruction is unnecessary.
   */
  public async existsByPublicId(
    publicId: CommercialEarningCommissionPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.commercialEarningCommission.findUnique({
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
  // Exists By Settlement Public ID
  // ===========================================================================

  /**
   * Determines whether a Commercial Earning Commission already exists for a
   * Settlement.
   *
   * Settlement public identity is unique because one Settlement may have at
   * most one Commercial Earning Commission.
   */
  public async existsBySettlementPublicId(
    settlementPublicId: CommercialEarningCommissionSettlementPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.commercialEarningCommission.findUnique({
      where: {
        settlementPublicId: settlementPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Journey Public ID
  // ===========================================================================

  /**
   * Determines whether at least one Commercial Earning Commission exists for
   * a Journey.
   *
   * Journey public identity is intentionally non-unique.
   */
  public async existsByJourneyPublicId(
    journeyPublicId: CommercialEarningCommissionJourneyPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.commercialEarningCommission.findFirst({
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
  // Exists By Provider Public ID
  // ===========================================================================

  /**
   * Determines whether at least one Commercial Earning Commission exists for
   * a Provider.
   *
   * Provider public identity is intentionally non-unique.
   */
  public async existsByProviderPublicId(
    providerPublicId: CommercialEarningCommissionProviderPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.commercialEarningCommission.findFirst({
      where: {
        providerPublicId: providerPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Domain Mapping
  // ===========================================================================

  /**
   * Converts a Prisma record into a Commercial Earning Commission aggregate.
   *
   * Rehydration restores persisted state without creating domain events.
   */
  private toAggregate(
    record: CommercialEarningCommissionRecord,
  ): CommercialEarningCommissionAggregate {
    return CommercialEarningCommissionAggregate.rehydrate(
      this.toEntity(record),
    );
  }

  // ===========================================================================
  // Entity Mapping
  // ===========================================================================

  /**
   * Converts a Prisma persistence record into a rehydrated Commercial Earning
   * Commission entity.
   *
   * Prisma stores:
   *
   *   commissionRuleId
   *
   * while the domain stores:
   *
   *   commissionRulePublicId
   *
   * The included Commercial Commission Rule relation is therefore used to
   * translate the internal Prisma relation back into the domain public
   * identifier.
   *
   * All historical assessment values are restored exactly as persisted.
   *
   * No commission calculation is performed during rehydration.
   */
  private toEntity(
    record: CommercialEarningCommissionRecord,
  ): CommercialEarningCommissionEntity {
    return CommercialEarningCommissionEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Commercial Commission Rule
        // ---------------------------------------------------------------------

        commissionRulePublicId: new CommercialCommissionRulePublicId(
          record.commissionRule.publicId,
        ),

        // ---------------------------------------------------------------------
        // Cross-domain references
        // ---------------------------------------------------------------------

        journeyPublicId: new CommercialEarningCommissionJourneyPublicId(
          record.journeyPublicId,
        ),

        settlementPublicId: new CommercialEarningCommissionSettlementPublicId(
          record.settlementPublicId,
        ),

        providerPublicId: new CommercialEarningCommissionProviderPublicId(
          record.providerPublicId,
        ),

        // ---------------------------------------------------------------------
        // Historical assessment snapshot
        // ---------------------------------------------------------------------

        percentage: CommercialEarningCommissionPercentage.create(
          Number(record.percentage.toString()),
        ),

        baseAmount: CommercialEarningCommissionBaseAmount.create(
          record.baseAmount,
        ),

        commissionAmount: CommercialEarningCommissionAmount.create(
          record.commissionAmount,
        ),

        netAmount: CommercialEarningCommissionNetAmount.create(
          record.netAmount,
        ),

        currency: CommercialEarningCommissionCurrency.create(record.currency),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: CommercialEarningCommissionStatus.create(record.status),

        assessedAt:
          record.assessedAt === null
            ? undefined
            : new Date(record.assessedAt.getTime()),

        cancelledAt:
          record.cancelledAt === null
            ? undefined
            : new Date(record.cancelledAt.getTime()),

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      // -----------------------------------------------------------------------
      // Persistence identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),

      new CommercialEarningCommissionPublicId(record.publicId),
    );
  }
}

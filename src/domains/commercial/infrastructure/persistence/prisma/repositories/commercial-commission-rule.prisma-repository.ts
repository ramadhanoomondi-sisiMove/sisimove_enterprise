// -----------------------------------------------------------------------------
// Commercial Commission Rule Prisma Repository
// -----------------------------------------------------------------------------
//
// Prisma persistence implementation for the Commercial Commission Rule
// repository.
//
// -----------------------------------------------------------------------------
// AGGREGATE BOUNDARY
// -----------------------------------------------------------------------------
//
//   CommercialCommissionRuleAggregate
//              │
//              └── CommercialCommissionRuleEntity
//
// The aggregate is the domain lifecycle boundary.
//
// The repository persists and rehydrates the aggregate without introducing
// additional domain behavior.
//
// -----------------------------------------------------------------------------
// RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This repository is responsible for:
//
// - persisting Commercial Commission Rule aggregates;
// - deleting Commercial Commission Rule aggregates;
// - rehydrating Commercial Commission Rule aggregates;
// - resolving all Commercial Commission Rule aggregates;
// - resolving rules by public identity;
// - resolving rules by commission type and version;
// - resolving rules by commission type;
// - resolving the currently effective rule;
// - resolving the effective rule at a supplied timestamp;
// - resolving effective entities;
// - checking rule existence;
// - detecting overlapping effective periods.
//
// -----------------------------------------------------------------------------
// CROSS-RULE EFFECTIVE-PERIOD INTEGRITY
// -----------------------------------------------------------------------------
//
// Effective-period overlap detection requires knowledge of OTHER Commercial
// Commission Rule instances.
//
// Therefore this concern cannot be enforced solely inside:
//
//   CommercialCommissionRuleEntity
//
// or:
//
//   CommercialCommissionRuleAggregate
//
// because either object represents only ONE commission rule.
//
// The repository provides the persistence-level query required by the
// application/domain coordination layer:
//
//   hasOverlappingEffectivePeriod(...)
//
// The repository detects persisted overlap.
//
// It does NOT decide whether the caller should activate, update, reject, or
// otherwise transition a rule.
//
// -----------------------------------------------------------------------------
// CROSS-DOMAIN REFERENCES
// -----------------------------------------------------------------------------
//
// Commercial Commission Rules do not introduce Prisma relations to:
//
//   Booking
//   Journey
//   Identity
//   Wallet
//   Settlement
//   Treasury
//   Accounting
//
// Booking commissions and earning commissions are independent Commercial
// aggregates and are therefore NOT loaded or persisted by this repository.
//
// -----------------------------------------------------------------------------
// MAPPER BOUNDARY
// -----------------------------------------------------------------------------
//
// Mapper:
//
//   Prisma CommercialCommissionRule
//              ↕
//   CommercialCommissionRuleEntity
//
// Repository:
//
//   persistence coordination
//   query execution
//   effective-period lookup
//
// Aggregate:
//
//   lifecycle
//   policy behavior
//   domain events
//
// Entity:
//
//   intrinsic rule state
//   lifecycle invariants
//
// The repository MUST NOT duplicate mapper conversion logic.
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
// - does not execute lifecycle transitions;
// - does not create domain events;
// - does not recalculate commercial policy;
// - does not validate cross-rule overlap.
//
// The mapper owns entity reconstruction.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { CommercialCommissionRule as PrismaCommercialCommissionRule } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleAggregate } from '../../../../domain/aggregates/commercial-commission-rule.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleEntity } from '../../../../domain/entities/commercial-commission-rule.entity';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { CommercialCommissionRuleRepository } from '../../../../domain/repositories/commercial-commission-rule.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { CommercialCommissionRulePublicId } from '../../../../domain/value-objects/commercial-commission-rule-public-id.vo';

import { CommercialCommissionType } from '../../../../domain/value-objects/commercial-commission-type.vo';

// -----------------------------------------------------------------------------
// Prisma Mapper
// -----------------------------------------------------------------------------

import { CommercialCommissionRulePrismaMapper } from '../mappers/commercial-commission-rule.prisma-mapper';

// =============================================================================
// Prisma Record
// =============================================================================

/**
 * Prisma persistence record used to rehydrate a Commercial Commission Rule.
 *
 * The rule has no required Prisma relation for domain reconstruction.
 *
 * The mapper converts this persistence representation into the domain entity.
 */
type CommercialCommissionRuleRecord = PrismaCommercialCommissionRule;

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma implementation of the Commercial Commission Rule repository.
 *
 * The repository coordinates:
 *
 *   Prisma persistence
 *          ↕
 *   CommercialCommissionRulePrismaMapper
 *          ↕
 *   CommercialCommissionRuleEntity
 *          ↕
 *   CommercialCommissionRuleAggregate
 *
 * The repository contains no Commercial Commission Rule business behavior.
 *
 * It is responsible for:
 *
 * - persistence;
 * - querying;
 * - existence checks;
 * - cross-rule effective-period lookup.
 *
 * Domain lifecycle transitions and domain events remain exclusively within the
 * aggregate and entity.
 */
@Injectable()
export class CommercialCommissionRulePrismaRepository implements CommercialCommissionRuleRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Commercial Commission Rule aggregate.
   *
   * The mapper produces the complete persistence representation of the
   * commission rule entity.
   *
   * The aggregate's public identifier is used as the stable upsert key.
   *
   * No commission policy is recalculated during persistence.
   *
   * No lifecycle transition is executed.
   *
   * No domain event is created.
   */
  public async save(
    aggregate: CommercialCommissionRuleAggregate,
  ): Promise<void> {
    const persistence = CommercialCommissionRulePrismaMapper.toPersistence(
      aggregate.commissionRule,
    );

    await this.prisma.commercialCommissionRule.upsert({
      // -----------------------------------------------------------------------
      // Stable Persistence Identity
      // -----------------------------------------------------------------------

      where: {
        publicId: aggregate.publicId.value,
      },

      // -----------------------------------------------------------------------
      // Create
      // -----------------------------------------------------------------------

      create: persistence,

      // -----------------------------------------------------------------------
      // Update
      // -----------------------------------------------------------------------
      //
      // createdAt is immutable after initial persistence.
      //
      // Therefore the update operation intentionally persists only mutable
      // rule state and the audit timestamp.
      // -----------------------------------------------------------------------

      update: {
        type: persistence.type,
        percentage: persistence.percentage,
        status: persistence.status,
        effectiveFrom: persistence.effectiveFrom,
        effectiveTo: persistence.effectiveTo,
        version: persistence.version,
        updatedAt: persistence.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Deletion
  // ===========================================================================

  /**
   * Deletes a Commercial Commission Rule aggregate by public identity.
   *
   * Deletion is a persistence concern.
   *
   * No domain lifecycle transition is executed.
   *
   * Any database-level referential restrictions remain the responsibility of
   * Prisma and the underlying database schema.
   */
  public async delete(
    aggregate: CommercialCommissionRuleAggregate,
  ): Promise<void> {
    await this.prisma.commercialCommissionRule.delete({
      where: {
        publicId: aggregate.publicId.value,
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds all Commercial Commission Rule aggregates.
   *
   * Every persisted rule is rehydrated through the Prisma mapper and aggregate
   * rehydration path.
   *
   * Results are deterministic:
   *
   *   commission type ASC
   *   version DESC
   *
   * Rules belonging to the same commission type are therefore grouped
   * together, with the newest policy version appearing first.
   *
   * This method performs no policy evaluation and does not determine which
   * rule is currently effective.
   */
  public async findAll(): Promise<CommercialCommissionRuleAggregate[]> {
    const records = await this.prisma.commercialCommissionRule.findMany({
      orderBy: [
        {
          type: 'asc',
        },
        {
          version: 'desc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds a Commercial Commission Rule aggregate by public identity.
   *
   * Returns null when no matching rule exists.
   */
  public async findByPublicId(
    publicId: CommercialCommissionRulePublicId,
  ): Promise<CommercialCommissionRuleAggregate | null> {
    const record = await this.prisma.commercialCommissionRule.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
  }

  // ===========================================================================
  // Type + Version Query
  // ===========================================================================

  /**
   * Finds a Commercial Commission Rule aggregate by commission type and
   * version.
   *
   * Prisma enforces uniqueness through:
   *
   *   @@unique([type, version])
   */
  public async findByTypeAndVersion(
    type: CommercialCommissionType,
    version: number,
  ): Promise<CommercialCommissionRuleAggregate | null> {
    const record = await this.prisma.commercialCommissionRule.findUnique({
      where: {
        type_version: {
          type: type.value,
          version,
        },
      },
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
  }

  // ===========================================================================
  // Type Query
  // ===========================================================================

  /**
   * Finds all Commercial Commission Rule aggregates belonging to a commission
   * type.
   *
   * Rules are ordered by descending version so the newest policy definition
   * appears first.
   */
  public async findByType(
    type: CommercialCommissionType,
  ): Promise<CommercialCommissionRuleAggregate[]> {
    const records = await this.prisma.commercialCommissionRule.findMany({
      where: {
        type: type.value,
      },

      orderBy: {
        version: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Effective Rule Query
  // ===========================================================================

  /**
   * Finds the ACTIVE Commercial Commission Rule applicable at the supplied
   * timestamp.
   *
   * Effective-period boundaries are inclusive:
   *
   *   effectiveFrom <= at <= effectiveTo
   *
   * An undefined/null effectiveTo represents an open-ended rule:
   *
   *   effectiveFrom <= at
   *
   * Rules are ordered by descending version.
   *
   * Under the Commercial Commission Rule invariant, overlapping effective
   * active rules for the same type should not exist. The version ordering
   * provides deterministic behavior if persistence contains inconsistent
   * historical data.
   */
  public async findEffectiveRule(
    type: CommercialCommissionType,
    at: Date,
  ): Promise<CommercialCommissionRuleAggregate | null> {
    const record = await this.prisma.commercialCommissionRule.findFirst({
      where: {
        type: type.value,

        status: 'ACTIVE',

        effectiveFrom: {
          lte: at,
        },

        OR: [
          {
            effectiveTo: null,
          },
          {
            effectiveTo: {
              gte: at,
            },
          },
        ],
      },

      orderBy: {
        version: 'desc',
      },
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
  }

  // ===========================================================================
  // Currently Active Rule
  // ===========================================================================

  /**
   * Finds the currently active and effective Commercial Commission Rule for a
   * commission type.
   *
   * "Currently active" means:
   *
   *   status = ACTIVE
   *
   * and:
   *
   *   effectiveFrom <= now
   *
   * and:
   *
   *   effectiveTo >= now
   *
   * or:
   *
   *   effectiveTo IS NULL
   */
  public async findActiveRule(
    type: CommercialCommissionType,
  ): Promise<CommercialCommissionRuleAggregate | null> {
    return this.findEffectiveRule(type, new Date());
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds a Commercial Commission Rule entity by public identity.
   *
   * The mapper performs the complete Prisma-to-domain reconstruction.
   */
  public async findEntityByPublicId(
    publicId: CommercialCommissionRulePublicId,
  ): Promise<CommercialCommissionRuleEntity | null> {
    const record = await this.prisma.commercialCommissionRule.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return CommercialCommissionRulePrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Type + Version Entity Query
  // ===========================================================================

  /**
   * Finds a Commercial Commission Rule entity by commission type and version.
   */
  public async findEntityByTypeAndVersion(
    type: CommercialCommissionType,
    version: number,
  ): Promise<CommercialCommissionRuleEntity | null> {
    const record = await this.prisma.commercialCommissionRule.findUnique({
      where: {
        type_version: {
          type: type.value,
          version,
        },
      },
    });

    if (record === null) {
      return null;
    }

    return CommercialCommissionRulePrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Effective Rule Entity Query
  // ===========================================================================

  /**
   * Finds the ACTIVE and effective Commercial Commission Rule entity at the
   * supplied timestamp.
   *
   * The entity is reconstructed directly through the Prisma mapper.
   */
  public async findEffectiveRuleEntity(
    type: CommercialCommissionType,
    at: Date,
  ): Promise<CommercialCommissionRuleEntity | null> {
    const record = await this.prisma.commercialCommissionRule.findFirst({
      where: {
        type: type.value,

        status: 'ACTIVE',

        effectiveFrom: {
          lte: at,
        },

        OR: [
          {
            effectiveTo: null,
          },
          {
            effectiveTo: {
              gte: at,
            },
          },
        ],
      },

      orderBy: {
        version: 'desc',
      },
    });

    if (record === null) {
      return null;
    }

    return CommercialCommissionRulePrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Determines whether a Commercial Commission Rule exists for the supplied
   * public identity.
   *
   * Only the database identity is selected because complete entity
   * reconstruction is unnecessary.
   */
  public async existsByPublicId(
    publicId: CommercialCommissionRulePublicId,
  ): Promise<boolean> {
    const record = await this.prisma.commercialCommissionRule.findUnique({
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
  // Type + Version Existence
  // ===========================================================================

  /**
   * Determines whether a Commercial Commission Rule exists for the supplied
   * commission type and version.
   *
   * The lookup uses the database uniqueness constraint:
   *
   *   @@unique([type, version])
   */
  public async existsByTypeAndVersion(
    type: CommercialCommissionType,
    version: number,
  ): Promise<boolean> {
    const record = await this.prisma.commercialCommissionRule.findUnique({
      where: {
        type_version: {
          type: type.value,
          version,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Effective-Period Integrity
  // ===========================================================================

  /**
   * Determines whether another Commercial Commission Rule overlaps the
   * supplied effective period for the same commission type.
   *
   * Effective periods are inclusive:
   *
   *   [effectiveFrom, effectiveTo]
   *
   * An undefined effectiveTo represents:
   *
   *   [effectiveFrom, +∞)
   *
   * Two periods overlap when the existing period intersects the requested
   * period.
   *
   * The query explicitly handles:
   *
   * - bounded requested periods;
   * - open-ended requested periods;
   * - bounded existing periods;
   * - open-ended existing periods;
   * - optional exclusion of the current rule during updates.
   *
   * This method performs persistence-level overlap detection only.
   *
   * It does not:
   *
   * - activate a rule;
   * - deactivate a rule;
   * - throw a domain exception;
   * - modify any persisted state.
   */
  public async hasOverlappingEffectivePeriod(
    type: CommercialCommissionType,
    effectiveFrom: Date,
    effectiveTo: Date | undefined,
    excludePublicId?: CommercialCommissionRulePublicId,
  ): Promise<boolean> {
    const record = await this.prisma.commercialCommissionRule.findFirst({
      where: {
        // ---------------------------------------------------------------------
        // Commission Type
        // ---------------------------------------------------------------------

        type: type.value,

        // ---------------------------------------------------------------------
        // Optional Current-Rule Exclusion
        // ---------------------------------------------------------------------
        //
        // This is required when validating an update to an existing rule.
        //
        // Without the exclusion, a rule would overlap with itself.
        // ---------------------------------------------------------------------

        ...(excludePublicId !== undefined
          ? {
              publicId: {
                not: excludePublicId.value,
              },
            }
          : {}),

        // ---------------------------------------------------------------------
        // Existing Rule Start
        // ---------------------------------------------------------------------
        //
        // For a bounded requested period:
        //
        //   existing.effectiveFrom <= requested.effectiveTo
        //
        // For an open-ended requested period there is no upper boundary.
        // Therefore this condition is omitted.
        // ---------------------------------------------------------------------

        ...(effectiveTo !== undefined
          ? {
              effectiveFrom: {
                lte: effectiveTo,
              },
            }
          : {}),

        // ---------------------------------------------------------------------
        // Existing Rule End
        // ---------------------------------------------------------------------
        //
        // Existing rule overlaps when:
        //
        //   existing.effectiveTo >= requested.effectiveFrom
        //
        // OR the existing rule is open-ended.
        // ---------------------------------------------------------------------

        OR: [
          {
            effectiveTo: null,
          },
          {
            effectiveTo: {
              gte: effectiveFrom,
            },
          },
        ],
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Persistence Mapping
  // ===========================================================================

  /**
   * Converts a Prisma Commercial Commission Rule record into a domain
   * aggregate.
   *
   * The mapper performs all Prisma-to-domain conversion.
   *
   * This repository method performs no:
   *
   * - value-object construction;
   * - enum conversion;
   * - Decimal conversion;
   * - timestamp reconstruction;
   * - lifecycle transition;
   * - domain event creation.
   */
  private toAggregate(
    record: CommercialCommissionRuleRecord,
  ): CommercialCommissionRuleAggregate {
    return CommercialCommissionRuleAggregate.rehydrate(
      CommercialCommissionRulePrismaMapper.toDomain(record),
    );
  }
}

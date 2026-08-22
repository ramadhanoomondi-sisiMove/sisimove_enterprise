// -----------------------------------------------------------------------------
// Commercial Commission Rule Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps:
//
// PrismaCommercialCommissionRule
//              │
//              ▼
// CommercialCommissionRuleEntity
//
// IMPORTANT DOMAIN BOUNDARY:
//
// CommercialCommissionRuleEntity owns ONLY the state of the commission rule.
//
// It does NOT own:
//
//   ├── bookingCommissions[]
//   └── earningCommissions[]
//
// Booking commissions and earning commissions are independent Commercial
// domain entities with their own aggregates, repositories, lifecycle, and
// persistence.
//
// Therefore:
//
//   CommercialCommissionRulePrismaMapper
//       -> maps ONLY CommercialCommissionRuleEntity
//
//   CommercialBookingCommissionPrismaMapper
//       -> maps CommercialBookingCommissionEntity
//
//   CommercialEarningCommissionPrismaMapper
//       -> maps CommercialEarningCommissionEntity
//
// Child commission persistence is therefore intentionally excluded from this
// mapper.
//
// -----------------------------------------------------------------------------
// IDENTIFIER BOUNDARY
// -----------------------------------------------------------------------------
//
// Prisma:
//
//   CommercialCommissionRule.id
//       -> internal persistence/entity identity
//
//   CommercialCommissionRule.publicId
//       -> CommercialCommissionRulePublicId
//
// Domain:
//
//   CommercialCommissionRuleEntity.id
//       -> UniqueEntityId
//
//   CommercialCommissionRuleEntity.publicId
//       -> CommercialCommissionRulePublicId
//
// IMPORTANT:
//
// `publicId` is NOT part of CommercialCommissionRuleProps.
//
// It belongs to the Entity identity boundary and must therefore be supplied
// separately to CommercialCommissionRuleEntity.rehydrate(...).
//
// -----------------------------------------------------------------------------
// MAPPER RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This mapper is responsible for:
//
// 1. Translating Prisma scalar state into domain value objects.
// 2. Rehydrating CommercialCommissionRuleEntity.
// 3. Translating CommercialCommissionRuleEntity into Prisma persistence data.
// 4. Preserving internal entity identity.
// 5. Preserving public entity identity.
// 6. Translating Prisma enum representations into domain enum values.
//
// This mapper MUST NOT:
//
// 1. Perform database lookups.
// 2. Resolve commission-rule relationships.
// 3. Load booking commissions.
// 4. Load earning commissions.
// 5. Persist child commissions.
// 6. Apply commission-rule business rules.
//
// Relationship resolution belongs to repositories and application/domain
// coordination, not to this mapper.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  CommercialCommissionRule as PrismaCommercialCommissionRule,
  CommercialCommissionType as PrismaCommercialCommissionType,
  CommercialCommissionRuleStatus as PrismaCommercialCommissionRuleStatus,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleEntity } from '../../../../domain/entities/commercial-commission-rule.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  CommercialCommissionRulePublicId,
  CommercialCommissionType,
  CommercialCommissionPercentage,
  CommercialCommissionRuleStatus,
  CommercialCommissionRuleEffectiveFrom,
  CommercialCommissionRuleEffectiveTo,
  CommercialCommissionRuleVersion,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import type {
  CommercialCommissionTypeValue,
  CommercialCommissionRuleStatusValue,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Value Conversion
// =============================================================================

/**
 * Converts the persisted Prisma Commercial Commission Type into the
 * corresponding domain value.
 *
 * Prisma enum values belong to the infrastructure layer. The mapper converts
 * and validates them before creating the domain value object.
 */
function toCommercialCommissionType(
  value: PrismaCommercialCommissionType,
): CommercialCommissionTypeValue {
  switch (value) {
    case 'BOOKING':
      return 'BOOKING';

    case 'EARNING':
      return 'EARNING';

    default:
      throw new Error(
        `Invalid persisted Commercial Commission Type "${String(value)}".`,
      );
  }
}

/**
 * Converts the persisted Prisma Commercial Commission Rule Status into the
 * corresponding domain status value.
 *
 * Prisma enum values belong to the infrastructure layer. The mapper converts
 * and validates them before creating the domain value object.
 */
function toCommercialCommissionRuleStatus(
  value: PrismaCommercialCommissionRuleStatus,
): CommercialCommissionRuleStatusValue {
  switch (value) {
    case 'ACTIVE':
      return 'ACTIVE';

    case 'INACTIVE':
      return 'INACTIVE';

    default:
      throw new Error(
        `Invalid persisted Commercial Commission Rule Status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Mapper
// =============================================================================

/**
 * Prisma mapper for the Commercial Commission Rule Entity.
 *
 * The mapper deliberately operates on the rule entity only.
 *
 * Commercial booking commissions and commercial earning commissions are
 * independent entities and are therefore mapped by their own Prisma mappers.
 */
export class CommercialCommissionRulePrismaMapper {
  // ===========================================================================
  // Prisma → Domain
  // ===========================================================================

  /**
   * Rehydrates a CommercialCommissionRuleEntity from Prisma persistence data.
   *
   * IMPORTANT:
   *
   * `publicId` is not included inside the props object because it is part of
   * the Entity identity boundary.
   *
   * The entity is therefore rehydrated using:
   *
   *   1. Domain properties.
   *   2. UniqueEntityId derived from Prisma `id`.
   *   3. CommercialCommissionRulePublicId derived from Prisma `publicId`.
   *
   * No child commission collections are accepted because the domain entity
   * does not own those collections.
   */
  public static toDomain(
    record: PrismaCommercialCommissionRule,
  ): CommercialCommissionRuleEntity {
    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new CommercialCommissionRulePublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Entity Rehydration
    // -------------------------------------------------------------------------

    return CommercialCommissionRuleEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Rule
        // ---------------------------------------------------------------------

        type: CommercialCommissionType.create(
          toCommercialCommissionType(record.type),
        ),

        percentage: CommercialCommissionPercentage.create(
          Number(record.percentage.toString()),
        ),

        status: CommercialCommissionRuleStatus.create(
          toCommercialCommissionRuleStatus(record.status),
        ),

        effectiveFrom: CommercialCommissionRuleEffectiveFrom.create(
          new Date(record.effectiveFrom),
        ),

        effectiveTo:
          record.effectiveTo !== null
            ? CommercialCommissionRuleEffectiveTo.create(
                new Date(record.effectiveTo),
              )
            : undefined,

        version: CommercialCommissionRuleVersion.create(record.version),

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: new Date(record.createdAt),

        updatedAt: new Date(record.updatedAt),
      },

      // -----------------------------------------------------------------------
      // Internal Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),

      // -----------------------------------------------------------------------
      // Public Identity
      // -----------------------------------------------------------------------

      publicId,
    );
  }

  // ===========================================================================
  // Domain → Prisma
  // ===========================================================================

  /**
   * Converts a CommercialCommissionRuleEntity into a Prisma-compatible
   * persistence structure.
   *
   * Only the rule's own scalar state is mapped.
   *
   * Booking commissions and earning commissions are intentionally excluded
   * because they are persisted through their own repositories.
   */
  public static toPersistence(entity: CommercialCommissionRuleEntity): {
    id: string;
    publicId: string;
    type: PrismaCommercialCommissionType;
    percentage: number;
    status: PrismaCommercialCommissionRuleStatus;
    effectiveFrom: Date;
    effectiveTo: Date | null;
    version: number;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Rule
      // -----------------------------------------------------------------------

      type: entity.type.value,

      percentage: entity.percentage.value,

      status: entity.status.value,

      effectiveFrom: entity.effectiveFrom.value,

      effectiveTo: entity.effectiveTo?.value ?? null,

      version: entity.version.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Persistence Alias
  // ===========================================================================

  /**
   * Alias for Prisma → Domain mapping.
   *
   * This provides a consistent `fromPersistence` convention for repositories
   * while keeping `toDomain` available for explicit mapper semantics.
   */
  public static fromPersistence(
    record: PrismaCommercialCommissionRule,
  ): CommercialCommissionRuleEntity {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Identity Helpers
  // ===========================================================================

  /**
   * Returns the internal persistence/entity identity.
   */
  public static toPersistenceId(
    entity: CommercialCommissionRuleEntity,
  ): string {
    return entity.id.toString();
  }

  /**
   * Returns the public identity of the commission rule.
   */
  public static toPublicId(entity: CommercialCommissionRuleEntity): string {
    return entity.publicId.value;
  }
}

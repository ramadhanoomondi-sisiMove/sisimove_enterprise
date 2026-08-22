// -----------------------------------------------------------------------------
// Commercial Booking Commission Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps:
//
// PrismaCommercialBookingCommission
//              │
//              ▼
// CommercialBookingCommissionEntity
//
// -----------------------------------------------------------------------------
// DOMAIN OWNERSHIP
// -----------------------------------------------------------------------------
//
// CommercialBookingCommissionEntity is an independent Commercial domain
// entity/aggregate and owns only its own commission-assessment state.
//
// It does NOT own:
//
//   ├── CommercialCommissionRuleEntity
//   ├── Journey
//   └── JourneyBooking
//
// Those are references.
//
// The Commercial Commission Rule is an internal Commercial-domain reference.
//
// Journey and Journey Booking are cross-domain references.
//
// -----------------------------------------------------------------------------
// IDENTIFIER BOUNDARY
// -----------------------------------------------------------------------------
//
// Prisma:
//
//   CommercialBookingCommission.id
//       -> internal entity identity
//
//   CommercialBookingCommission.publicId
//       -> CommercialBookingCommissionPublicId
//
//   CommercialBookingCommission.commissionRuleId
//       -> internal Prisma foreign key to CommercialCommissionRule.id
//
//   CommercialBookingCommission.bookingPublicId
//       -> cross-domain public identifier
//
//   CommercialBookingCommission.journeyPublicId
//       -> cross-domain public identifier
//
// Domain:
//
//   CommercialBookingCommissionEntity.id
//       -> UniqueEntityId
//
//   CommercialBookingCommissionEntity.publicId
//       -> CommercialBookingCommissionPublicId
//
//   commissionRulePublicId
//       -> CommercialCommissionRulePublicId
//
//   bookingPublicId
//       -> CommercialBookingCommissionBookingPublicId
//
//   journeyPublicId
//       -> CommercialBookingCommissionJourneyPublicId
//
// -----------------------------------------------------------------------------
// IMPORTANT RELATIONSHIP RULE
// -----------------------------------------------------------------------------
//
// The domain stores:
//
//   commissionRulePublicId
//
// while Prisma stores:
//
//   commissionRuleId
//
// These are intentionally different identifiers.
//
// Therefore this mapper MUST NOT do:
//
//   commissionRuleId: entity.commissionRulePublicId.value
//
// because the Prisma field expects the internal database ID of the
// CommercialCommissionRule record, not its public ID.
//
// The repository is responsible for resolving this internal relation:
//
//   commissionRule: {
//     connect: {
//       publicId: entity.commissionRulePublicId.value,
//     },
//   }
//
// Consequently, `commissionRuleId` is intentionally excluded from the
// mapper's persistence structure.
//
// -----------------------------------------------------------------------------
// MAPPER RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This mapper is responsible for:
//
// 1. Translating Prisma persistence values into domain value objects.
// 2. Rehydrating CommercialBookingCommissionEntity.
// 3. Translating the entity into Prisma-compatible scalar persistence data.
// 4. Preserving internal entity identity.
// 5. Preserving public entity identity.
// 6. Preserving historical commission-assessment snapshots.
// 7. Preserving persisted lifecycle state.
//
// This mapper MUST NOT:
//
// 1. Perform database lookups.
// 2. Resolve Prisma relations.
// 3. Assess commissions.
// 4. Cancel commissions.
// 5. Recalculate commission amounts.
// 6. Recalculate net amounts.
// 7. Apply commercial policy rules.
//
// Relationship resolution belongs to the repository.
// Business decisions belong to the domain/application layer.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionEntity } from '../../../../domain/entities/commercial-booking-commission.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  CommercialBookingCommissionPublicId,
  CommercialBookingCommissionBookingPublicId,
  CommercialBookingCommissionJourneyPublicId,
  CommercialBookingCommissionPercentage,
  CommercialBookingCommissionBaseAmount,
  CommercialBookingCommissionAmount,
  CommercialBookingCommissionCurrency,
  CommercialBookingCommissionStatus,
  CommercialCommissionRulePublicId,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma Record
// =============================================================================

/**
 * Prisma record required to fully rehydrate a Commercial Booking Commission.
 *
 * The commissionRule relation is included because the domain stores the
 * Commercial Commission Rule's public identifier rather than its internal
 * Prisma foreign key.
 */
type CommercialBookingCommissionRecord =
  Prisma.CommercialBookingCommissionGetPayload<{
    include: {
      commissionRule: true;
    };
  }>;

// =============================================================================
// Prisma Persistence Shape
// =============================================================================

/**
 * Persistence structure produced by the mapper.
 *
 * `commissionRuleId` is deliberately omitted.
 *
 * The repository resolves the Commercial Commission Rule relation using its
 * public identifier.
 */
export type CommercialBookingCommissionPersistence = Omit<
  Prisma.CommercialBookingCommissionUncheckedCreateInput,
  'commissionRuleId'
>;

// =============================================================================
// Mapper
// =============================================================================

/**
 * Prisma mapper for the Commercial Booking Commission Entity.
 *
 * The mapper provides deterministic translation between:
 *
 * Prisma persistence representation
 *            ↕
 * Commercial Booking Commission domain representation
 *
 * No domain lifecycle transition is executed during rehydration.
 */
export class CommercialBookingCommissionPrismaMapper {
  // ===========================================================================
  // Prisma → Domain
  // ===========================================================================

  /**
   * Rehydrates a Commercial Booking Commission Entity from Prisma.
   *
   * Persistence state is authoritative.
   *
   * In particular:
   *
   * - status is restored exactly as persisted;
   * - assessedAt is restored exactly as persisted;
   * - cancelledAt is restored exactly as persisted;
   * - percentage is restored exactly as persisted;
   * - baseAmount is restored exactly as persisted;
   * - commissionAmount is restored exactly as persisted;
   * - currency is restored exactly as persisted.
   *
   * No lifecycle method such as `assess()` or `cancel()` is invoked.
   *
   * The historical commission assessment is therefore not recalculated from
   * the current Commercial Commission Rule.
   */
  public static toDomain(
    record: CommercialBookingCommissionRecord,
  ): CommercialBookingCommissionEntity {
    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new CommercialBookingCommissionPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Entity Rehydration
    // -------------------------------------------------------------------------

    return CommercialBookingCommissionEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Commercial Policy Reference
        // ---------------------------------------------------------------------

        commissionRulePublicId: new CommercialCommissionRulePublicId(
          record.commissionRule.publicId,
        ),

        // ---------------------------------------------------------------------
        // Cross-Domain Booking Reference
        // ---------------------------------------------------------------------

        bookingPublicId: CommercialBookingCommissionBookingPublicId.create(
          record.bookingPublicId,
        ),

        // ---------------------------------------------------------------------
        // Cross-Domain Journey Reference
        // ---------------------------------------------------------------------

        journeyPublicId: new CommercialBookingCommissionJourneyPublicId(
          record.journeyPublicId,
        ),

        // ---------------------------------------------------------------------
        // Commission Assessment Snapshot
        // ---------------------------------------------------------------------
        //
        // Prisma Decimal values are explicitly converted through string
        // representation before becoming domain numbers.
        //
        // This avoids relying on implicit Decimal → number coercion.
        // ---------------------------------------------------------------------

        percentage: CommercialBookingCommissionPercentage.create(
          Number(record.percentage.toString()),
        ),

        baseAmount: CommercialBookingCommissionBaseAmount.create(
          record.baseAmount,
        ),

        commissionAmount: CommercialBookingCommissionAmount.create(
          record.commissionAmount,
        ),

        currency: CommercialBookingCommissionCurrency.create(record.currency),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: CommercialBookingCommissionStatus.create(record.status),

        assessedAt:
          record.assessedAt !== null
            ? new Date(record.assessedAt.getTime())
            : undefined,

        cancelledAt:
          record.cancelledAt !== null
            ? new Date(record.cancelledAt.getTime())
            : undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
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
   * Converts a Commercial Booking Commission Entity into a Prisma-compatible
   * persistence structure.
   *
   * The mapper returns only fields that belong directly to the commission
   * record.
   *
   * The internal `commissionRuleId` foreign key is intentionally omitted.
   *
   * The repository must resolve the relationship using:
   *
   *   entity.commissionRulePublicId.value
   *
   * and Prisma's nested relation connection.
   */
  public static toPersistence(
    entity: CommercialBookingCommissionEntity,
  ): CommercialBookingCommissionPersistence {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Cross-Domain References
      // -----------------------------------------------------------------------

      bookingPublicId: entity.bookingPublicId.value,

      journeyPublicId: entity.journeyPublicId.value,

      // -----------------------------------------------------------------------
      // Commission Assessment Snapshot
      // -----------------------------------------------------------------------

      percentage: entity.percentage.value,

      baseAmount: entity.baseAmount.value,

      commissionAmount: entity.commissionAmount.value,

      currency: entity.currency.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      assessedAt: entity.assessedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

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
   * Provides a consistent mapper API across persistence components.
   */
  public static fromPersistence(
    record: CommercialBookingCommissionRecord,
  ): CommercialBookingCommissionEntity {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Identity Helpers
  // ===========================================================================

  /**
   * Returns the internal persistence/entity identity.
   */
  public static toPersistenceId(
    entity: CommercialBookingCommissionEntity,
  ): string {
    return entity.id.toString();
  }

  /**
   * Returns the public identity.
   */
  public static toPublicId(entity: CommercialBookingCommissionEntity): string {
    return entity.publicId.value;
  }
}

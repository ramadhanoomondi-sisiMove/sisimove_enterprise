// -----------------------------------------------------------------------------
// Commercial Earning Commission Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps:
//
// PrismaCommercialEarningCommission
//              │
//              ▼
// CommercialEarningCommissionEntity
//
// Important identifier boundary:
//
// Prisma:
//   CommercialEarningCommission.id
//     -> internal entity identity
//
//   CommercialEarningCommission.publicId
//     -> CommercialEarningCommissionPublicId
//
// Domain:
//
//   CommercialEarningCommissionEntity.id
//     -> UniqueEntityId
//
//   CommercialEarningCommissionEntity.publicId
//     -> CommercialEarningCommissionPublicId
//
// IMPORTANT:
//
// `publicId` is NOT part of CommercialEarningCommissionProps.
//
// It belongs to the foundation Entity identity boundary and is therefore
// supplied separately to CommercialEarningCommissionEntity.rehydrate(...).
//
// Cross-domain references remain public-id value objects.
//
// The Commercial Commission Rule is an internal Commercial-domain reference
// and is represented by CommercialCommissionRulePublicId.
//
// Journey, Settlement and Provider are cross-domain references represented by
// their respective public-id value objects.
//
// This mapper performs persistence translation only.
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

import { CommercialEarningCommissionEntity } from '../../../../domain/entities/commercial-earning-commission.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  CommercialEarningCommissionPublicId,
  CommercialCommissionRulePublicId,
  CommercialEarningCommissionJourneyPublicId,
  CommercialEarningCommissionSettlementPublicId,
  CommercialEarningCommissionProviderPublicId,
  CommercialEarningCommissionPercentage,
  CommercialEarningCommissionBaseAmount,
  CommercialEarningCommissionAmount,
  CommercialEarningCommissionNetAmount,
  CommercialEarningCommissionCurrency,
  CommercialEarningCommissionStatus,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma Record
// =============================================================================

type CommercialEarningCommissionRecord =
  Prisma.CommercialEarningCommissionGetPayload<{
    include: {
      commissionRule: true;
    };
  }>;

// =============================================================================
// Mapper
// =============================================================================

/**
 * Prisma mapper for the Commercial Earning Commission Entity.
 *
 * Converts persistence data into the corresponding domain representation and
 * converts domain state into Prisma-compatible persistence data.
 */
export class CommercialEarningCommissionPrismaMapper {
  // ===========================================================================
  // Prisma → Domain
  // ===========================================================================

  /**
   * Rehydrates a Commercial Earning Commission Entity from Prisma.
   *
   * Persisted lifecycle state is restored exactly as stored.
   *
   * No lifecycle transition is invoked during rehydration.
   */
  public static toDomain(
    record: CommercialEarningCommissionRecord,
  ): CommercialEarningCommissionEntity {
    const publicId = new CommercialEarningCommissionPublicId(record.publicId);

    return CommercialEarningCommissionEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Commercial Rule Reference
        // ---------------------------------------------------------------------

        commissionRulePublicId: new CommercialCommissionRulePublicId(
          record.commissionRule.publicId,
        ),

        // ---------------------------------------------------------------------
        // Cross-Domain References
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
        // Commission Assessment Snapshot
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
   * Converts a Commercial Earning Commission Entity into a Prisma-compatible
   * persistence structure.
   *
   * The Commercial Commission Rule relation is deliberately not represented
   * using `commissionRuleId` here because the domain stores the rule's public
   * identity while Prisma stores the rule's internal database identity.
   *
   * The repository is responsible for resolving the relation using:
   *
   * commissionRule.connect({ publicId })
   */
  public static toPersistence(
    entity: CommercialEarningCommissionEntity,
  ): Omit<
    Prisma.CommercialEarningCommissionUncheckedCreateInput,
    'commissionRuleId'
  > {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Cross-Domain References
      // -----------------------------------------------------------------------

      journeyPublicId: entity.journeyPublicId.value,

      settlementPublicId: entity.settlementPublicId.value,

      providerPublicId: entity.providerPublicId.value,

      // -----------------------------------------------------------------------
      // Commission Assessment Snapshot
      // -----------------------------------------------------------------------

      percentage: entity.percentage.value,

      baseAmount: entity.baseAmount.value,

      commissionAmount: entity.commissionAmount.value,

      netAmount: entity.netAmount.value,

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
   */
  public static fromPersistence(
    record: CommercialEarningCommissionRecord,
  ): CommercialEarningCommissionEntity {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Identity Helpers
  // ===========================================================================

  /**
   * Returns the internal persistence identity.
   */
  public static toPersistenceId(
    entity: CommercialEarningCommissionEntity,
  ): string {
    return entity.id.toString();
  }

  /**
   * Returns the public identity.
   */
  public static toPublicId(entity: CommercialEarningCommissionEntity): string {
    return entity.publicId.value;
  }
}

// -----------------------------------------------------------------------------
// Journey Settlement Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Journey Settlement persistence record between Prisma and the
// Journey Completion domain.
//
// Persistence responsibilities:
// - Translate Prisma persistence records into domain entities.
// - Translate domain entities into Prisma persistence structures.
// - Preserve the distinction between internal database IDs and public IDs.
// - Convert Prisma enum values into domain value-object values.
// - Convert nullable persistence fields into optional domain values.
//
// Identifier rules:
//
// Prisma:
//   JourneySettlement.id
//       -> internal database identity
//
//   JourneySettlement.publicId
//       -> Journey Settlement public identity
//
//   JourneySettlement.completionId
//       -> internal JourneyCompletion.id foreign key
//
//   JourneySettlement.journeyPublicId
//       -> Journey public identity
//
//   JourneySettlement.providerPublicId
//       -> Provider / Identity public identity
//
//   JourneySettlement.financialTransactionPublicId
//       -> Financial transaction public identity
//
// Domain:
//
//   JourneySettlementEntity.id
//       -> UniqueEntityId
//
//   JourneySettlementEntity.publicId
//       -> JourneySettlementPublicId
//
//   JourneySettlementEntity.completionId
//       -> UniqueEntityId
//
//   JourneySettlementEntity.journeyPublicId
//       -> JourneyCompletionJourneyPublicId
//
//   JourneySettlementEntity.providerPublicId
//       -> JourneyCompletionProviderPublicId
//
//   JourneySettlementEntity.financialTransactionPublicId
//       -> JourneySettlementFinancialTransactionPublicId
//
// Important:
//
// Journey Settlement does NOT introduce separate journey/provider value
// objects. The domain value-object barrel explicitly establishes that
// JourneyCompletionJourneyPublicId and JourneyCompletionProviderPublicId are
// the identifiers used by this bounded context.
//
// Journey Settlement has no aggregate-owned child entities, so the mapper
// operates on the settlement root only.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  JourneySettlement as PrismaJourneySettlement,
  JourneySettlementStatus as PrismaJourneySettlementStatus,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { JourneySettlementEntity } from '../../../../domain/entities/journey-settlement.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyCompletionJourneyPublicId,
  JourneyCompletionProviderPublicId,
  JourneySettlementFailureReason,
  JourneySettlementFinancialTransactionPublicId,
  JourneySettlementPublicId,
  JourneySettlementStatus,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import type { JourneySettlementStatusValue } from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Value Conversion
// =============================================================================

/**
 * Converts a persisted Prisma Journey Settlement status into the domain
 * Journey Settlement status value.
 *
 * Keep this conversion explicit so the Prisma enum remains isolated from the
 * domain value-object representation.
 */
function toJourneySettlementStatus(
  value: PrismaJourneySettlementStatus,
): JourneySettlementStatusValue {
  switch (value) {
    case 'PENDING':
      return 'PENDING';

    case 'SUBMITTED':
      return 'SUBMITTED';

    case 'PROCESSING':
      return 'PROCESSING';

    case 'COMPLETED':
      return 'COMPLETED';

    case 'FAILED':
      return 'FAILED';

    case 'HELD':
      return 'HELD';

    case 'CANCELLED':
      return 'CANCELLED';

    default:
      throw new Error(
        `Invalid persisted Journey Settlement status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Prisma persistence structure produced by the mapper.
 *
 * Journey Settlement has no aggregate-owned child persistence records.
 */
export interface JourneySettlementPersistence {
  journeySettlement: ReturnType<
    typeof JourneySettlementPrismaMapper.settlementToPersistence
  >;
}

// =============================================================================
// Mapper
// =============================================================================

export class JourneySettlementPrismaMapper {
  // ===========================================================================
  // Prisma → Domain
  // ===========================================================================

  /**
   * Rehydrates a Journey Settlement domain entity from a Prisma record.
   *
   * Persistence identity is authoritative during rehydration.
   */
  public static toDomain(
    record: PrismaJourneySettlement,
  ): JourneySettlementEntity {
    return this.settlementToDomain(record);
  }

  // ===========================================================================
  // Journey Settlement
  // ===========================================================================

  /**
   * Maps a persisted Journey Settlement root into the domain entity.
   *
   * Identifier semantics:
   *
   * Prisma `id`
   *   -> UniqueEntityId
   *
   * Prisma `publicId`
   *   -> JourneySettlementPublicId
   *
   * Prisma `completionId`
   *   -> UniqueEntityId
   *
   * Prisma `journeyPublicId`
   *   -> JourneyCompletionJourneyPublicId
   *
   * Prisma `providerPublicId`
   *   -> JourneyCompletionProviderPublicId
   *
   * Prisma `financialTransactionPublicId`
   *   -> JourneySettlementFinancialTransactionPublicId
   */
  public static settlementToDomain(
    record: PrismaJourneySettlement,
  ): JourneySettlementEntity {
    const publicId = new JourneySettlementPublicId(record.publicId);

    return JourneySettlementEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Journey Completion
        // ---------------------------------------------------------------------
        //
        // IMPORTANT:
        //
        // JourneySettlementEntity.completionId is intentionally an internal
        // UniqueEntityId. It represents JourneyCompletion.id, not
        // JourneyCompletion.publicId.
        //

        completionId: new UniqueEntityId(record.completionId),

        // ---------------------------------------------------------------------
        // Journey
        // ---------------------------------------------------------------------

        journeyPublicId: new JourneyCompletionJourneyPublicId(
          record.journeyPublicId,
        ),

        // ---------------------------------------------------------------------
        // Provider
        // ---------------------------------------------------------------------

        providerPublicId: new JourneyCompletionProviderPublicId(
          record.providerPublicId,
        ),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: JourneySettlementStatus.create(
          toJourneySettlementStatus(record.status),
        ),

        // ---------------------------------------------------------------------
        // Financial Transaction
        // ---------------------------------------------------------------------

        financialTransactionPublicId:
          record.financialTransactionPublicId !== null
            ? new JourneySettlementFinancialTransactionPublicId(
                record.financialTransactionPublicId,
              )
            : undefined,

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        submittedAt: record.submittedAt ?? undefined,

        processingAt: record.processingAt ?? undefined,

        completedAt: record.completedAt ?? undefined,

        failedAt: record.failedAt ?? undefined,

        heldAt: record.heldAt ?? undefined,

        cancelledAt: record.cancelledAt ?? undefined,

        // ---------------------------------------------------------------------
        // Failure
        // ---------------------------------------------------------------------
        //
        // Failure reason is a domain value object.
        //
        // Use the value object's factory rather than constructing it directly
        // so validation remains inside the value object.
        //

        failureReason:
          record.failureReason !== null
            ? JourneySettlementFailureReason.create(record.failureReason)
            : undefined,

        // ---------------------------------------------------------------------
        // Version
        // ---------------------------------------------------------------------

        version: record.version,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      // -----------------------------------------------------------------------
      // Persistence identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),

      // -----------------------------------------------------------------------
      // Persistence public identity
      // -----------------------------------------------------------------------

      publicId,
    );
  }

  // ===========================================================================
  // Domain → Prisma
  // ===========================================================================

  /**
   * Maps a Journey Settlement domain entity into Prisma persistence shape.
   *
   * `completionId` is the internal JourneyCompletion database ID required by
   * the Prisma relation.
   */
  public static settlementToPersistence(entity: JourneySettlementEntity): {
    id: string;
    publicId: string;
    completionId: string;
    journeyPublicId: string;
    providerPublicId: string;
    status: PrismaJourneySettlementStatus;
    financialTransactionPublicId: string | null;
    submittedAt: Date | null;
    processingAt: Date | null;
    completedAt: Date | null;
    failedAt: Date | null;
    heldAt: Date | null;
    cancelledAt: Date | null;
    failureReason: string | null;
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
      // Journey Completion
      // -----------------------------------------------------------------------
      //
      // Prisma expects JourneyCompletion.id.
      //
      // The domain entity intentionally stores this as UniqueEntityId.
      //

      completionId: entity.completionId.toString(),

      // -----------------------------------------------------------------------
      // Journey
      // -----------------------------------------------------------------------

      journeyPublicId: entity.journeyPublicId.value,

      // -----------------------------------------------------------------------
      // Provider
      // -----------------------------------------------------------------------

      providerPublicId: entity.providerPublicId.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Financial Transaction
      // -----------------------------------------------------------------------

      financialTransactionPublicId:
        entity.financialTransactionPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      submittedAt: entity.submittedAt ?? null,

      processingAt: entity.processingAt ?? null,

      completedAt: entity.completedAt ?? null,

      failedAt: entity.failedAt ?? null,

      heldAt: entity.heldAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      // -----------------------------------------------------------------------
      // Failure
      // -----------------------------------------------------------------------

      failureReason: entity.failureReason?.value ?? null,

      // -----------------------------------------------------------------------
      // Version
      // -----------------------------------------------------------------------

      version: entity.version,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Converts the Journey Settlement domain entity into its persistence
   * structure.
   *
   * Journey Settlement has no aggregate-owned child persistence records.
   */
  public static toPersistence(
    entity: JourneySettlementEntity,
  ): JourneySettlementPersistence {
    return {
      journeySettlement: this.settlementToPersistence(entity),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps an individual persisted Journey Settlement record.
   *
   * Provided for consistency with the other Prisma mappers.
   */
  public static toDomainComponent(
    record: PrismaJourneySettlement,
  ): JourneySettlementEntity {
    return this.settlementToDomain(record);
  }

  /**
   * Maps an individual Journey Settlement entity into persistence.
   *
   * Provided for consistency with the other Prisma mappers.
   */
  public static toPersistenceComponent(
    entity: JourneySettlementEntity,
  ): ReturnType<typeof JourneySettlementPrismaMapper.settlementToPersistence> {
    return this.settlementToPersistence(entity);
  }

  // ===========================================================================
  // Status Conversion
  // ===========================================================================

  /**
   * Converts a Prisma Journey Settlement status into the domain value object.
   */
  public static statusToDomain(
    value: PrismaJourneySettlementStatus,
  ): JourneySettlementStatus {
    return JourneySettlementStatus.create(toJourneySettlementStatus(value));
  }

  /**
   * Converts a domain Journey Settlement status into the Prisma enum.
   *
   * This keeps enum translation explicit at the persistence boundary.
   */
  public static statusToPersistence(
    status: JourneySettlementStatus,
  ): PrismaJourneySettlementStatus {
    switch (status.value) {
      case 'PENDING':
        return 'PENDING';

      case 'SUBMITTED':
        return 'SUBMITTED';

      case 'PROCESSING':
        return 'PROCESSING';

      case 'COMPLETED':
        return 'COMPLETED';

      case 'FAILED':
        return 'FAILED';

      case 'HELD':
        return 'HELD';

      case 'CANCELLED':
        return 'CANCELLED';

      default:
        throw new Error(
          `Invalid Journey Settlement domain status "${String(status.value)}".`,
        );
    }
  }
}

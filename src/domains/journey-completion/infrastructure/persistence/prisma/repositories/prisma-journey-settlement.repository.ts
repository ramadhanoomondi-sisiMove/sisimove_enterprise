// -----------------------------------------------------------------------------
// Prisma Journey Settlement Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Journey Settlement aggregate.
//
// Responsibilities:
// - Aggregate persistence and rehydration
// - Root Journey Settlement queries
// - Journey Completion association queries
// - Journey queries
// - Provider queries
// - Settlement lifecycle queries
// - Financial transaction reference queries
//
// Journey Settlement owns only its settlement entity.
//
// Journey Completion is a separate aggregate. The persistence model therefore
// stores the internal JourneyCompletion.id through completionId.
//
// Cross-domain/public references remain value-object based at the domain
// boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { $Enums } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { JourneySettlementAggregate } from '../../../../domain/aggregates/journey-settlement.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { JourneySettlementEntity } from '../../../../domain/entities/journey-settlement.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneySettlementRepository } from '../../../../domain/repositories/journey-settlement.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { JourneySettlementPublicId } from '../../../../domain/value-objects/journey-settlement-public-id.vo';

import type { JourneyCompletionPublicId } from '../../../../domain/value-objects/journey-completion-public-id.vo';

import type { JourneyCompletionJourneyPublicId } from '../../../../domain/value-objects/journey-completion-journey-public-id.vo';

import type { JourneyCompletionProviderPublicId } from '../../../../domain/value-objects/journey-completion-provider-public-id.vo';

import type { JourneySettlementFinancialTransactionPublicId } from '../../../../domain/value-objects/journey-settlement-financial-transaction-public-id.vo';

import type { JourneySettlementStatus } from '../../../../domain/value-objects/journey-settlement-status.vo';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { JourneySettlementPrismaMapper } from '../../../persistence/prisma/mappers/journey-settlement-prisma.mapper';

// =============================================================================
// Repository
// =============================================================================

export class PrismaJourneySettlementRepository implements JourneySettlementRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  /**
   * Converts a domain status value into the generated Prisma enum.
   *
   * The domain value object is the authoritative boundary. Prisma receives
   * the corresponding persisted enum only at the infrastructure boundary.
   */
  private toPrismaJourneySettlementStatus(
    value: string,
  ): $Enums.JourneySettlementStatus {
    return value as $Enums.JourneySettlementStatus;
  }

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete Journey Settlement aggregate.
   *
   * Journey Settlement currently owns only the root entity, so persistence
   * requires a single root upsert.
   */
  public async save(aggregate: JourneySettlementAggregate): Promise<void> {
    // -------------------------------------------------------------------------
    // IMPORTANT:
    //
    // The Prisma mapper maps JourneySettlementEntity -> persistence.
    //
    // The aggregate owns the entity through `journeySettlement`.
    // -------------------------------------------------------------------------

    const persistence = JourneySettlementPrismaMapper.toPersistence(
      aggregate.journeySettlement,
    );

    const settlement = persistence.journeySettlement;

    await this.prisma.journeySettlement.upsert({
      where: {
        id: settlement.id,
      },

      create: {
        id: settlement.id,
        publicId: settlement.publicId,

        completionId: settlement.completionId,

        journeyPublicId: settlement.journeyPublicId,
        providerPublicId: settlement.providerPublicId,

        status: this.toPrismaJourneySettlementStatus(settlement.status),

        financialTransactionPublicId: settlement.financialTransactionPublicId,

        submittedAt: settlement.submittedAt,
        processingAt: settlement.processingAt,
        completedAt: settlement.completedAt,
        failedAt: settlement.failedAt,
        heldAt: settlement.heldAt,
        cancelledAt: settlement.cancelledAt,

        failureReason: settlement.failureReason,

        version: settlement.version,

        createdAt: settlement.createdAt,
        updatedAt: settlement.updatedAt,
      },

      update: {
        publicId: settlement.publicId,

        completionId: settlement.completionId,

        journeyPublicId: settlement.journeyPublicId,
        providerPublicId: settlement.providerPublicId,

        status: this.toPrismaJourneySettlementStatus(settlement.status),

        financialTransactionPublicId: settlement.financialTransactionPublicId,

        submittedAt: settlement.submittedAt,
        processingAt: settlement.processingAt,
        completedAt: settlement.completedAt,
        failedAt: settlement.failedAt,
        heldAt: settlement.heldAt,
        cancelledAt: settlement.cancelledAt,

        failureReason: settlement.failureReason,

        version: settlement.version,

        updatedAt: settlement.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Aggregate Lookup
  // ===========================================================================

  public async findById(
    id: UniqueEntityId,
  ): Promise<JourneySettlementAggregate | null> {
    const record = await this.prisma.journeySettlement.findUnique({
      where: {
        id: id.value,
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByPublicId(
    publicId: JourneySettlementPublicId,
  ): Promise<JourneySettlementAggregate | null> {
    const record = await this.prisma.journeySettlement.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Delete / Exists
  // ===========================================================================

  public async delete(id: UniqueEntityId): Promise<void> {
    await this.prisma.journeySettlement.delete({
      where: {
        id: id.value,
      },
    });
  }

  public async exists(id: UniqueEntityId): Promise<boolean> {
    return (
      (await this.prisma.journeySettlement.count({
        where: {
          id: id.value,
        },
      })) > 0
    );
  }

  public async existsByPublicId(
    publicId: JourneySettlementPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeySettlement.count({
        where: {
          publicId: publicId.value,
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Root Journey Settlement Queries
  // ===========================================================================

  public async findJourneySettlementById(
    id: UniqueEntityId,
  ): Promise<JourneySettlementEntity | null> {
    const record = await this.prisma.journeySettlement.findUnique({
      where: {
        id: id.value,
      },
    });

    return record === null
      ? null
      : JourneySettlementPrismaMapper.settlementToDomain(record);
  }

  public async findJourneySettlementByPublicId(
    publicId: JourneySettlementPublicId,
  ): Promise<JourneySettlementEntity | null> {
    const record = await this.prisma.journeySettlement.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : JourneySettlementPrismaMapper.settlementToDomain(record);
  }

  public async findJourneySettlements(): Promise<JourneySettlementEntity[]> {
    const records = await this.prisma.journeySettlement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneySettlementPrismaMapper.settlementToDomain(record),
    );
  }

  // ===========================================================================
  // Journey Completion Queries
  // ===========================================================================

  public async findJourneySettlementByCompletionId(
    completionId: UniqueEntityId,
  ): Promise<JourneySettlementEntity | null> {
    const record = await this.prisma.journeySettlement.findUnique({
      where: {
        completionId: completionId.value,
      },
    });

    return record === null
      ? null
      : JourneySettlementPrismaMapper.settlementToDomain(record);
  }

  public async findJourneySettlementByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
  ): Promise<JourneySettlementEntity | null> {
    const record = await this.prisma.journeySettlement.findFirst({
      where: {
        completion: {
          publicId: completionPublicId.value,
        },
      },
    });

    return record === null
      ? null
      : JourneySettlementPrismaMapper.settlementToDomain(record);
  }

  public async existsByCompletionId(
    completionId: UniqueEntityId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeySettlement.count({
        where: {
          completionId: completionId.value,
        },
      })) > 0
    );
  }

  public async existsByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeySettlement.count({
        where: {
          completion: {
            publicId: completionPublicId.value,
          },
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Journey Queries
  // ===========================================================================

  public async findJourneySettlementsByJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): Promise<JourneySettlementEntity[]> {
    const records = await this.prisma.journeySettlement.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneySettlementPrismaMapper.settlementToDomain(record),
    );
  }

  public async findJourneySettlementsByJourneyAndStatus(
    journeyPublicId: JourneyCompletionJourneyPublicId,
    status: JourneySettlementStatus,
  ): Promise<JourneySettlementEntity[]> {
    const records = await this.prisma.journeySettlement.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,

        status: this.toPrismaJourneySettlementStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneySettlementPrismaMapper.settlementToDomain(record),
    );
  }

  public async existsByJourneyPublicIdAndStatus(
    journeyPublicId: JourneyCompletionJourneyPublicId,
    status: JourneySettlementStatus,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeySettlement.count({
        where: {
          journeyPublicId: journeyPublicId.value,

          status: this.toPrismaJourneySettlementStatus(status.value),
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Provider Queries
  // ===========================================================================

  public async findJourneySettlementsByProviderPublicId(
    providerPublicId: JourneyCompletionProviderPublicId,
  ): Promise<JourneySettlementEntity[]> {
    const records = await this.prisma.journeySettlement.findMany({
      where: {
        providerPublicId: providerPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneySettlementPrismaMapper.settlementToDomain(record),
    );
  }

  public async findJourneySettlementsByProviderAndStatus(
    providerPublicId: JourneyCompletionProviderPublicId,
    status: JourneySettlementStatus,
  ): Promise<JourneySettlementEntity[]> {
    const records = await this.prisma.journeySettlement.findMany({
      where: {
        providerPublicId: providerPublicId.value,

        status: this.toPrismaJourneySettlementStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneySettlementPrismaMapper.settlementToDomain(record),
    );
  }

  public async existsByProviderPublicIdAndStatus(
    providerPublicId: JourneyCompletionProviderPublicId,
    status: JourneySettlementStatus,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeySettlement.count({
        where: {
          providerPublicId: providerPublicId.value,

          status: this.toPrismaJourneySettlementStatus(status.value),
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Status Queries
  // ===========================================================================

  public async findJourneySettlementsByStatus(
    status: JourneySettlementStatus,
  ): Promise<JourneySettlementEntity[]> {
    const records = await this.prisma.journeySettlement.findMany({
      where: {
        status: this.toPrismaJourneySettlementStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneySettlementPrismaMapper.settlementToDomain(record),
    );
  }

  public async findPendingSettlements(): Promise<JourneySettlementEntity[]> {
    return this.findJourneySettlementsByStatusValue('PENDING');
  }

  public async findSubmittedSettlements(): Promise<JourneySettlementEntity[]> {
    return this.findJourneySettlementsByStatusValue('SUBMITTED');
  }

  public async findProcessingSettlements(): Promise<JourneySettlementEntity[]> {
    return this.findJourneySettlementsByStatusValue('PROCESSING');
  }

  public async findCompletedSettlements(): Promise<JourneySettlementEntity[]> {
    return this.findJourneySettlementsByStatusValue('COMPLETED');
  }

  public async findFailedSettlements(): Promise<JourneySettlementEntity[]> {
    return this.findJourneySettlementsByStatusValue('FAILED');
  }

  public async findHeldSettlements(): Promise<JourneySettlementEntity[]> {
    return this.findJourneySettlementsByStatusValue('HELD');
  }

  public async findCancelledSettlements(): Promise<JourneySettlementEntity[]> {
    return this.findJourneySettlementsByStatusValue('CANCELLED');
  }

  private async findJourneySettlementsByStatusValue(
    status: $Enums.JourneySettlementStatus,
  ): Promise<JourneySettlementEntity[]> {
    const records = await this.prisma.journeySettlement.findMany({
      where: {
        status,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneySettlementPrismaMapper.settlementToDomain(record),
    );
  }

  public async countByStatus(status: JourneySettlementStatus): Promise<number> {
    return this.prisma.journeySettlement.count({
      where: {
        status: this.toPrismaJourneySettlementStatus(status.value),
      },
    });
  }

  public async existsByStatus(
    status: JourneySettlementStatus,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeySettlement.count({
        where: {
          status: this.toPrismaJourneySettlementStatus(status.value),
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Financial Transaction Queries
  // ===========================================================================

  public async findByFinancialTransactionPublicId(
    financialTransactionPublicId: JourneySettlementFinancialTransactionPublicId,
  ): Promise<JourneySettlementAggregate | null> {
    const record = await this.prisma.journeySettlement.findFirst({
      where: {
        financialTransactionPublicId: financialTransactionPublicId.value,
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findJourneySettlementByFinancialTransactionPublicId(
    financialTransactionPublicId: JourneySettlementFinancialTransactionPublicId,
  ): Promise<JourneySettlementEntity | null> {
    const record = await this.prisma.journeySettlement.findFirst({
      where: {
        financialTransactionPublicId: financialTransactionPublicId.value,
      },
    });

    return record === null
      ? null
      : JourneySettlementPrismaMapper.settlementToDomain(record);
  }

  public async existsByFinancialTransactionPublicId(
    financialTransactionPublicId: JourneySettlementFinancialTransactionPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeySettlement.count({
        where: {
          financialTransactionPublicId: financialTransactionPublicId.value,
        },
      })) > 0
    );
  }

  public async findSettlementsWithoutFinancialTransaction(): Promise<
    JourneySettlementEntity[]
  > {
    const records = await this.prisma.journeySettlement.findMany({
      where: {
        financialTransactionPublicId: null,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneySettlementPrismaMapper.settlementToDomain(record),
    );
  }

  // ===========================================================================
  // Operational Queries
  // ===========================================================================

  public async findSettlementsAwaitingSubmission(): Promise<
    JourneySettlementEntity[]
  > {
    return this.findJourneySettlementsByStatusValue('PENDING');
  }

  public async findSettlementsAwaitingProcessing(): Promise<
    JourneySettlementEntity[]
  > {
    return this.findJourneySettlementsByStatusValue('SUBMITTED');
  }

  public async findSettlementsBeingProcessed(): Promise<
    JourneySettlementEntity[]
  > {
    return this.findJourneySettlementsByStatusValue('PROCESSING');
  }

  public async findSettlementsRequiringAttention(): Promise<
    JourneySettlementEntity[]
  > {
    const records = await this.prisma.journeySettlement.findMany({
      where: {
        status: {
          in: [
            this.toPrismaJourneySettlementStatus('FAILED'),
            this.toPrismaJourneySettlementStatus('HELD'),
          ],
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneySettlementPrismaMapper.settlementToDomain(record),
    );
  }

  public async existsSettlementRequiringAttention(): Promise<boolean> {
    return (
      (await this.prisma.journeySettlement.count({
        where: {
          status: {
            in: [
              this.toPrismaJourneySettlementStatus('FAILED'),
              this.toPrismaJourneySettlementStatus('HELD'),
            ],
          },
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Aggregate Reconstruction
  // ===========================================================================

  /**
   * Rehydrates the Journey Settlement aggregate from a persisted Prisma
   * record.
   *
   * The mapper reconstructs the root entity first. The aggregate factory
   * then restores the aggregate boundary and validates its invariants.
   */
  private toAggregate(
    record: Parameters<typeof JourneySettlementPrismaMapper.toDomain>[0],
  ): JourneySettlementAggregate {
    const entity = JourneySettlementPrismaMapper.toDomain(record);

    return JourneySettlementAggregate.rehydrate(entity);
  }
}

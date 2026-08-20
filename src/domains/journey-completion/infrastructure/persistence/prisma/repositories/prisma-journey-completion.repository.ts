// -----------------------------------------------------------------------------
// Prisma Journey Completion Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Journey Completion aggregate.
//
// Responsibilities:
// - Aggregate persistence and rehydration
// - Root Journey Completion queries
// - Confirmation queries
// - Dispute queries
// - Existence / count queries
//
// Aggregate boundary:
//
// JourneyCompletionAggregate
// ├── JourneyCompletionEntity
// ├── JourneyCompletionConfirmationEntity[]
// └── JourneyCompletionDisputeEntity[]
//
// Journey Settlement is a separate aggregate and is intentionally NOT exposed
// through this repository.
//
// Cross-domain references are persisted and queried through their public
// identifiers only.
//
// Internal aggregate/child relationships continue to use Prisma internal IDs.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { $Enums } from '@prisma/client';

import type { Prisma } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyCompletionAggregate } from '../../../../domain/aggregates/journey-completion.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { JourneyCompletionEntity } from '../../../../domain/entities/journey-completion.entity';

import type { JourneyCompletionConfirmationEntity } from '../../../../domain/entities/journey-completion-confirmation.entity';

import type { JourneyCompletionDisputeEntity } from '../../../../domain/entities/journey-completion-dispute.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionPublicId } from '../../../../domain/value-objects/journey-completion-public-id.vo';

import type { JourneyCompletionJourneyPublicId } from '../../../../domain/value-objects/journey-completion-journey-public-id.vo';

import type { JourneyCompletionProviderPublicId } from '../../../../domain/value-objects/journey-completion-provider-public-id.vo';

import type { JourneyCompletionMemberPublicId } from '../../../../domain/value-objects/journey-completion-member-public-id.vo';

import type { JourneyCompletionBookingPublicId } from '../../../../domain/value-objects/journey-completion-booking-public-id.vo';

import type { JourneyCompletionStatus } from '../../../../domain/value-objects/journey-completion-status.vo';

import type { JourneyCompletionConfirmationPublicId } from '../../../../domain/value-objects/journey-completion-confirmation-public-id.vo';

import type { JourneyCompletionConfirmationRole } from '../../../../domain/value-objects/journey-completion-confirmation-role.vo';

import type { JourneyCompletionConfirmationStatus } from '../../../../domain/value-objects/journey-completion-confirmation-status.vo';

import type { JourneyCompletionDisputePublicId } from '../../../../domain/value-objects/journey-completion-dispute-public-id.vo';

import type { JourneyCompletionDisputeReason } from '../../../../domain/value-objects/journey-completion-dispute-reason.vo';

import type { JourneyCompletionDisputeStatus } from '../../../../domain/value-objects/journey-completion-dispute-status.vo';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  JourneyCompletionPrismaMapper,
  type JourneyCompletionWithComponents,
} from '../../../persistence/prisma/mappers/journey-completion-prisma.mapper';

// =============================================================================
// Internal ID
// =============================================================================
//
// Journey Completion does not expose a dedicated internal-ID value object.
//
// Entity.id therefore remains:
//
// UniqueEntityId
//
// -----------------------------------------------------------------------------

type JourneyCompletionId = UniqueEntityId;

// =============================================================================
// Repository
// =============================================================================

export class PrismaJourneyCompletionRepository implements JourneyCompletionRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  private toPrismaJourneyCompletionStatus(
    value: string,
  ): $Enums.JourneyCompletionStatus {
    return value as $Enums.JourneyCompletionStatus;
  }

  private toPrismaJourneyCompletionConfirmationRole(
    value: string,
  ): $Enums.JourneyCompletionConfirmationRole {
    return value as $Enums.JourneyCompletionConfirmationRole;
  }

  private toPrismaJourneyCompletionConfirmationStatus(
    value: string,
  ): $Enums.JourneyCompletionConfirmationStatus {
    return value as $Enums.JourneyCompletionConfirmationStatus;
  }

  private toPrismaJourneyCompletionDisputeReason(
    value: string,
  ): $Enums.JourneyCompletionDisputeReason {
    return value as $Enums.JourneyCompletionDisputeReason;
  }

  private toPrismaJourneyCompletionDisputeStatus(
    value: string,
  ): $Enums.JourneyCompletionDisputeStatus {
    return value as $Enums.JourneyCompletionDisputeStatus;
  }

  // ===========================================================================
  // Include Graph
  // ===========================================================================

  private readonly include = {
    confirmations: true,
    disputes: true,
  } satisfies Prisma.JourneyCompletionInclude;

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete Journey Completion aggregate atomically.
   *
   * The aggregate consists exclusively of:
   *
   * - JourneyCompletionEntity
   * - JourneyCompletionConfirmationEntity[]
   * - JourneyCompletionDisputeEntity[]
   *
   * Journey Settlement is deliberately excluded because it is a separate
   * aggregate.
   */
  public async save(aggregate: JourneyCompletionAggregate): Promise<void> {
    const persistence = JourneyCompletionPrismaMapper.toPersistence(aggregate);

    await this.prisma.$transaction(async (tx) => {
      const completionId = persistence.journeyCompletion.id;

      // -----------------------------------------------------------------------
      // Root
      // -----------------------------------------------------------------------

      await tx.journeyCompletion.upsert({
        where: {
          id: completionId,
        },

        create: {
          id: persistence.journeyCompletion.id,
          publicId: persistence.journeyCompletion.publicId,

          journeyPublicId: persistence.journeyCompletion.journeyPublicId,

          providerPublicId: persistence.journeyCompletion.providerPublicId,

          status: this.toPrismaJourneyCompletionStatus(
            persistence.journeyCompletion.status,
          ),

          completionRequestedAt:
            persistence.journeyCompletion.completionRequestedAt,

          confirmedAt: persistence.journeyCompletion.confirmedAt,

          disputedAt: persistence.journeyCompletion.disputedAt,

          cancelledAt: persistence.journeyCompletion.cancelledAt,

          requiredConfirmations:
            persistence.journeyCompletion.requiredConfirmations,

          confirmedCount: persistence.journeyCompletion.confirmedCount,

          version: persistence.journeyCompletion.version,

          createdAt: persistence.journeyCompletion.createdAt,

          updatedAt: persistence.journeyCompletion.updatedAt,
        },

        update: {
          publicId: persistence.journeyCompletion.publicId,

          journeyPublicId: persistence.journeyCompletion.journeyPublicId,

          providerPublicId: persistence.journeyCompletion.providerPublicId,

          status: this.toPrismaJourneyCompletionStatus(
            persistence.journeyCompletion.status,
          ),

          completionRequestedAt:
            persistence.journeyCompletion.completionRequestedAt,

          confirmedAt: persistence.journeyCompletion.confirmedAt,

          disputedAt: persistence.journeyCompletion.disputedAt,

          cancelledAt: persistence.journeyCompletion.cancelledAt,

          requiredConfirmations:
            persistence.journeyCompletion.requiredConfirmations,

          confirmedCount: persistence.journeyCompletion.confirmedCount,

          version: persistence.journeyCompletion.version,

          updatedAt: persistence.journeyCompletion.updatedAt,
        },
      });

      // -----------------------------------------------------------------------
      // Confirmations
      // -----------------------------------------------------------------------
      //
      // Confirmations are aggregate-owned child entities.
      //
      // Replace the persisted child set atomically with the aggregate state.
      // -----------------------------------------------------------------------

      await tx.journeyCompletionConfirmation.deleteMany({
        where: {
          completionId,
        },
      });

      if (persistence.confirmations.length > 0) {
        await tx.journeyCompletionConfirmation.createMany({
          data: persistence.confirmations.map((confirmation) => ({
            id: confirmation.id,
            publicId: confirmation.publicId,

            completionId: confirmation.completionId,

            memberPublicId: confirmation.memberPublicId,

            bookingPublicId: confirmation.bookingPublicId,

            role: this.toPrismaJourneyCompletionConfirmationRole(
              confirmation.role,
            ),

            status: this.toPrismaJourneyCompletionConfirmationStatus(
              confirmation.status,
            ),

            confirmedAt: confirmation.confirmedAt,

            withdrawnAt: confirmation.withdrawnAt,

            createdAt: confirmation.createdAt,

            updatedAt: confirmation.updatedAt,
          })),
        });
      }

      // -----------------------------------------------------------------------
      // Disputes
      // -----------------------------------------------------------------------

      await tx.journeyCompletionDispute.deleteMany({
        where: {
          completionId,
        },
      });

      if (persistence.disputes.length > 0) {
        await tx.journeyCompletionDispute.createMany({
          data: persistence.disputes.map((dispute) => ({
            id: dispute.id,
            publicId: dispute.publicId,

            completionId: dispute.completionId,

            raisedByPublicId: dispute.raisedByPublicId,

            reason: this.toPrismaJourneyCompletionDisputeReason(dispute.reason),

            description: dispute.description,

            status: this.toPrismaJourneyCompletionDisputeStatus(dispute.status),

            resolvedByPublicId: dispute.resolvedByPublicId,

            resolutionSummary: dispute.resolutionSummary,

            openedAt: dispute.openedAt,

            resolvedAt: dispute.resolvedAt,

            rejectedAt: dispute.rejectedAt,

            withdrawnAt: dispute.withdrawnAt,

            createdAt: dispute.createdAt,

            updatedAt: dispute.updatedAt,
          })),
        });
      }
    });
  }

  // ===========================================================================
  // Aggregate Lookup
  // ===========================================================================

  public async findById(
    id: JourneyCompletionId,
  ): Promise<JourneyCompletionAggregate | null> {
    const record = await this.prisma.journeyCompletion.findUnique({
      where: {
        id: id.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByPublicId(
    publicId: JourneyCompletionPublicId,
  ): Promise<JourneyCompletionAggregate | null> {
    const record = await this.prisma.journeyCompletion.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds and rehydrates the Journey Completion aggregate that owns a
   * particular dispute.
   *
   * The dispute public ID is unique at the persistence level, but the
   * returned object is the owning Journey Completion aggregate.
   *
   * The aggregate root and all aggregate-owned confirmations and disputes
   * are loaded together so the domain receives a complete aggregate
   * boundary.
   */
  public async findByDisputePublicId(
    disputePublicId: JourneyCompletionDisputePublicId,
  ): Promise<JourneyCompletionAggregate | null> {
    const record = await this.prisma.journeyCompletionDispute.findUnique({
      where: {
        publicId: disputePublicId.value,
      },

      include: {
        completion: {
          include: this.include,
        },
      },
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record.completion);
  }

  // ===========================================================================
  // Delete / Exists
  // ===========================================================================

  public async delete(id: JourneyCompletionId): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Aggregate-owned disputes
      // -----------------------------------------------------------------------

      await tx.journeyCompletionDispute.deleteMany({
        where: {
          completionId: id.value,
        },
      });

      // -----------------------------------------------------------------------
      // Aggregate-owned confirmations
      // -----------------------------------------------------------------------

      await tx.journeyCompletionConfirmation.deleteMany({
        where: {
          completionId: id.value,
        },
      });

      // -----------------------------------------------------------------------
      // Root
      // -----------------------------------------------------------------------

      await tx.journeyCompletion.delete({
        where: {
          id: id.value,
        },
      });
    });
  }

  public async exists(id: JourneyCompletionId): Promise<boolean> {
    return (
      (await this.prisma.journeyCompletion.count({
        where: {
          id: id.value,
        },
      })) > 0
    );
  }

  public async existsByPublicId(
    publicId: JourneyCompletionPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyCompletion.count({
        where: {
          publicId: publicId.value,
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Root Journey Completion Queries
  // ===========================================================================

  public async findJourneyCompletionById(
    id: JourneyCompletionId,
  ): Promise<JourneyCompletionEntity | null> {
    const record = await this.prisma.journeyCompletion.findUnique({
      where: {
        id: id.value,
      },
    });

    return record === null
      ? null
      : JourneyCompletionPrismaMapper.completionToDomain(record);
  }

  public async findJourneyCompletionByPublicId(
    publicId: JourneyCompletionPublicId,
  ): Promise<JourneyCompletionEntity | null> {
    const record = await this.prisma.journeyCompletion.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : JourneyCompletionPrismaMapper.completionToDomain(record);
  }

  public async findJourneyCompletions(): Promise<JourneyCompletionEntity[]> {
    const records = await this.prisma.journeyCompletion.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.completionToDomain(record),
    );
  }

  public async findJourneyCompletionByJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): Promise<JourneyCompletionEntity | null> {
    const record = await this.prisma.journeyCompletion.findFirst({
      where: {
        journeyPublicId: journeyPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return record === null
      ? null
      : JourneyCompletionPrismaMapper.completionToDomain(record);
  }

  public async existsByJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyCompletion.count({
        where: {
          journeyPublicId: journeyPublicId.value,
        },
      })) > 0
    );
  }

  public async findJourneyCompletionsByProviderPublicId(
    providerPublicId: JourneyCompletionProviderPublicId,
  ): Promise<JourneyCompletionEntity[]> {
    const records = await this.prisma.journeyCompletion.findMany({
      where: {
        providerPublicId: providerPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.completionToDomain(record),
    );
  }

  public async findJourneyCompletionsByStatus(
    status: JourneyCompletionStatus,
  ): Promise<JourneyCompletionEntity[]> {
    const records = await this.prisma.journeyCompletion.findMany({
      where: {
        status: this.toPrismaJourneyCompletionStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.completionToDomain(record),
    );
  }

  public async findJourneyCompletionsByProviderAndStatus(
    providerPublicId: JourneyCompletionProviderPublicId,
    status: JourneyCompletionStatus,
  ): Promise<JourneyCompletionEntity[]> {
    const records = await this.prisma.journeyCompletion.findMany({
      where: {
        providerPublicId: providerPublicId.value,

        status: this.toPrismaJourneyCompletionStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.completionToDomain(record),
    );
  }

  public async findJourneyCompletionsByJourneyAndStatus(
    journeyPublicId: JourneyCompletionJourneyPublicId,
    status: JourneyCompletionStatus,
  ): Promise<JourneyCompletionEntity[]> {
    const records = await this.prisma.journeyCompletion.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,

        status: this.toPrismaJourneyCompletionStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.completionToDomain(record),
    );
  }

  // ===========================================================================
  // Completion Lifecycle Queries
  // ===========================================================================

  public async findConfirmationRequiredByJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): Promise<JourneyCompletionAggregate | null> {
    const record = await this.prisma.journeyCompletion.findFirst({
      where: {
        journeyPublicId: journeyPublicId.value,

        status: this.toPrismaJourneyCompletionStatus('CONFIRMATION_REQUIRED'),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async existsConfirmationRequiredByJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyCompletion.count({
        where: {
          journeyPublicId: journeyPublicId.value,

          status: this.toPrismaJourneyCompletionStatus('CONFIRMATION_REQUIRED'),
        },
      })) > 0
    );
  }

  public async findConfirmationRequiredCompletions(): Promise<
    JourneyCompletionEntity[]
  > {
    return this.findJourneyCompletionsByStatus(
      this.toJourneyCompletionStatus('CONFIRMATION_REQUIRED'),
    );
  }

  public async findConfirmedCompletions(): Promise<JourneyCompletionEntity[]> {
    return this.findJourneyCompletionsByStatus(
      this.toJourneyCompletionStatus('CONFIRMED'),
    );
  }

  public async findDisputedCompletions(): Promise<JourneyCompletionEntity[]> {
    return this.findJourneyCompletionsByStatus(
      this.toJourneyCompletionStatus('DISPUTED'),
    );
  }

  public async findCancelledCompletions(): Promise<JourneyCompletionEntity[]> {
    return this.findJourneyCompletionsByStatus(
      this.toJourneyCompletionStatus('CANCELLED'),
    );
  }

  public async existsByStatus(
    status: JourneyCompletionStatus,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyCompletion.count({
        where: {
          status: this.toPrismaJourneyCompletionStatus(status.value),
        },
      })) > 0
    );
  }

  public async countByStatus(status: JourneyCompletionStatus): Promise<number> {
    return this.prisma.journeyCompletion.count({
      where: {
        status: this.toPrismaJourneyCompletionStatus(status.value),
      },
    });
  }

  // ===========================================================================
  // Confirmation Queries
  // ===========================================================================

  /**
   * Resolves the owning completion public identity required by the
   * confirmation mapper.
   */
  private async getCompletionPublicId(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<JourneyCompletionPublicId | null> {
    const completion = await this.prisma.journeyCompletion.findUnique({
      where: {
        id: journeyCompletionId.value,
      },

      select: {
        publicId: true,
      },
    });

    return completion === null
      ? null
      : new JourneyCompletionPublicId(completion.publicId);
  }

  public async findConfirmationById(
    id: UniqueEntityId,
  ): Promise<JourneyCompletionConfirmationEntity | null> {
    const record = await this.prisma.journeyCompletionConfirmation.findUnique({
      where: {
        id: id.value,
      },
    });

    if (record === null) {
      return null;
    }

    const completionPublicId = await this.getCompletionPublicId(
      new UniqueEntityId(record.completionId),
    );

    return completionPublicId === null
      ? null
      : JourneyCompletionPrismaMapper.toConfirmationDomain(
          record,
          completionPublicId,
        );
  }

  public async findConfirmationByPublicId(
    journeyCompletionId: JourneyCompletionId,
    confirmationPublicId: JourneyCompletionConfirmationPublicId,
  ): Promise<JourneyCompletionConfirmationEntity | null> {
    const record = await this.prisma.journeyCompletionConfirmation.findFirst({
      where: {
        completionId: journeyCompletionId.value,
        publicId: confirmationPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    const completionPublicId =
      await this.getCompletionPublicId(journeyCompletionId);

    return completionPublicId === null
      ? null
      : JourneyCompletionPrismaMapper.toConfirmationDomain(
          record,
          completionPublicId,
        );
  }

  public async findConfirmationByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
    confirmationPublicId: JourneyCompletionConfirmationPublicId,
  ): Promise<JourneyCompletionConfirmationEntity | null> {
    const record = await this.prisma.journeyCompletionConfirmation.findFirst({
      where: {
        publicId: confirmationPublicId.value,

        completion: {
          publicId: completionPublicId.value,
        },
      },
    });

    return record === null
      ? null
      : JourneyCompletionPrismaMapper.toConfirmationDomain(
          record,
          completionPublicId,
        );
  }

  public async findConfirmationByMemberPublicId(
    journeyCompletionId: JourneyCompletionId,
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<JourneyCompletionConfirmationEntity | null> {
    const record = await this.prisma.journeyCompletionConfirmation.findFirst({
      where: {
        completionId: journeyCompletionId.value,
        memberPublicId: memberPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    const completionPublicId =
      await this.getCompletionPublicId(journeyCompletionId);

    return completionPublicId === null
      ? null
      : JourneyCompletionPrismaMapper.toConfirmationDomain(
          record,
          completionPublicId,
        );
  }

  public async findConfirmationByBookingPublicId(
    journeyCompletionId: JourneyCompletionId,
    bookingPublicId: JourneyCompletionBookingPublicId,
  ): Promise<JourneyCompletionConfirmationEntity | null> {
    const record = await this.prisma.journeyCompletionConfirmation.findFirst({
      where: {
        completionId: journeyCompletionId.value,
        bookingPublicId: bookingPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    const completionPublicId =
      await this.getCompletionPublicId(journeyCompletionId);

    return completionPublicId === null
      ? null
      : JourneyCompletionPrismaMapper.toConfirmationDomain(
          record,
          completionPublicId,
        );
  }

  public async findConfirmations(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    const completionPublicId =
      await this.getCompletionPublicId(journeyCompletionId);

    if (completionPublicId === null) {
      return [];
    }

    const records = await this.prisma.journeyCompletionConfirmation.findMany({
      where: {
        completionId: journeyCompletionId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.toConfirmationDomain(
        record,
        completionPublicId,
      ),
    );
  }

  public async findConfirmationsByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    const records = await this.prisma.journeyCompletionConfirmation.findMany({
      where: {
        completion: {
          publicId: completionPublicId.value,
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.toConfirmationDomain(
        record,
        completionPublicId,
      ),
    );
  }

  public async findConfirmationsByRole(
    journeyCompletionId: JourneyCompletionId,
    role: JourneyCompletionConfirmationRole,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    return this.findConfirmationsByConfirmationFilter(journeyCompletionId, {
      role: this.toPrismaJourneyCompletionConfirmationRole(role.value),
    });
  }

  public async findConfirmationsByStatus(
    journeyCompletionId: JourneyCompletionId,
    status: JourneyCompletionConfirmationStatus,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    return this.findConfirmationsByConfirmationFilter(journeyCompletionId, {
      status: this.toPrismaJourneyCompletionConfirmationStatus(status.value),
    });
  }

  private async findConfirmationsByConfirmationFilter(
    journeyCompletionId: JourneyCompletionId,
    filter: Prisma.JourneyCompletionConfirmationWhereInput,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    const completionPublicId =
      await this.getCompletionPublicId(journeyCompletionId);

    if (completionPublicId === null) {
      return [];
    }

    const records = await this.prisma.journeyCompletionConfirmation.findMany({
      where: {
        ...filter,
        completionId: journeyCompletionId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.toConfirmationDomain(
        record,
        completionPublicId,
      ),
    );
  }

  public async findConfirmationsByMemberPublicId(
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    const records = await this.prisma.journeyCompletionConfirmation.findMany({
      where: {
        memberPublicId: memberPublicId.value,
      },

      include: {
        completion: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.toConfirmationDomain(
        record,
        new JourneyCompletionPublicId(record.completion.publicId),
      ),
    );
  }

  public async findConfirmationsByBookingPublicId(
    bookingPublicId: JourneyCompletionBookingPublicId,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    const records = await this.prisma.journeyCompletionConfirmation.findMany({
      where: {
        bookingPublicId: bookingPublicId.value,
      },

      include: {
        completion: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.toConfirmationDomain(
        record,
        new JourneyCompletionPublicId(record.completion.publicId),
      ),
    );
  }

  public async existsConfirmation(
    journeyCompletionId: JourneyCompletionId,
    confirmationPublicId: JourneyCompletionConfirmationPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyCompletionConfirmation.count({
        where: {
          completionId: journeyCompletionId.value,
          publicId: confirmationPublicId.value,
        },
      })) > 0
    );
  }

  public async existsConfirmationByMemberPublicId(
    journeyCompletionId: JourneyCompletionId,
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyCompletionConfirmation.count({
        where: {
          completionId: journeyCompletionId.value,
          memberPublicId: memberPublicId.value,
        },
      })) > 0
    );
  }

  public async existsConfirmationByBookingPublicId(
    journeyCompletionId: JourneyCompletionId,
    bookingPublicId: JourneyCompletionBookingPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyCompletionConfirmation.count({
        where: {
          completionId: journeyCompletionId.value,
          bookingPublicId: bookingPublicId.value,
        },
      })) > 0
    );
  }

  public async countConfirmations(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<number> {
    return this.prisma.journeyCompletionConfirmation.count({
      where: {
        completionId: journeyCompletionId.value,
      },
    });
  }

  public async countConfirmedConfirmations(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<number> {
    return this.prisma.journeyCompletionConfirmation.count({
      where: {
        completionId: journeyCompletionId.value,

        status: this.toPrismaJourneyCompletionConfirmationStatus('CONFIRMED'),
      },
    });
  }

  public async countWithdrawnConfirmations(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<number> {
    return this.prisma.journeyCompletionConfirmation.count({
      where: {
        completionId: journeyCompletionId.value,

        status: this.toPrismaJourneyCompletionConfirmationStatus('WITHDRAWN'),
      },
    });
  }

  public async hasRequiredConfirmations(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<boolean> {
    const completion = await this.prisma.journeyCompletion.findUnique({
      where: {
        id: journeyCompletionId.value,
      },

      select: {
        requiredConfirmations: true,
        confirmedCount: true,
      },
    });

    if (completion === null) {
      return false;
    }

    return completion.confirmedCount >= completion.requiredConfirmations;
  }

  // ===========================================================================
  // Confirmation State Queries
  // ===========================================================================

  public async findConfirmedConfirmations(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    return this.findConfirmationsByStatus(
      journeyCompletionId,
      this.toJourneyCompletionConfirmationStatus('CONFIRMED'),
    );
  }

  public async findWithdrawnConfirmations(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    return this.findConfirmationsByStatus(
      journeyCompletionId,
      this.toJourneyCompletionConfirmationStatus('WITHDRAWN'),
    );
  }

  public async findProviderConfirmation(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<JourneyCompletionConfirmationEntity | null> {
    const record = await this.prisma.journeyCompletionConfirmation.findFirst({
      where: {
        completionId: journeyCompletionId.value,

        role: this.toPrismaJourneyCompletionConfirmationRole('PROVIDER'),
      },
    });

    if (record === null) {
      return null;
    }

    const completionPublicId =
      await this.getCompletionPublicId(journeyCompletionId);

    return completionPublicId === null
      ? null
      : JourneyCompletionPrismaMapper.toConfirmationDomain(
          record,
          completionPublicId,
        );
  }

  public async findPassengerConfirmations(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    return this.findConfirmationsByRole(
      journeyCompletionId,
      this.toJourneyCompletionConfirmationRole('PASSENGER'),
    );
  }

  public async existsActiveConfirmationByMemberPublicId(
    journeyCompletionId: JourneyCompletionId,
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyCompletionConfirmation.count({
        where: {
          completionId: journeyCompletionId.value,

          memberPublicId: memberPublicId.value,

          status: this.toPrismaJourneyCompletionConfirmationStatus('CONFIRMED'),
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Dispute Queries
  // ===========================================================================

  public async findDisputeById(
    id: UniqueEntityId,
  ): Promise<JourneyCompletionDisputeEntity | null> {
    const record = await this.prisma.journeyCompletionDispute.findUnique({
      where: {
        id: id.value,
      },
    });

    if (record === null) {
      return null;
    }

    const completionPublicId = await this.getCompletionPublicId(
      new UniqueEntityId(record.completionId),
    );

    return completionPublicId === null
      ? null
      : JourneyCompletionPrismaMapper.toDisputeDomain(
          record,
          completionPublicId,
        );
  }

  public async findDisputeByPublicId(
    journeyCompletionId: JourneyCompletionId,
    disputePublicId: JourneyCompletionDisputePublicId,
  ): Promise<JourneyCompletionDisputeEntity | null> {
    const record = await this.prisma.journeyCompletionDispute.findFirst({
      where: {
        completionId: journeyCompletionId.value,
        publicId: disputePublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    const completionPublicId =
      await this.getCompletionPublicId(journeyCompletionId);

    return completionPublicId === null
      ? null
      : JourneyCompletionPrismaMapper.toDisputeDomain(
          record,
          completionPublicId,
        );
  }

  public async findDisputeByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
    disputePublicId: JourneyCompletionDisputePublicId,
  ): Promise<JourneyCompletionDisputeEntity | null> {
    const record = await this.prisma.journeyCompletionDispute.findFirst({
      where: {
        publicId: disputePublicId.value,

        completion: {
          publicId: completionPublicId.value,
        },
      },
    });

    return record === null
      ? null
      : JourneyCompletionPrismaMapper.toDisputeDomain(
          record,
          completionPublicId,
        );
  }

  public async findDisputes(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<JourneyCompletionDisputeEntity[]> {
    const completionPublicId =
      await this.getCompletionPublicId(journeyCompletionId);

    if (completionPublicId === null) {
      return [];
    }

    const records = await this.prisma.journeyCompletionDispute.findMany({
      where: {
        completionId: journeyCompletionId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.toDisputeDomain(record, completionPublicId),
    );
  }

  public async findDisputesByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
  ): Promise<JourneyCompletionDisputeEntity[]> {
    const records = await this.prisma.journeyCompletionDispute.findMany({
      where: {
        completion: {
          publicId: completionPublicId.value,
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.toDisputeDomain(record, completionPublicId),
    );
  }

  public async findDisputesByRaisedByPublicId(
    journeyCompletionId: JourneyCompletionId,
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<JourneyCompletionDisputeEntity[]> {
    const completionPublicId =
      await this.getCompletionPublicId(journeyCompletionId);

    if (completionPublicId === null) {
      return [];
    }

    const records = await this.prisma.journeyCompletionDispute.findMany({
      where: {
        completionId: journeyCompletionId.value,
        raisedByPublicId: memberPublicId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.toDisputeDomain(record, completionPublicId),
    );
  }

  public async findDisputesByStatus(
    journeyCompletionId: JourneyCompletionId,
    status: JourneyCompletionDisputeStatus,
  ): Promise<JourneyCompletionDisputeEntity[]> {
    return this.findDisputesByDisputeFilter(journeyCompletionId, {
      status: this.toPrismaJourneyCompletionDisputeStatus(status.value),
    });
  }

  public async findDisputesByReason(
    journeyCompletionId: JourneyCompletionId,
    reason: JourneyCompletionDisputeReason,
  ): Promise<JourneyCompletionDisputeEntity[]> {
    return this.findDisputesByDisputeFilter(journeyCompletionId, {
      reason: this.toPrismaJourneyCompletionDisputeReason(reason.value),
    });
  }

  private async findDisputesByDisputeFilter(
    journeyCompletionId: JourneyCompletionId,
    filter: Prisma.JourneyCompletionDisputeWhereInput,
  ): Promise<JourneyCompletionDisputeEntity[]> {
    const completionPublicId =
      await this.getCompletionPublicId(journeyCompletionId);

    if (completionPublicId === null) {
      return [];
    }

    const records = await this.prisma.journeyCompletionDispute.findMany({
      where: {
        ...filter,
        completionId: journeyCompletionId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.toDisputeDomain(record, completionPublicId),
    );
  }

  public async findDisputesByMemberPublicId(
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<JourneyCompletionDisputeEntity[]> {
    const records = await this.prisma.journeyCompletionDispute.findMany({
      where: {
        raisedByPublicId: memberPublicId.value,
      },

      include: {
        completion: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.toDisputeDomain(
        record,
        new JourneyCompletionPublicId(record.completion.publicId),
      ),
    );
  }

  public async existsDispute(
    journeyCompletionId: JourneyCompletionId,
    disputePublicId: JourneyCompletionDisputePublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyCompletionDispute.count({
        where: {
          completionId: journeyCompletionId.value,
          publicId: disputePublicId.value,
        },
      })) > 0
    );
  }

  public async countDisputes(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<number> {
    return this.prisma.journeyCompletionDispute.count({
      where: {
        completionId: journeyCompletionId.value,
      },
    });
  }

  public async countDisputesByStatus(
    journeyCompletionId: JourneyCompletionId,
    status: JourneyCompletionDisputeStatus,
  ): Promise<number> {
    return this.prisma.journeyCompletionDispute.count({
      where: {
        completionId: journeyCompletionId.value,

        status: this.toPrismaJourneyCompletionDisputeStatus(status.value),
      },
    });
  }

  public async hasActiveDispute(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<boolean> {
    return (
      (await this.prisma.journeyCompletionDispute.count({
        where: {
          completionId: journeyCompletionId.value,

          status: {
            in: [
              this.toPrismaJourneyCompletionDisputeStatus('OPEN'),
              this.toPrismaJourneyCompletionDisputeStatus('UNDER_REVIEW'),
            ],
          },
        },
      })) > 0
    );
  }

  public async findActiveDisputes(
    journeyCompletionId: JourneyCompletionId,
  ): Promise<JourneyCompletionDisputeEntity[]> {
    const completionPublicId =
      await this.getCompletionPublicId(journeyCompletionId);

    if (completionPublicId === null) {
      return [];
    }

    const records = await this.prisma.journeyCompletionDispute.findMany({
      where: {
        completionId: journeyCompletionId.value,

        status: {
          in: [
            this.toPrismaJourneyCompletionDisputeStatus('OPEN'),
            this.toPrismaJourneyCompletionDisputeStatus('UNDER_REVIEW'),
          ],
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      JourneyCompletionPrismaMapper.toDisputeDomain(record, completionPublicId),
    );
  }

  // ===========================================================================
  // Aggregate Reconstruction
  // ===========================================================================

  private toAggregate(
    record: JourneyCompletionWithComponents,
  ): JourneyCompletionAggregate {
    return JourneyCompletionPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Domain Value-Object Factories
  // ===========================================================================
  //
  // These helpers keep the repository implementation independent from the
  // concrete constructor/factory shape of the value objects.
  //
  // They are used only where the repository contract requires a VO but the
  // query itself starts from a persisted enum/string.
  //
  // ---------------------------------------------------------------------------

  private toJourneyCompletionStatus(value: string): JourneyCompletionStatus {
    return {
      value,
    } as JourneyCompletionStatus;
  }

  private toJourneyCompletionConfirmationRole(
    value: string,
  ): JourneyCompletionConfirmationRole {
    return {
      value,
    } as JourneyCompletionConfirmationRole;
  }

  private toJourneyCompletionConfirmationStatus(
    value: string,
  ): JourneyCompletionConfirmationStatus {
    return {
      value,
    } as JourneyCompletionConfirmationStatus;
  }
}

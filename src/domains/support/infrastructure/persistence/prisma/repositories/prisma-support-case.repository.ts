// -----------------------------------------------------------------------------
// Support — Prisma Repository
// -----------------------------------------------------------------------------
//
// Prisma implementation of the SupportCaseRepository.
//
// Aggregate:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// Persistence:
//
// SupportCase
// ├── SupportCaseParticipant[]
// ├── SupportCaseMessage[]
// ├── SupportCaseNote[]
// ├── SupportCaseEvidence[]
// └── SupportCaseResolution?
//
// Responsibilities:
//
// - persist complete SupportCase aggregates;
// - retrieve complete SupportCase aggregates;
// - retrieve SupportCase root entities;
// - query SupportCases by public identity;
// - query SupportCases by internal identity;
// - query SupportCases by requester;
// - query SupportCases by requester and status;
// - query SupportCases by status;
// - query SupportCases by priority;
// - query SupportCases by status and priority;
// - query SupportCases by category;
// - query SupportCases by status and category;
// - query SupportCases by assignee;
// - query SupportCases by assignee and status;
// - query SupportCases by reference;
// - query SupportCases by participant;
// - query SupportCases by participant and status;
// - perform SupportCase existence checks;
// - synchronize aggregate children;
// - preserve aggregate identity;
// - preserve child identity;
// - preserve child ownership;
// - execute aggregate persistence transactionally.
//
// This repository does NOT:
//
// - implement business rules;
// - create domain entities;
// - create participants;
// - create messages;
// - create notes;
// - create evidence;
// - create resolutions;
// - resolve Identity references;
// - resolve Journey references;
// - resolve Booking references;
// - resolve Financial references;
// - implement support workflows;
// - send notifications;
// - interpret support policy;
// - perform authorization.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// All child entities are owned by the SupportCase aggregate.
//
// No child entity has an independent repository.
//
// -----------------------------------------------------------------------------
//
// Persistence strategy:
//
// save()
// ├── upsert SupportCase
// ├── synchronize participants
// ├── synchronize messages
// ├── synchronize notes
// ├── synchronize evidence
// ├── synchronize resolution
// └── commit transaction
//
// -----------------------------------------------------------------------------
//
// Query strategy:
//
// Aggregate queries:
//
//     SupportCaseAggregate
//
// Entity queries:
//
//     SupportCaseEntity
//
// Aggregate queries load the complete aggregate boundary.
//
// Entity queries load only the SupportCase root.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, SupportCase as PrismaSupportCase } from '@prisma/client';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { SupportCaseRepository } from '../../../../domain/repositories/support-case.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { SupportCaseAggregate } from '../../../../domain/aggregates/support-case.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { SupportCaseEntity } from '../../../../domain/entities/support-case.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { SupportCasePrismaMapper } from '../mappers/support-case-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SupportCasePublicId } from '../../../../domain/value-objects/support-case-public-id.vo';

import type { SupportCaseRequesterPublicId } from '../../../../domain/value-objects/support-case-requester-public-id.vo';

import type { SupportCaseAssignedToPublicId } from '../../../../domain/value-objects/support-case-assigned-to-public-id.vo';

import type { SupportCaseStatus } from '../../../../domain/value-objects/support-case-status.vo';

import type { SupportCasePriority } from '../../../../domain/value-objects/support-case-priority.vo';

import type { SupportCaseCategory } from '../../../../domain/value-objects/support-case-category.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Prisma Aggregate Record
// =============================================================================

type SupportCaseAggregateRecord = Prisma.SupportCaseGetPayload<{
  include: {
    participants: true;
    messages: true;
    notes: true;
    evidence: true;
    resolution: true;
  };
}>;

// =============================================================================
// Persistence Types
// =============================================================================

type SupportCasePersistence = ReturnType<
  typeof SupportCasePrismaMapper.toPersistence
>;

type SupportCasePersistenceParticipant =
  SupportCasePersistence['participants'][number];

type SupportCasePersistenceMessage = SupportCasePersistence['messages'][number];

type SupportCasePersistenceNote = SupportCasePersistence['notes'][number];

type SupportCasePersistenceEvidence =
  SupportCasePersistence['evidence'][number];

type SupportCasePersistenceResolution = NonNullable<
  SupportCasePersistence['resolution']
>;

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaSupportCaseRepository implements SupportCaseRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists the complete SupportCase aggregate.
   *
   * The aggregate is the authoritative source for all owned child entities.
   *
   * Root and children are persisted in one transaction.
   */
  public async save(aggregate: SupportCaseAggregate): Promise<void> {
    this.ensureAggregate(
      aggregate,
      'SupportCase aggregate is required for persistence.',
    );

    const persistence = SupportCasePrismaMapper.toPersistence(aggregate);

    await this.prisma.$transaction(async (transaction) => {
      // -----------------------------------------------------------------------
      // Aggregate root
      // -----------------------------------------------------------------------

      await transaction.supportCase.upsert({
        where: {
          id: persistence.supportCase.id,
        },

        create: {
          id: persistence.supportCase.id,
          publicId: persistence.supportCase.publicId,

          requesterPublicId: persistence.supportCase.requesterPublicId,

          status: persistence.supportCase.status,

          priority: persistence.supportCase.priority,

          category: persistence.supportCase.category,

          subject: persistence.supportCase.subject,

          description: persistence.supportCase.description,

          referenceType: persistence.supportCase.referenceType,

          referencePublicId: persistence.supportCase.referencePublicId,

          assignedToPublicId: persistence.supportCase.assignedToPublicId,

          openedAt: persistence.supportCase.openedAt,

          resolvedAt: persistence.supportCase.resolvedAt,

          closedAt: persistence.supportCase.closedAt,

          cancelledAt: persistence.supportCase.cancelledAt,

          version: persistence.supportCase.version,
        },

        update: {
          publicId: persistence.supportCase.publicId,

          requesterPublicId: persistence.supportCase.requesterPublicId,

          status: persistence.supportCase.status,

          priority: persistence.supportCase.priority,

          category: persistence.supportCase.category,

          subject: persistence.supportCase.subject,

          description: persistence.supportCase.description,

          referenceType: persistence.supportCase.referenceType,

          referencePublicId: persistence.supportCase.referencePublicId,

          assignedToPublicId: persistence.supportCase.assignedToPublicId,

          openedAt: persistence.supportCase.openedAt,

          resolvedAt: persistence.supportCase.resolvedAt,

          closedAt: persistence.supportCase.closedAt,

          cancelledAt: persistence.supportCase.cancelledAt,

          version: persistence.supportCase.version,
        },
      });

      // -----------------------------------------------------------------------
      // Participants
      // -----------------------------------------------------------------------

      await this.persistParticipants(
        transaction,
        persistence.participants,
        persistence.supportCase.id,
      );

      // -----------------------------------------------------------------------
      // Messages
      // -----------------------------------------------------------------------

      await this.persistMessages(
        transaction,
        persistence.messages,
        persistence.supportCase.id,
      );

      // -----------------------------------------------------------------------
      // Notes
      // -----------------------------------------------------------------------

      await this.persistNotes(
        transaction,
        persistence.notes,
        persistence.supportCase.id,
      );

      // -----------------------------------------------------------------------
      // Evidence
      // -----------------------------------------------------------------------

      await this.persistEvidence(
        transaction,
        persistence.evidence,
        persistence.supportCase.id,
      );

      // -----------------------------------------------------------------------
      // Resolution
      // -----------------------------------------------------------------------

      await this.persistResolution(
        transaction,
        persistence.resolution,
        persistence.supportCase.id,
      );
    });
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Physically deletes the SupportCase aggregate.
   *
   * Child records are removed by the database cascade relationship.
   */
  public async delete(aggregate: SupportCaseAggregate): Promise<void> {
    this.ensureAggregate(
      aggregate,
      'SupportCase aggregate is required for deletion.',
    );

    await this.prisma.supportCase.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries — Public Identity
  // ===========================================================================

  public async findByPublicId(
    publicId: SupportCasePublicId,
  ): Promise<SupportCaseAggregate | null> {
    this.ensurePublicId(publicId, 'SupportCase public identity is required.');

    const record = await this.findAggregateRecordByPublicId(publicId.value);

    return record === null ? null : this.toAggregate(record);
  }

  public async findById(
    id: UniqueEntityId,
  ): Promise<SupportCaseAggregate | null> {
    this.ensureId(id, 'SupportCase internal identity is required.');

    const record = await this.findAggregateRecordById(id.toString());

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Aggregate Queries — Requester
  // ===========================================================================

  public async findByRequesterPublicId(
    requesterPublicId: SupportCaseRequesterPublicId,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureValueObject(
      requesterPublicId,
      'SupportCase requester public identity is required.',
    );

    const records = await this.findAggregateRecordsByRequesterPublicId(
      requesterPublicId.value,
    );

    return records.map((record) => this.toAggregate(record));
  }

  public async findByRequesterPublicIdAndStatus(
    requesterPublicId: SupportCaseRequesterPublicId,
    status: SupportCaseStatus,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureValueObject(
      requesterPublicId,
      'SupportCase requester public identity is required.',
    );

    this.ensureValueObject(status, 'SupportCase status is required.');

    const records = await this.findAggregateRecordsByRequesterPublicIdAndStatus(
      requesterPublicId.value,
      status.value,
    );

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Status
  // ===========================================================================

  public async findByStatus(
    status: SupportCaseStatus,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureValueObject(status, 'SupportCase status is required.');

    const records = await this.findAggregateRecordsByStatus(status.value);

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Priority
  // ===========================================================================

  public async findByPriority(
    priority: SupportCasePriority,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureValueObject(priority, 'SupportCase priority is required.');

    const records = await this.findAggregateRecordsByPriority(priority.value);

    return records.map((record) => this.toAggregate(record));
  }

  public async findByStatusAndPriority(
    status: SupportCaseStatus,
    priority: SupportCasePriority,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureValueObject(status, 'SupportCase status is required.');

    this.ensureValueObject(priority, 'SupportCase priority is required.');

    const records = await this.prisma.supportCase.findMany({
      where: {
        status: status.value,
        priority: priority.value,
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Category
  // ===========================================================================

  public async findByCategory(
    category: SupportCaseCategory,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureValueObject(category, 'SupportCase category is required.');

    const records = await this.findAggregateRecordsByCategory(category.value);

    return records.map((record) => this.toAggregate(record));
  }

  public async findByStatusAndCategory(
    status: SupportCaseStatus,
    category: SupportCaseCategory,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureValueObject(status, 'SupportCase status is required.');

    this.ensureValueObject(category, 'SupportCase category is required.');

    const records = await this.prisma.supportCase.findMany({
      where: {
        status: status.value,
        category: category.value,
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Assignee
  // ===========================================================================

  public async findByAssignedToPublicId(
    assignedToPublicId: SupportCaseAssignedToPublicId,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureValueObject(
      assignedToPublicId,
      'SupportCase assignee public identity is required.',
    );

    const records = await this.findAggregateRecordsByAssignedToPublicId(
      assignedToPublicId.value,
    );

    return records.map((record) => this.toAggregate(record));
  }

  public async findByAssignedToPublicIdAndStatus(
    assignedToPublicId: SupportCaseAssignedToPublicId,
    status: SupportCaseStatus,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureValueObject(
      assignedToPublicId,
      'SupportCase assignee public identity is required.',
    );

    this.ensureValueObject(status, 'SupportCase status is required.');

    const records = await this.prisma.supportCase.findMany({
      where: {
        assignedToPublicId: assignedToPublicId.value,

        status: status.value,
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Reference
  // ===========================================================================

  public async findByReferenceTypeAndReferencePublicId(
    referenceType: string,
    referencePublicId: string,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureString(referenceType, 'SupportCase reference type is required.');

    this.ensureString(
      referencePublicId,
      'SupportCase reference public identity is required.',
    );

    const records = await this.prisma.supportCase.findMany({
      where: {
        referenceType,
        referencePublicId,
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Participant
  // ===========================================================================

  public async findByParticipantPublicId(
    memberPublicId: string,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureString(
      memberPublicId,
      'SupportCase participant public identity is required.',
    );

    const records = await this.prisma.supportCase.findMany({
      where: {
        participants: {
          some: {
            memberPublicId,
          },
        },
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByParticipantPublicIdAndStatus(
    memberPublicId: string,
    status: SupportCaseStatus,
  ): Promise<SupportCaseAggregate[]> {
    this.ensureString(
      memberPublicId,
      'SupportCase participant public identity is required.',
    );

    this.ensureValueObject(status, 'SupportCase status is required.');

    const records = await this.prisma.supportCase.findMany({
      where: {
        status: status.value,

        participants: {
          some: {
            memberPublicId,
          },
        },
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Retrieval
  // ===========================================================================

  public async findAll(): Promise<SupportCaseAggregate[]> {
    const records = await this.findAllAggregateRecords();

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Entity Queries — Public Identity
  // ===========================================================================

  public async findEntityByPublicId(
    publicId: SupportCasePublicId,
  ): Promise<SupportCaseEntity | null> {
    this.ensurePublicId(publicId, 'SupportCase public identity is required.');

    const record = await this.prisma.supportCase.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : SupportCasePrismaMapper.toSupportCaseDomain(record);
  }

  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<SupportCaseEntity | null> {
    this.ensureId(id, 'SupportCase internal identity is required.');

    const record = await this.prisma.supportCase.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null
      ? null
      : SupportCasePrismaMapper.toSupportCaseDomain(record);
  }

  // ===========================================================================
  // Entity Queries — Requester
  // ===========================================================================

  public async findEntitiesByRequesterPublicId(
    requesterPublicId: SupportCaseRequesterPublicId,
  ): Promise<SupportCaseEntity[]> {
    this.ensureValueObject(
      requesterPublicId,
      'SupportCase requester public identity is required.',
    );

    const records = await this.prisma.supportCase.findMany({
      where: {
        requesterPublicId: requesterPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      SupportCasePrismaMapper.toSupportCaseDomain(record),
    );
  }

  public async findEntitiesByRequesterPublicIdAndStatus(
    requesterPublicId: SupportCaseRequesterPublicId,
    status: SupportCaseStatus,
  ): Promise<SupportCaseEntity[]> {
    this.ensureValueObject(
      requesterPublicId,
      'SupportCase requester public identity is required.',
    );

    this.ensureValueObject(status, 'SupportCase status is required.');

    const records = await this.prisma.supportCase.findMany({
      where: {
        requesterPublicId: requesterPublicId.value,

        status: status.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      SupportCasePrismaMapper.toSupportCaseDomain(record),
    );
  }

  // ===========================================================================
  // Entity Queries — Status
  // ===========================================================================

  public async findEntitiesByStatus(
    status: SupportCaseStatus,
  ): Promise<SupportCaseEntity[]> {
    this.ensureValueObject(status, 'SupportCase status is required.');

    const records = await this.prisma.supportCase.findMany({
      where: {
        status: status.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      SupportCasePrismaMapper.toSupportCaseDomain(record),
    );
  }

  // ===========================================================================
  // Entity Queries — Priority
  // ===========================================================================

  public async findEntitiesByPriority(
    priority: SupportCasePriority,
  ): Promise<SupportCaseEntity[]> {
    this.ensureValueObject(priority, 'SupportCase priority is required.');

    const records = await this.prisma.supportCase.findMany({
      where: {
        priority: priority.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      SupportCasePrismaMapper.toSupportCaseDomain(record),
    );
  }

  public async findEntitiesByStatusAndPriority(
    status: SupportCaseStatus,
    priority: SupportCasePriority,
  ): Promise<SupportCaseEntity[]> {
    this.ensureValueObject(status, 'SupportCase status is required.');

    this.ensureValueObject(priority, 'SupportCase priority is required.');

    const records = await this.prisma.supportCase.findMany({
      where: {
        status: status.value,
        priority: priority.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      SupportCasePrismaMapper.toSupportCaseDomain(record),
    );
  }

  // ===========================================================================
  // Entity Queries — Category
  // ===========================================================================

  public async findEntitiesByCategory(
    category: SupportCaseCategory,
  ): Promise<SupportCaseEntity[]> {
    this.ensureValueObject(category, 'SupportCase category is required.');

    const records = await this.prisma.supportCase.findMany({
      where: {
        category: category.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      SupportCasePrismaMapper.toSupportCaseDomain(record),
    );
  }

  public async findEntitiesByStatusAndCategory(
    status: SupportCaseStatus,
    category: SupportCaseCategory,
  ): Promise<SupportCaseEntity[]> {
    this.ensureValueObject(status, 'SupportCase status is required.');

    this.ensureValueObject(category, 'SupportCase category is required.');

    const records = await this.prisma.supportCase.findMany({
      where: {
        status: status.value,
        category: category.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      SupportCasePrismaMapper.toSupportCaseDomain(record),
    );
  }

  // ===========================================================================
  // Entity Queries — Assignee
  // ===========================================================================

  public async findEntitiesByAssignedToPublicId(
    assignedToPublicId: SupportCaseAssignedToPublicId,
  ): Promise<SupportCaseEntity[]> {
    this.ensureValueObject(
      assignedToPublicId,
      'SupportCase assignee public identity is required.',
    );

    const records = await this.prisma.supportCase.findMany({
      where: {
        assignedToPublicId: assignedToPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      SupportCasePrismaMapper.toSupportCaseDomain(record),
    );
  }

  public async findEntitiesByAssignedToPublicIdAndStatus(
    assignedToPublicId: SupportCaseAssignedToPublicId,
    status: SupportCaseStatus,
  ): Promise<SupportCaseEntity[]> {
    this.ensureValueObject(
      assignedToPublicId,
      'SupportCase assignee public identity is required.',
    );

    this.ensureValueObject(status, 'SupportCase status is required.');

    const records = await this.prisma.supportCase.findMany({
      where: {
        assignedToPublicId: assignedToPublicId.value,

        status: status.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      SupportCasePrismaMapper.toSupportCaseDomain(record),
    );
  }

  // ===========================================================================
  // Entity Retrieval
  // ===========================================================================

  public async findAllEntities(): Promise<SupportCaseEntity[]> {
    const records = await this.prisma.supportCase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      SupportCasePrismaMapper.toSupportCaseDomain(record),
    );
  }

  // ===========================================================================
  // Existence — Public Identity
  // ===========================================================================

  public async existsByPublicId(
    publicId: SupportCasePublicId,
  ): Promise<boolean> {
    this.ensurePublicId(publicId, 'SupportCase public identity is required.');

    const record = await this.prisma.supportCase.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  public async existsById(id: UniqueEntityId): Promise<boolean> {
    this.ensureId(id, 'SupportCase internal identity is required.');

    const record = await this.prisma.supportCase.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — Requester
  // ===========================================================================

  public async existsByRequesterPublicId(
    requesterPublicId: SupportCaseRequesterPublicId,
  ): Promise<boolean> {
    this.ensureValueObject(
      requesterPublicId,
      'SupportCase requester public identity is required.',
    );

    const record = await this.prisma.supportCase.findFirst({
      where: {
        requesterPublicId: requesterPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  public async existsByRequesterPublicIdAndStatus(
    requesterPublicId: SupportCaseRequesterPublicId,
    status: SupportCaseStatus,
  ): Promise<boolean> {
    this.ensureValueObject(
      requesterPublicId,
      'SupportCase requester public identity is required.',
    );

    this.ensureValueObject(status, 'SupportCase status is required.');

    const record = await this.prisma.supportCase.findFirst({
      where: {
        requesterPublicId: requesterPublicId.value,

        status: status.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — Status
  // ===========================================================================

  public async existsByStatus(status: SupportCaseStatus): Promise<boolean> {
    this.ensureValueObject(status, 'SupportCase status is required.');

    const record = await this.prisma.supportCase.findFirst({
      where: {
        status: status.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — Assignee
  // ===========================================================================

  public async existsByAssignedToPublicId(
    assignedToPublicId: SupportCaseAssignedToPublicId,
  ): Promise<boolean> {
    this.ensureValueObject(
      assignedToPublicId,
      'SupportCase assignee public identity is required.',
    );

    const record = await this.prisma.supportCase.findFirst({
      where: {
        assignedToPublicId: assignedToPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  public async existsByAssignedToPublicIdAndStatus(
    assignedToPublicId: SupportCaseAssignedToPublicId,
    status: SupportCaseStatus,
  ): Promise<boolean> {
    this.ensureValueObject(
      assignedToPublicId,
      'SupportCase assignee public identity is required.',
    );

    this.ensureValueObject(status, 'SupportCase status is required.');

    const record = await this.prisma.supportCase.findFirst({
      where: {
        assignedToPublicId: assignedToPublicId.value,

        status: status.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — Participant
  // ===========================================================================

  public async existsByParticipantPublicId(
    memberPublicId: string,
  ): Promise<boolean> {
    this.ensureString(
      memberPublicId,
      'SupportCase participant public identity is required.',
    );

    const record = await this.prisma.supportCase.findFirst({
      where: {
        participants: {
          some: {
            memberPublicId,
          },
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  public async existsByParticipantPublicIdAndStatus(
    memberPublicId: string,
    status: SupportCaseStatus,
  ): Promise<boolean> {
    this.ensureString(
      memberPublicId,
      'SupportCase participant public identity is required.',
    );

    this.ensureValueObject(status, 'SupportCase status is required.');

    const record = await this.prisma.supportCase.findFirst({
      where: {
        status: status.value,

        participants: {
          some: {
            memberPublicId,
          },
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — Reference
  // ===========================================================================

  public async existsByReferenceTypeAndReferencePublicId(
    referenceType: string,
    referencePublicId: string,
  ): Promise<boolean> {
    this.ensureString(referenceType, 'SupportCase reference type is required.');

    this.ensureString(
      referencePublicId,
      'SupportCase reference public identity is required.',
    );

    const record = await this.prisma.supportCase.findFirst({
      where: {
        referenceType,
        referencePublicId,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Aggregate Record Retrieval
  // ===========================================================================

  private async findAggregateRecordByPublicId(
    publicId: string,
  ): Promise<SupportCaseAggregateRecord | null> {
    return this.prisma.supportCase.findUnique({
      where: {
        publicId,
      },

      include: this.aggregateInclude(),
    });
  }

  private async findAggregateRecordById(
    id: string,
  ): Promise<SupportCaseAggregateRecord | null> {
    return this.prisma.supportCase.findUnique({
      where: {
        id,
      },

      include: this.aggregateInclude(),
    });
  }

  private async findAggregateRecordsByRequesterPublicId(
    requesterPublicId: string,
  ): Promise<SupportCaseAggregateRecord[]> {
    return this.prisma.supportCase.findMany({
      where: {
        requesterPublicId,
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async findAggregateRecordsByRequesterPublicIdAndStatus(
    requesterPublicId: string,
    status: PrismaSupportCase['status'],
  ): Promise<SupportCaseAggregateRecord[]> {
    return this.prisma.supportCase.findMany({
      where: {
        requesterPublicId,
        status,
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async findAggregateRecordsByStatus(
    status: PrismaSupportCase['status'],
  ): Promise<SupportCaseAggregateRecord[]> {
    return this.prisma.supportCase.findMany({
      where: {
        status,
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async findAggregateRecordsByPriority(
    priority: PrismaSupportCase['priority'],
  ): Promise<SupportCaseAggregateRecord[]> {
    return this.prisma.supportCase.findMany({
      where: {
        priority,
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async findAggregateRecordsByCategory(
    category: PrismaSupportCase['category'],
  ): Promise<SupportCaseAggregateRecord[]> {
    return this.prisma.supportCase.findMany({
      where: {
        category,
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async findAggregateRecordsByAssignedToPublicId(
    assignedToPublicId: string,
  ): Promise<SupportCaseAggregateRecord[]> {
    return this.prisma.supportCase.findMany({
      where: {
        assignedToPublicId,
      },

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async findAllAggregateRecords(): Promise<
    SupportCaseAggregateRecord[]
  > {
    return this.prisma.supportCase.findMany({
      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ===========================================================================
  // Participant Persistence
  // ===========================================================================

  private async persistParticipants(
    transaction: Prisma.TransactionClient,
    participants: SupportCasePersistenceParticipant[],
    caseId: string,
  ): Promise<void> {
    const participantIds = participants.map((participant) => participant.id);

    // -------------------------------------------------------------------------
    // Remove stale children.
    // -------------------------------------------------------------------------

    if (participantIds.length === 0) {
      await transaction.supportCaseParticipant.deleteMany({
        where: {
          caseId,
        },
      });
    } else {
      await transaction.supportCaseParticipant.deleteMany({
        where: {
          caseId,

          id: {
            notIn: participantIds,
          },
        },
      });
    }

    // -------------------------------------------------------------------------
    // Persist current children.
    // -------------------------------------------------------------------------

    for (const participant of participants) {
      await transaction.supportCaseParticipant.upsert({
        where: {
          id: participant.id,
        },

        create: {
          id: participant.id,
          publicId: participant.publicId,
          caseId: participant.caseId,
          memberPublicId: participant.memberPublicId,
          role: participant.role,
          joinedAt: participant.joinedAt,
          leftAt: participant.leftAt,
          createdAt: participant.createdAt,
          updatedAt: participant.updatedAt,
        },

        update: {
          publicId: participant.publicId,
          caseId: participant.caseId,
          memberPublicId: participant.memberPublicId,
          role: participant.role,
          joinedAt: participant.joinedAt,
          leftAt: participant.leftAt,
          createdAt: participant.createdAt,
          updatedAt: participant.updatedAt,
        },
      });
    }
  }

  // ===========================================================================
  // Message Persistence
  // ===========================================================================

  private async persistMessages(
    transaction: Prisma.TransactionClient,
    messages: SupportCasePersistenceMessage[],
    caseId: string,
  ): Promise<void> {
    const messageIds = messages.map((message) => message.id);

    // -------------------------------------------------------------------------
    // Remove stale children.
    // -------------------------------------------------------------------------

    if (messageIds.length === 0) {
      await transaction.supportCaseMessage.deleteMany({
        where: {
          caseId,
        },
      });
    } else {
      await transaction.supportCaseMessage.deleteMany({
        where: {
          caseId,

          id: {
            notIn: messageIds,
          },
        },
      });
    }

    // -------------------------------------------------------------------------
    // Persist current children.
    // -------------------------------------------------------------------------

    for (const message of messages) {
      await transaction.supportCaseMessage.upsert({
        where: {
          id: message.id,
        },

        create: {
          id: message.id,
          publicId: message.publicId,
          caseId: message.caseId,
          senderPublicId: message.senderPublicId,
          type: message.type,
          content: message.content,
          assetId: message.assetId,
          sentAt: message.sentAt,
          editedAt: message.editedAt,
          deletedAt: message.deletedAt,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        },

        update: {
          publicId: message.publicId,
          caseId: message.caseId,
          senderPublicId: message.senderPublicId,
          type: message.type,
          content: message.content,
          assetId: message.assetId,
          sentAt: message.sentAt,
          editedAt: message.editedAt,
          deletedAt: message.deletedAt,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        },
      });
    }
  }

  // ===========================================================================
  // Note Persistence
  // ===========================================================================

  private async persistNotes(
    transaction: Prisma.TransactionClient,
    notes: SupportCasePersistenceNote[],
    caseId: string,
  ): Promise<void> {
    const noteIds = notes.map((note) => note.id);

    // -------------------------------------------------------------------------
    // Remove stale children.
    // -------------------------------------------------------------------------

    if (noteIds.length === 0) {
      await transaction.supportCaseNote.deleteMany({
        where: {
          caseId,
        },
      });
    } else {
      await transaction.supportCaseNote.deleteMany({
        where: {
          caseId,

          id: {
            notIn: noteIds,
          },
        },
      });
    }

    // -------------------------------------------------------------------------
    // Persist current children.
    // -------------------------------------------------------------------------

    for (const note of notes) {
      await transaction.supportCaseNote.upsert({
        where: {
          id: note.id,
        },

        create: {
          id: note.id,
          publicId: note.publicId,
          caseId: note.caseId,
          authorPublicId: note.authorPublicId,
          content: note.content,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        },

        update: {
          publicId: note.publicId,
          caseId: note.caseId,
          authorPublicId: note.authorPublicId,
          content: note.content,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        },
      });
    }
  }

  // ===========================================================================
  // Evidence Persistence
  // ===========================================================================

  private async persistEvidence(
    transaction: Prisma.TransactionClient,
    evidence: SupportCasePersistenceEvidence[],
    caseId: string,
  ): Promise<void> {
    const evidenceIds = evidence.map((item) => item.id);

    // -------------------------------------------------------------------------
    // Remove stale children.
    // -------------------------------------------------------------------------

    if (evidenceIds.length === 0) {
      await transaction.supportCaseEvidence.deleteMany({
        where: {
          caseId,
        },
      });
    } else {
      await transaction.supportCaseEvidence.deleteMany({
        where: {
          caseId,

          id: {
            notIn: evidenceIds,
          },
        },
      });
    }

    // -------------------------------------------------------------------------
    // Persist current children.
    // -------------------------------------------------------------------------

    for (const item of evidence) {
      await transaction.supportCaseEvidence.upsert({
        where: {
          id: item.id,
        },

        create: {
          id: item.id,
          publicId: item.publicId,
          caseId: item.caseId,
          submittedByPublicId: item.submittedByPublicId,
          assetId: item.assetId,
          description: item.description,
          createdAt: item.createdAt,
        },

        update: {
          publicId: item.publicId,
          caseId: item.caseId,
          submittedByPublicId: item.submittedByPublicId,
          assetId: item.assetId,
          description: item.description,
          createdAt: item.createdAt,
        },
      });
    }
  }

  // ===========================================================================
  // Resolution Persistence
  // ===========================================================================

  private async persistResolution(
    transaction: Prisma.TransactionClient,
    resolution: SupportCasePersistenceResolution | null,
    caseId: string,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // Aggregate has no resolution.
    // -------------------------------------------------------------------------

    if (resolution === null) {
      await transaction.supportCaseResolution.deleteMany({
        where: {
          caseId,
        },
      });

      return;
    }

    // -------------------------------------------------------------------------
    // Persist resolution.
    // -------------------------------------------------------------------------

    await transaction.supportCaseResolution.upsert({
      where: {
        id: resolution.id,
      },

      create: {
        id: resolution.id,
        publicId: resolution.publicId,
        caseId: resolution.caseId,
        type: resolution.type,
        summary: resolution.summary,
        resolvedByPublicId: resolution.resolvedByPublicId,
        resolvedAt: resolution.resolvedAt,
        createdAt: resolution.createdAt,
        updatedAt: resolution.updatedAt,
      },

      update: {
        publicId: resolution.publicId,
        caseId: resolution.caseId,
        type: resolution.type,
        summary: resolution.summary,
        resolvedByPublicId: resolution.resolvedByPublicId,
        resolvedAt: resolution.resolvedAt,
        createdAt: resolution.createdAt,
        updatedAt: resolution.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Mapping
  // ===========================================================================

  private toAggregate(
    record: SupportCaseAggregateRecord,
  ): SupportCaseAggregate {
    return SupportCasePrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Prisma Include Definition
  // ===========================================================================

  /**
   * Defines the complete SupportCase aggregate persistence boundary.
   *
   * Every aggregate query uses this include definition so that aggregate
   * rehydration is consistent across repository methods.
   */
  private aggregateInclude(): {
    participants: true;
    messages: true;
    notes: true;
    evidence: true;
    resolution: true;
  } {
    return {
      participants: true,
      messages: true,
      notes: true,
      evidence: true,
      resolution: true,
    };
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  private ensureAggregate(value: SupportCaseAggregate, message: string): void {
    if (value === undefined || value === null || typeof value !== 'object') {
      throw new Error(message);
    }
  }

  private ensureId(value: UniqueEntityId, message: string): void {
    if (
      value === undefined ||
      value === null ||
      !(value instanceof UniqueEntityId)
    ) {
      throw new Error(message);
    }
  }

  private ensurePublicId(value: SupportCasePublicId, message: string): void {
    if (value === undefined || value === null || typeof value !== 'object') {
      throw new Error(message);
    }
  }

  private ensureValueObject<T>(value: T, message: string): void {
    if (value === undefined || value === null || typeof value !== 'object') {
      throw new Error(message);
    }
  }

  private ensureString(value: string, message: string): void {
    if (
      value === undefined ||
      value === null ||
      typeof value !== 'string' ||
      value.trim().length === 0
    ) {
      throw new Error(message);
    }
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaSupportCaseRepository;

// -----------------------------------------------------------------------------
// Support — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Prisma mapper for the SupportCase aggregate.
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
// Responsibilities:
//
// - map Prisma records to domain entities;
// - rehydrate complete SupportCase aggregates;
// - map domain entities to persistence primitives;
// - preserve persisted identities;
// - preserve child ownership through caseId;
// - preserve nullable persistence fields;
// - preserve value-object boundaries;
// - preserve lifecycle timestamps;
// - preserve optimistic concurrency version.
//
// This mapper contains no business logic.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  Prisma,
  SupportCase as PrismaSupportCase,
  SupportCaseParticipant as PrismaSupportCaseParticipant,
  SupportCaseMessage as PrismaSupportCaseMessage,
  SupportCaseNote as PrismaSupportCaseNote,
  SupportCaseEvidence as PrismaSupportCaseEvidence,
  SupportCaseResolution as PrismaSupportCaseResolution,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { SupportCaseAggregate } from '../../../../domain/aggregates/support-case.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { SupportCaseEntity } from '../../../../domain/entities/support-case.entity';
import { SupportCaseParticipantEntity } from '../../../../domain/entities/support-case-participant.entity';
import { SupportCaseMessageEntity } from '../../../../domain/entities/support-case-message.entity';
import { SupportCaseNoteEntity } from '../../../../domain/entities/support-case-note.entity';
import { SupportCaseEvidenceEntity } from '../../../../domain/entities/support-case-evidence.entity';
import { SupportCaseResolutionEntity } from '../../../../domain/entities/support-case-resolution.entity';

// -----------------------------------------------------------------------------
// Value Objects — Support Case
// -----------------------------------------------------------------------------

import { SupportCasePublicId } from '../../../../domain/value-objects/support-case-public-id.vo';
import { SupportCaseRequesterPublicId } from '../../../../domain/value-objects/support-case-requester-public-id.vo';
import { SupportCaseStatus } from '../../../../domain/value-objects/support-case-status.vo';
import { SupportCasePriority } from '../../../../domain/value-objects/support-case-priority.vo';
import { SupportCaseCategory } from '../../../../domain/value-objects/support-case-category.vo';
import { SupportCaseSubject } from '../../../../domain/value-objects/support-case-subject.vo';
import { SupportCaseDescription } from '../../../../domain/value-objects/support-case-description.vo';
import { SupportCaseReferenceType } from '../../../../domain/value-objects/support-case-reference-type.vo';
import { SupportCaseReferencePublicId } from '../../../../domain/value-objects/support-case-reference-public-id.vo';
import { SupportCaseAssignedToPublicId } from '../../../../domain/value-objects/support-case-assigned-to-public-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Participant
// -----------------------------------------------------------------------------

import { SupportCaseParticipantPublicId } from '../../../../domain/value-objects/support-case-participant-public-id.vo';
import { SupportCaseParticipantRole } from '../../../../domain/value-objects/support-case-participant-role.vo';

// -----------------------------------------------------------------------------
// Value Objects — Message
// -----------------------------------------------------------------------------

import { SupportCaseMessagePublicId } from '../../../../domain/value-objects/support-case-message-public-id.vo';
import { SupportCaseMessageSenderPublicId } from '../../../../domain/value-objects/support-case-message-sender-public-id.vo';
import { SupportCaseMessageType } from '../../../../domain/value-objects/support-case-message-type.vo';
import { SupportCaseMessageContent } from '../../../../domain/value-objects/support-case-message-content.vo';
import { SupportCaseMessageAssetId } from '../../../../domain/value-objects/support-case-message-asset-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Note
// -----------------------------------------------------------------------------

import { SupportCaseNotePublicId } from '../../../../domain/value-objects/support-case-note-public-id.vo';
import { SupportCaseNoteAuthorPublicId } from '../../../../domain/value-objects/support-case-note-author-public-id.vo';
import { SupportCaseNoteContent } from '../../../../domain/value-objects/support-case-note-content.vo';

// -----------------------------------------------------------------------------
// Value Objects — Evidence
// -----------------------------------------------------------------------------

import { SupportCaseEvidencePublicId } from '../../../../domain/value-objects/support-case-evidence-public-id.vo';
import { SupportCaseEvidenceSubmittedByPublicId } from '../../../../domain/value-objects/support-case-evidence-submitted-by-public-id.vo';
import { SupportCaseEvidenceAssetId } from '../../../../domain/value-objects/support-case-evidence-asset-id.vo';
import { SupportCaseEvidenceDescription } from '../../../../domain/value-objects/support-case-evidence-description.vo';

// -----------------------------------------------------------------------------
// Value Objects — Resolution
// -----------------------------------------------------------------------------

import { SupportCaseResolutionPublicId } from '../../../../domain/value-objects/support-case-resolution-public-id.vo';
import { SupportCaseResolutionType } from '../../../../domain/value-objects/support-case-resolution-type.vo';
import { SupportCaseResolutionSummary } from '../../../../domain/value-objects/support-case-resolution-summary.vo';
import { SupportCaseResolutionResolvedByPublicId } from '../../../../domain/value-objects/support-case-resolution-resolved-by-public-id.vo';

// =============================================================================
// Prisma Aggregate Record
// =============================================================================

export type PrismaSupportCaseAggregateRecord = Prisma.SupportCaseGetPayload<{
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

export interface SupportCasePersistence {
  supportCase: {
    id: string;
    publicId: string;

    requesterPublicId: string;

    status: PrismaSupportCase['status'];
    priority: PrismaSupportCase['priority'];
    category: PrismaSupportCase['category'];

    subject: string;
    description: string | null;

    referenceType: string | null;
    referencePublicId: string | null;

    assignedToPublicId: string | null;

    openedAt: Date;
    resolvedAt: Date | null;
    closedAt: Date | null;
    cancelledAt: Date | null;

    version: number;
  };

  participants: Array<{
    id: string;
    publicId: string;

    caseId: string;

    memberPublicId: string;
    role: PrismaSupportCaseParticipant['role'];

    joinedAt: Date;
    leftAt: Date | null;

    createdAt: Date;
    updatedAt: Date;
  }>;

  messages: Array<{
    id: string;
    publicId: string;

    caseId: string;

    senderPublicId: string;

    type: PrismaSupportCaseMessage['type'];
    content: string | null;

    assetId: string | null;

    sentAt: Date;
    editedAt: Date | null;
    deletedAt: Date | null;

    createdAt: Date;
    updatedAt: Date;
  }>;

  notes: Array<{
    id: string;
    publicId: string;

    caseId: string;

    authorPublicId: string;
    content: string;

    createdAt: Date;
    updatedAt: Date;
  }>;

  evidence: Array<{
    id: string;
    publicId: string;

    caseId: string;

    submittedByPublicId: string;
    assetId: string;
    description: string | null;

    createdAt: Date;
  }>;

  resolution: {
    id: string;
    publicId: string;

    caseId: string;

    type: PrismaSupportCaseResolution['type'];
    summary: string;

    resolvedByPublicId: string;

    resolvedAt: Date;

    createdAt: Date;
    updatedAt: Date;
  } | null;
}

// =============================================================================
// Mapper
// =============================================================================

export class SupportCasePrismaMapper {
  // ===========================================================================
  // Prisma Aggregate → Domain Aggregate
  // ===========================================================================

  public static toDomain(
    record: PrismaSupportCaseAggregateRecord,
  ): SupportCaseAggregate {
    if (record === undefined || record === null) {
      throw new Error('SupportCase Prisma aggregate record is required.');
    }

    const supportCase = this.supportCaseToDomain(record);

    const participants = record.participants.map((participant) =>
      this.participantToDomain(participant),
    );

    const messages = record.messages.map((message) =>
      this.messageToDomain(message),
    );

    const notes = record.notes.map((note) => this.noteToDomain(note));

    const evidence = record.evidence.map((item) => this.evidenceToDomain(item));

    const resolution =
      record.resolution !== null
        ? this.resolutionToDomain(record.resolution)
        : undefined;

    return SupportCaseAggregate.rehydrate(
      supportCase,
      participants,
      messages,
      notes,
      evidence,
      resolution,
    );
  }

  // ===========================================================================
  // SupportCase → Domain
  // ===========================================================================

  public static supportCaseToDomain(
    record: PrismaSupportCase,
  ): SupportCaseEntity {
    if (record === undefined || record === null) {
      throw new Error('SupportCase Prisma record is required.');
    }

    return SupportCaseEntity.rehydrate(
      {
        requesterPublicId: SupportCaseRequesterPublicId.create(
          record.requesterPublicId,
        ),

        status: SupportCaseStatus.create(record.status),

        priority: SupportCasePriority.create(record.priority),

        category: SupportCaseCategory.create(record.category),

        subject: SupportCaseSubject.create(record.subject),

        // exactOptionalPropertyTypes:
        // omit optional properties instead of assigning undefined.
        ...(record.description !== null
          ? {
              description: SupportCaseDescription.create(record.description),
            }
          : {}),

        ...(record.referenceType !== null
          ? {
              referenceType: SupportCaseReferenceType.create(
                record.referenceType,
              ),
            }
          : {}),

        ...(record.referencePublicId !== null
          ? {
              referencePublicId: SupportCaseReferencePublicId.create(
                record.referencePublicId,
              ),
            }
          : {}),

        ...(record.assignedToPublicId !== null
          ? {
              assignedToPublicId: SupportCaseAssignedToPublicId.create(
                record.assignedToPublicId,
              ),
            }
          : {}),

        openedAt: this.cloneDate(record.openedAt),

        ...(record.resolvedAt !== null
          ? {
              resolvedAt: this.cloneDate(record.resolvedAt),
            }
          : {}),

        ...(record.closedAt !== null
          ? {
              closedAt: this.cloneDate(record.closedAt),
            }
          : {}),

        ...(record.cancelledAt !== null
          ? {
              cancelledAt: this.cloneDate(record.cancelledAt),
            }
          : {}),

        version: record.version,

        createdAt: this.cloneDate(record.createdAt),

        updatedAt: this.cloneDate(record.updatedAt),
      },

      new UniqueEntityId(record.id),

      new SupportCasePublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Participant → Domain
  // ===========================================================================

  public static participantToDomain(
    record: PrismaSupportCaseParticipant,
  ): SupportCaseParticipantEntity {
    if (record === undefined || record === null) {
      throw new Error('SupportCase Participant Prisma record is required.');
    }

    return SupportCaseParticipantEntity.rehydrate(
      {
        memberPublicId: record.memberPublicId,

        role: SupportCaseParticipantRole.create(record.role),

        joinedAt: this.cloneDate(record.joinedAt),

        ...(record.leftAt !== null
          ? {
              leftAt: this.cloneDate(record.leftAt),
            }
          : {}),

        createdAt: this.cloneDate(record.createdAt),

        updatedAt: this.cloneDate(record.updatedAt),
      },

      new UniqueEntityId(record.id),

      new SupportCaseParticipantPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Message → Domain
  // ===========================================================================

  public static messageToDomain(
    record: PrismaSupportCaseMessage,
  ): SupportCaseMessageEntity {
    if (record === undefined || record === null) {
      throw new Error('SupportCase Message Prisma record is required.');
    }

    return SupportCaseMessageEntity.rehydrate(
      {
        senderPublicId: SupportCaseMessageSenderPublicId.create(
          record.senderPublicId,
        ),

        type: SupportCaseMessageType.create(record.type),

        ...(record.content !== null
          ? {
              content: SupportCaseMessageContent.create(record.content),
            }
          : {}),

        ...(record.assetId !== null
          ? {
              assetId: SupportCaseMessageAssetId.create(record.assetId),
            }
          : {}),

        sentAt: this.cloneDate(record.sentAt),

        ...(record.editedAt !== null
          ? {
              editedAt: this.cloneDate(record.editedAt),
            }
          : {}),

        ...(record.deletedAt !== null
          ? {
              deletedAt: this.cloneDate(record.deletedAt),
            }
          : {}),

        createdAt: this.cloneDate(record.createdAt),

        updatedAt: this.cloneDate(record.updatedAt),
      },

      new UniqueEntityId(record.id),

      new SupportCaseMessagePublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Note → Domain
  // ===========================================================================

  public static noteToDomain(
    record: PrismaSupportCaseNote,
  ): SupportCaseNoteEntity {
    if (record === undefined || record === null) {
      throw new Error('SupportCase Note Prisma record is required.');
    }

    return SupportCaseNoteEntity.rehydrate(
      {
        authorPublicId: SupportCaseNoteAuthorPublicId.create(
          record.authorPublicId,
        ),

        content: SupportCaseNoteContent.create(record.content),

        createdAt: this.cloneDate(record.createdAt),

        updatedAt: this.cloneDate(record.updatedAt),
      },

      new UniqueEntityId(record.id),

      new SupportCaseNotePublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Evidence → Domain
  // ===========================================================================

  public static evidenceToDomain(
    record: PrismaSupportCaseEvidence,
  ): SupportCaseEvidenceEntity {
    if (record === undefined || record === null) {
      throw new Error('SupportCase Evidence Prisma record is required.');
    }

    return SupportCaseEvidenceEntity.rehydrate(
      {
        submittedByPublicId: SupportCaseEvidenceSubmittedByPublicId.create(
          record.submittedByPublicId,
        ),

        assetId: SupportCaseEvidenceAssetId.create(record.assetId),

        ...(record.description !== null
          ? {
              description: SupportCaseEvidenceDescription.create(
                record.description,
              ),
            }
          : {}),

        createdAt: this.cloneDate(record.createdAt),
      },

      new UniqueEntityId(record.id),

      new SupportCaseEvidencePublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Resolution → Domain
  // ===========================================================================

  public static resolutionToDomain(
    record: PrismaSupportCaseResolution,
  ): SupportCaseResolutionEntity {
    if (record === undefined || record === null) {
      throw new Error('SupportCase Resolution Prisma record is required.');
    }

    return SupportCaseResolutionEntity.rehydrate(
      {
        type: SupportCaseResolutionType.create(record.type),

        summary: SupportCaseResolutionSummary.create(record.summary),

        resolvedByPublicId: SupportCaseResolutionResolvedByPublicId.create(
          record.resolvedByPublicId,
        ),

        resolvedAt: this.cloneDate(record.resolvedAt),

        createdAt: this.cloneDate(record.createdAt),

        updatedAt: this.cloneDate(record.updatedAt),
      },

      new UniqueEntityId(record.id),

      new SupportCaseResolutionPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // SupportCase → Persistence
  // ===========================================================================

  public static supportCaseToPersistence(
    entity: SupportCaseEntity,
  ): SupportCasePersistence['supportCase'] {
    if (entity === undefined || entity === null) {
      throw new Error('SupportCase entity is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.casePublicId.value,

      requesterPublicId: entity.requesterPublicId.value,

      status: entity.status.value,

      priority: entity.priority.value,

      category: entity.category.value,

      subject: entity.subject.value,

      description: entity.description?.value ?? null,

      referenceType: entity.referenceType?.value ?? null,

      referencePublicId: entity.referencePublicId?.value ?? null,

      assignedToPublicId: entity.assignedToPublicId?.value ?? null,

      openedAt: this.cloneDate(entity.openedAt),

      resolvedAt:
        entity.resolvedAt !== undefined
          ? this.cloneDate(entity.resolvedAt)
          : null,

      closedAt:
        entity.closedAt !== undefined ? this.cloneDate(entity.closedAt) : null,

      cancelledAt:
        entity.cancelledAt !== undefined
          ? this.cloneDate(entity.cancelledAt)
          : null,

      version: entity.version,
    };
  }

  // ===========================================================================
  // Participant → Persistence
  // ===========================================================================

  public static participantToPersistence(
    entity: SupportCaseParticipantEntity,
    caseId: UniqueEntityId,
  ): SupportCasePersistence['participants'][number] {
    if (entity === undefined || entity === null) {
      throw new Error('SupportCase Participant entity is required.');
    }

    if (caseId === undefined || caseId === null) {
      throw new Error('SupportCase participant caseId is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.participantPublicId.value,

      caseId: caseId.toString(),

      memberPublicId: entity.memberPublicId,

      role: entity.role.value,

      joinedAt: this.cloneDate(entity.joinedAt),

      leftAt:
        entity.leftAt !== undefined ? this.cloneDate(entity.leftAt) : null,

      createdAt: this.cloneDate(entity.createdAt),

      updatedAt: this.cloneDate(entity.updatedAt),
    };
  }

  // ===========================================================================
  // Message → Persistence
  // ===========================================================================

  public static messageToPersistence(
    entity: SupportCaseMessageEntity,
    caseId: UniqueEntityId,
  ): SupportCasePersistence['messages'][number] {
    if (entity === undefined || entity === null) {
      throw new Error('SupportCase Message entity is required.');
    }

    if (caseId === undefined || caseId === null) {
      throw new Error('SupportCase message caseId is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.messagePublicId.value,

      caseId: caseId.toString(),

      senderPublicId: entity.senderPublicId.value,

      type: entity.type.value,

      content: entity.content?.value ?? null,

      assetId: entity.assetId?.value ?? null,

      sentAt: this.cloneDate(entity.sentAt),

      editedAt:
        entity.editedAt !== undefined ? this.cloneDate(entity.editedAt) : null,

      deletedAt:
        entity.deletedAt !== undefined
          ? this.cloneDate(entity.deletedAt)
          : null,

      createdAt: this.cloneDate(entity.createdAt),

      updatedAt: this.cloneDate(entity.updatedAt),
    };
  }

  // ===========================================================================
  // Note → Persistence
  // ===========================================================================

  public static noteToPersistence(
    entity: SupportCaseNoteEntity,
    caseId: UniqueEntityId,
  ): SupportCasePersistence['notes'][number] {
    if (entity === undefined || entity === null) {
      throw new Error('SupportCase Note entity is required.');
    }

    if (caseId === undefined || caseId === null) {
      throw new Error('SupportCase note caseId is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.notePublicId.value,

      caseId: caseId.toString(),

      authorPublicId: entity.authorPublicId.value,

      content: entity.content.value,

      createdAt: this.cloneDate(entity.createdAt),

      updatedAt: this.cloneDate(entity.updatedAt),
    };
  }

  // ===========================================================================
  // Evidence → Persistence
  // ===========================================================================

  public static evidenceToPersistence(
    entity: SupportCaseEvidenceEntity,
    caseId: UniqueEntityId,
  ): SupportCasePersistence['evidence'][number] {
    if (entity === undefined || entity === null) {
      throw new Error('SupportCase Evidence entity is required.');
    }

    if (caseId === undefined || caseId === null) {
      throw new Error('SupportCase evidence caseId is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.evidencePublicId.value,

      caseId: caseId.toString(),

      submittedByPublicId: entity.submittedByPublicId.value,

      assetId: entity.assetId.value,

      description: entity.description?.value ?? null,

      createdAt: this.cloneDate(entity.createdAt),
    };
  }

  // ===========================================================================
  // Resolution → Persistence
  // ===========================================================================

  public static resolutionToPersistence(
    entity: SupportCaseResolutionEntity,
    caseId: UniqueEntityId,
  ): NonNullable<SupportCasePersistence['resolution']> {
    if (entity === undefined || entity === null) {
      throw new Error('SupportCase Resolution entity is required.');
    }

    if (caseId === undefined || caseId === null) {
      throw new Error('SupportCase resolution caseId is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.resolutionPublicId.value,

      caseId: caseId.toString(),

      type: entity.type.value,

      summary: entity.summary.value,

      resolvedByPublicId: entity.resolvedByPublicId.value,

      resolvedAt: this.cloneDate(entity.resolvedAt),

      createdAt: this.cloneDate(entity.createdAt),

      updatedAt: this.cloneDate(entity.updatedAt),
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  public static toPersistence(
    aggregate: SupportCaseAggregate,
  ): SupportCasePersistence {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('SupportCase aggregate is required.');
    }

    const caseId = aggregate.supportCase.id;

    return {
      supportCase: this.supportCaseToPersistence(aggregate.supportCase),

      participants: aggregate.participants.map((participant) =>
        this.participantToPersistence(participant, caseId),
      ),

      messages: aggregate.messages.map((message) =>
        this.messageToPersistence(message, caseId),
      ),

      notes: aggregate.notes.map((note) =>
        this.noteToPersistence(note, caseId),
      ),

      evidence: aggregate.evidence.map((item) =>
        this.evidenceToPersistence(item, caseId),
      ),

      resolution:
        aggregate.resolution !== undefined
          ? this.resolutionToPersistence(aggregate.resolution, caseId)
          : null,
    };
  }

  // ===========================================================================
  // Explicit Mapping Aliases
  // ===========================================================================

  public static fromPersistence(
    record: PrismaSupportCaseAggregateRecord,
  ): SupportCaseAggregate {
    return this.toDomain(record);
  }

  public static fromDomain(
    aggregate: SupportCaseAggregate,
  ): SupportCasePersistence {
    return this.toPersistence(aggregate);
  }

  public static toSupportCaseDomain(
    record: PrismaSupportCase,
  ): SupportCaseEntity {
    return this.supportCaseToDomain(record);
  }

  public static toSupportCaseAggregate(
    record: PrismaSupportCaseAggregateRecord,
  ): SupportCaseAggregate {
    return this.toDomain(record);
  }

  public static toParticipantDomain(
    record: PrismaSupportCaseParticipant,
  ): SupportCaseParticipantEntity {
    return this.participantToDomain(record);
  }

  public static toMessageDomain(
    record: PrismaSupportCaseMessage,
  ): SupportCaseMessageEntity {
    return this.messageToDomain(record);
  }

  public static toNoteDomain(
    record: PrismaSupportCaseNote,
  ): SupportCaseNoteEntity {
    return this.noteToDomain(record);
  }

  public static toEvidenceDomain(
    record: PrismaSupportCaseEvidence,
  ): SupportCaseEvidenceEntity {
    return this.evidenceToDomain(record);
  }

  public static toResolutionDomain(
    record: PrismaSupportCaseResolution,
  ): SupportCaseResolutionEntity {
    return this.resolutionToDomain(record);
  }

  public static toDomainComponent(
    record: PrismaSupportCaseAggregateRecord,
  ): SupportCaseAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Date Utility
  // ===========================================================================

  private static cloneDate(value: Date): Date {
    return new Date(value.getTime());
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default SupportCasePrismaMapper;

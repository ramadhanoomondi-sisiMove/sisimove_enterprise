// -----------------------------------------------------------------------------
// Support Case — Entity
// -----------------------------------------------------------------------------
//
// Represents the Support Case aggregate root entity.
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
// SupportCaseEntity is the aggregate root entity.
//
// The entity records:
// - the Support Case public identity;
// - the requesting Identity member;
// - case status;
// - case priority;
// - case category;
// - subject and optional description;
// - optional cross-domain reference;
// - optional Support assignment;
// - case lifecycle timestamps;
// - optimistic concurrency version;
// - audit timestamps.
//
// The entity does NOT contain:
// - participants;
// - messages;
// - notes;
// - evidence;
// - resolution;
// - Prisma relations;
// - caseId;
// - repository access;
// - Identity domain objects;
// - Journey, Booking, Financial, Trust, or other domain objects.
//
// Child entities are owned and coordinated by SupportCaseAggregate.
//
// Cross-domain references are represented by value objects and remain
// intentionally independent from other bounded contexts.
//
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { SupportCasePublicId } from '../value-objects/support-case-public-id.vo';
import type { SupportCaseStatus } from '../value-objects/support-case-status.vo';
import type { SupportCasePriority } from '../value-objects/support-case-priority.vo';
import type { SupportCaseCategory } from '../value-objects/support-case-category.vo';
import type { SupportCaseSubject } from '../value-objects/support-case-subject.vo';
import type { SupportCaseDescription } from '../value-objects/support-case-description.vo';
import type { SupportCaseRequesterPublicId } from '../value-objects/support-case-requester-public-id.vo';
import type { SupportCaseAssignedToPublicId } from '../value-objects/support-case-assigned-to-public-id.vo';
import type { SupportCaseReferenceType } from '../value-objects/support-case-reference-type.vo';
import type { SupportCaseReferencePublicId } from '../value-objects/support-case-reference-public-id.vo';

export interface SupportCaseProps {
  // ---------------------------------------------------------------------------
  // Requester
  // ---------------------------------------------------------------------------

  requesterPublicId: SupportCaseRequesterPublicId;

  // ---------------------------------------------------------------------------
  // Case
  // ---------------------------------------------------------------------------

  status: SupportCaseStatus;
  priority: SupportCasePriority;
  category: SupportCaseCategory;

  subject: SupportCaseSubject;
  description?: SupportCaseDescription;

  // ---------------------------------------------------------------------------
  // Cross-domain reference
  // ---------------------------------------------------------------------------

  referenceType?: SupportCaseReferenceType;
  referencePublicId?: SupportCaseReferencePublicId;

  // ---------------------------------------------------------------------------
  // Assignment
  // ---------------------------------------------------------------------------

  assignedToPublicId?: SupportCaseAssignedToPublicId;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  openedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  cancelledAt?: Date;

  // ---------------------------------------------------------------------------
  // Optimistic concurrency
  // ---------------------------------------------------------------------------

  version: number;

  // ---------------------------------------------------------------------------
  // Audit timestamps
  // ---------------------------------------------------------------------------

  createdAt: Date;
  updatedAt: Date;
}

export class SupportCaseEntity extends Entity<
  SupportCaseProps,
  SupportCasePublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: SupportCaseProps,
    id?: UniqueEntityId,
    publicId?: SupportCasePublicId,
  ) {
    super(
      {
        ...props,

        openedAt: new Date(props.openedAt),

        ...(props.resolvedAt !== undefined
          ? {
              resolvedAt: new Date(props.resolvedAt),
            }
          : {}),

        ...(props.closedAt !== undefined
          ? {
              closedAt: new Date(props.closedAt),
            }
          : {}),

        ...(props.cancelledAt !== undefined
          ? {
              cancelledAt: new Date(props.cancelledAt),
            }
          : {}),

        createdAt: new Date(props.createdAt),
        updatedAt: new Date(props.updatedAt),
      },
      id,
      publicId,
    );

    this.validateInvariants();
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    requesterPublicId: SupportCaseRequesterPublicId;

    status: SupportCaseStatus;
    priority: SupportCasePriority;
    category: SupportCaseCategory;

    subject: SupportCaseSubject;
    description?: SupportCaseDescription;

    referenceType?: SupportCaseReferenceType;
    referencePublicId?: SupportCaseReferencePublicId;

    assignedToPublicId?: SupportCaseAssignedToPublicId;

    openedAt?: Date;
    resolvedAt?: Date;
    closedAt?: Date;
    cancelledAt?: Date;

    version?: number;

    createdAt?: Date;
    updatedAt?: Date;
  }): SupportCaseEntity {
    const now = new Date();

    return new SupportCaseEntity({
      requesterPublicId: props.requesterPublicId,

      status: props.status,
      priority: props.priority,
      category: props.category,

      subject: props.subject,

      ...(props.description !== undefined
        ? {
            description: props.description,
          }
        : {}),

      ...(props.referenceType !== undefined
        ? {
            referenceType: props.referenceType,
          }
        : {}),

      ...(props.referencePublicId !== undefined
        ? {
            referencePublicId: props.referencePublicId,
          }
        : {}),

      ...(props.assignedToPublicId !== undefined
        ? {
            assignedToPublicId: props.assignedToPublicId,
          }
        : {}),

      openedAt: props.openedAt ? new Date(props.openedAt) : new Date(now),

      ...(props.resolvedAt !== undefined
        ? {
            resolvedAt: new Date(props.resolvedAt),
          }
        : {}),

      ...(props.closedAt !== undefined
        ? {
            closedAt: new Date(props.closedAt),
          }
        : {}),

      ...(props.cancelledAt !== undefined
        ? {
            cancelledAt: new Date(props.cancelledAt),
          }
        : {}),

      version: props.version ?? 1,

      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(now),

      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(now),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: SupportCaseProps,
    id: UniqueEntityId,
    publicId: SupportCasePublicId,
  ): SupportCaseEntity {
    return new SupportCaseEntity(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public get casePublicId(): SupportCasePublicId {
    return this.publicId;
  }

  // ---------------------------------------------------------------------------
  // Requester
  // ---------------------------------------------------------------------------

  public get requesterPublicId(): SupportCaseRequesterPublicId {
    return this.props.requesterPublicId;
  }

  // ---------------------------------------------------------------------------
  // Case
  // ---------------------------------------------------------------------------

  public get status(): SupportCaseStatus {
    return this.props.status;
  }

  public get priority(): SupportCasePriority {
    return this.props.priority;
  }

  public get category(): SupportCaseCategory {
    return this.props.category;
  }

  public get subject(): SupportCaseSubject {
    return this.props.subject;
  }

  public get description(): SupportCaseDescription | undefined {
    return this.props.description;
  }

  // ---------------------------------------------------------------------------
  // Cross-domain reference
  // ---------------------------------------------------------------------------

  public get referenceType(): SupportCaseReferenceType | undefined {
    return this.props.referenceType;
  }

  public get referencePublicId(): SupportCaseReferencePublicId | undefined {
    return this.props.referencePublicId;
  }

  public get hasReference(): boolean {
    return (
      this.props.referenceType !== undefined &&
      this.props.referencePublicId !== undefined
    );
  }

  // ---------------------------------------------------------------------------
  // Assignment
  // ---------------------------------------------------------------------------

  public get assignedToPublicId(): SupportCaseAssignedToPublicId | undefined {
    return this.props.assignedToPublicId;
  }

  public get isAssigned(): boolean {
    return this.props.assignedToPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public get openedAt(): Date {
    return new Date(this.props.openedAt);
  }

  public get resolvedAt(): Date | undefined {
    return this.props.resolvedAt ? new Date(this.props.resolvedAt) : undefined;
  }

  public get closedAt(): Date | undefined {
    return this.props.closedAt ? new Date(this.props.closedAt) : undefined;
  }

  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt
      ? new Date(this.props.cancelledAt)
      : undefined;
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  public get isResolved(): boolean {
    return this.props.resolvedAt !== undefined;
  }

  public get isClosed(): boolean {
    return this.props.closedAt !== undefined;
  }

  public get isCancelled(): boolean {
    return this.props.cancelledAt !== undefined;
  }

  public get isOpen(): boolean {
    return !this.isResolved && !this.isClosed && !this.isCancelled;
  }

  // ---------------------------------------------------------------------------
  // Optimistic Concurrency
  // ---------------------------------------------------------------------------

  public get version(): number {
    return this.props.version;
  }

  public incrementVersion(): void {
    this.props.version += 1;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Requester
  // ---------------------------------------------------------------------------

  public changeRequester(
    requesterPublicId: SupportCaseRequesterPublicId,
  ): void {
    this.props.requesterPublicId = requesterPublicId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public changeStatus(status: SupportCaseStatus): void {
    this.props.status = status;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Priority
  // ---------------------------------------------------------------------------

  public changePriority(priority: SupportCasePriority): void {
    this.props.priority = priority;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Category
  // ---------------------------------------------------------------------------

  public changeCategory(category: SupportCaseCategory): void {
    this.props.category = category;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Subject
  // ---------------------------------------------------------------------------

  public changeSubject(subject: SupportCaseSubject): void {
    this.props.subject = subject;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Description
  // ---------------------------------------------------------------------------

  public changeDescription(description?: SupportCaseDescription): void {
    if (description === undefined) {
      delete this.props.description;
      this.touch();
      return;
    }

    this.props.description = description;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Reference
  // ---------------------------------------------------------------------------

  public changeReference(
    referenceType?: SupportCaseReferenceType,
    referencePublicId?: SupportCaseReferencePublicId,
  ): void {
    if (referenceType === undefined || referencePublicId === undefined) {
      delete this.props.referenceType;
      delete this.props.referencePublicId;
      this.touch();
      return;
    }

    this.props.referenceType = referenceType;
    this.props.referencePublicId = referencePublicId;

    this.touch();
  }

  public clearReference(): void {
    delete this.props.referenceType;
    delete this.props.referencePublicId;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Assignment
  // ---------------------------------------------------------------------------

  public assignTo(assignedToPublicId: SupportCaseAssignedToPublicId): void {
    this.props.assignedToPublicId = assignedToPublicId;
    this.touch();
  }

  public unassign(): void {
    delete this.props.assignedToPublicId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Lifecycle timestamps
  // ---------------------------------------------------------------------------

  public markResolved(at: Date = new Date()): void {
    this.validateTimestamp(
      at,
      'Support case resolution timestamp must be a valid date.',
    );

    this.props.resolvedAt = new Date(at);

    this.touch(at);
  }

  public markClosed(at: Date = new Date()): void {
    this.validateTimestamp(
      at,
      'Support case closure timestamp must be a valid date.',
    );

    this.props.closedAt = new Date(at);

    this.touch(at);
  }

  public markCancelled(at: Date = new Date()): void {
    this.validateTimestamp(
      at,
      'Support case cancellation timestamp must be a valid date.',
    );

    this.props.cancelledAt = new Date(at);

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Invariants
  // ---------------------------------------------------------------------------

  private validateInvariants(): void {
    this.validateTimestamp(
      this.props.openedAt,
      'Support case opening timestamp must be a valid date.',
    );

    if (this.props.resolvedAt !== undefined) {
      this.validateTimestamp(
        this.props.resolvedAt,
        'Support case resolution timestamp must be a valid date.',
      );

      if (this.props.resolvedAt < this.props.openedAt) {
        throw new Error(
          'Support case resolution timestamp cannot precede opening timestamp.',
        );
      }
    }

    if (this.props.closedAt !== undefined) {
      this.validateTimestamp(
        this.props.closedAt,
        'Support case closure timestamp must be a valid date.',
      );

      if (this.props.closedAt < this.props.openedAt) {
        throw new Error(
          'Support case closure timestamp cannot precede opening timestamp.',
        );
      }
    }

    if (this.props.cancelledAt !== undefined) {
      this.validateTimestamp(
        this.props.cancelledAt,
        'Support case cancellation timestamp must be a valid date.',
      );

      if (this.props.cancelledAt < this.props.openedAt) {
        throw new Error(
          'Support case cancellation timestamp cannot precede opening timestamp.',
        );
      }
    }

    this.validateVersion(this.props.version);

    this.validateTimestamp(
      this.props.createdAt,
      'Support case creation timestamp must be a valid date.',
    );

    this.validateTimestamp(
      this.props.updatedAt,
      'Support case update timestamp must be a valid date.',
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private validateVersion(version: number): void {
    if (!Number.isInteger(version) || version < 1) {
      throw new Error('Support case version must be a positive integer.');
    }
  }

  private validateTimestamp(timestamp: Date, message: string): void {
    if (!(timestamp instanceof Date) || Number.isNaN(timestamp.getTime())) {
      throw new Error(message);
    }
  }
}

// -----------------------------------------------------------------------------
// Support Case Resolution — Entity
// -----------------------------------------------------------------------------
//
// Represents the resolution of a Support Case.
//
// Aggregate:
// //
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// SupportCaseResolutionEntity is a child entity owned by the
// SupportCaseAggregate.
//
// A Support Case may have at most one resolution.
//
// The entity does NOT contain:
// - caseId;
// - Prisma relations;
// - persistence concerns;
// - repository access.
//
// The aggregate owns the relationship between the Support Case and
// its resolution.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SupportCaseResolutionPublicId } from '../value-objects/support-case-resolution-public-id.vo';
import type { SupportCaseResolutionType } from '../value-objects/support-case-resolution-type.vo';
import type { SupportCaseResolutionSummary } from '../value-objects/support-case-resolution-summary.vo';
import type { SupportCaseResolutionResolvedByPublicId } from '../value-objects/support-case-resolution-resolved-by-public-id.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseResolutionSummaryEmptyException } from '../exceptions/support-case-resolution-summary-empty.exception';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface SupportCaseResolutionProps {
  type: SupportCaseResolutionType;
  summary: SupportCaseResolutionSummary;
  resolvedByPublicId: SupportCaseResolutionResolvedByPublicId;

  resolvedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Represents the resolution of a Support Case.
 *
 * A resolution records how a Support Case was resolved, the summary of the
 * outcome, who resolved it, and when the resolution occurred.
 *
 * The entity is owned by SupportCaseAggregate.
 */
export class SupportCaseResolutionEntity extends Entity<
  SupportCaseResolutionProps,
  SupportCaseResolutionPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: SupportCaseResolutionProps,
    id?: UniqueEntityId,
    publicId?: SupportCaseResolutionPublicId,
  ) {
    super(
      {
        ...props,
        resolvedAt: new Date(props.resolvedAt),
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

  /**
   * Creates a new Support Case Resolution entity.
   */
  public static create(props: {
    type: SupportCaseResolutionType;
    summary: SupportCaseResolutionSummary;
    resolvedByPublicId: SupportCaseResolutionResolvedByPublicId;
    resolvedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }): SupportCaseResolutionEntity {
    const now = new Date();

    return new SupportCaseResolutionEntity({
      type: props.type,
      summary: props.summary,
      resolvedByPublicId: props.resolvedByPublicId,
      resolvedAt: props.resolvedAt ? new Date(props.resolvedAt) : new Date(now),
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(now),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(now),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Rehydrates an existing Support Case Resolution entity.
   *
   * Intended for repository/infrastructure mapping.
   */
  public static rehydrate(
    props: SupportCaseResolutionProps,
    id: UniqueEntityId,
    publicId: SupportCaseResolutionPublicId,
  ): SupportCaseResolutionEntity {
    return new SupportCaseResolutionEntity(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public get resolutionPublicId(): SupportCaseResolutionPublicId {
    return this.publicId;
  }

  // ---------------------------------------------------------------------------
  // Resolution
  // ---------------------------------------------------------------------------

  public get type(): SupportCaseResolutionType {
    return this.props.type;
  }

  public get summary(): SupportCaseResolutionSummary {
    return this.props.summary;
  }

  public get resolvedByPublicId(): SupportCaseResolutionResolvedByPublicId {
    return this.props.resolvedByPublicId;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public get resolvedAt(): Date {
    return new Date(this.props.resolvedAt);
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Domain Behavior
  // ---------------------------------------------------------------------------

  /**
   * Changes the resolution type.
   *
   * A resolution type may be corrected while the Support Case remains
   * within the aggregate's resolution lifecycle.
   */
  public changeType(type: SupportCaseResolutionType): void {
    this.props.type = type;
    this.touch();
  }

  /**
   * Updates the resolution summary.
   */
  public changeSummary(summary: SupportCaseResolutionSummary): void {
    this.validateSummary(summary);

    this.props.summary = summary;
    this.touch();
  }

  /**
   * Changes the Identity member responsible for the resolution.
   */
  public changeResolvedBy(
    resolvedByPublicId: SupportCaseResolutionResolvedByPublicId,
  ): void {
    this.props.resolvedByPublicId = resolvedByPublicId;
    this.touch();
  }

  /**
   * Changes the resolution timestamp.
   */
  public changeResolvedAt(resolvedAt: Date): void {
    this.props.resolvedAt = new Date(resolvedAt);
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Invariants
  // ---------------------------------------------------------------------------

  private validateInvariants(): void {
    this.validateSummary(this.props.summary);
    this.validateResolvedAt(this.props.resolvedAt);
  }

  private validateSummary(summary: SupportCaseResolutionSummary): void {
    if (!summary || !summary.value.trim()) {
      throw new SupportCaseResolutionSummaryEmptyException();
    }
  }

  private validateResolvedAt(resolvedAt: Date): void {
    if (!(resolvedAt instanceof Date) || Number.isNaN(resolvedAt.getTime())) {
      throw new Error(
        'Support case resolution timestamp must be a valid date.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Journey Completion Dispute Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionDisputePublicId } from '../value-objects/journey-completion-dispute-public-id.vo';

import type { JourneyCompletionPublicId } from '../value-objects/journey-completion-public-id.vo';

import type { JourneyCompletionMemberPublicId } from '../value-objects/journey-completion-member-public-id.vo';

import { JourneyCompletionDisputeStatus } from '../value-objects/journey-completion-dispute-status.vo';

import type { JourneyCompletionDisputeReason } from '../value-objects/journey-completion-dispute-reason.vo';

import type { JourneyCompletionDisputeDescription } from '../value-objects/journey-completion-dispute-description.vo';

import type { JourneyCompletionDisputeResolutionSummary } from '../value-objects/journey-completion-dispute-resolution-summary.vo';

import type { JourneyCompletionDisputeResolvedByPublicId } from '../value-objects/journey-completion-dispute-resolved-by-public-id.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyCompletionDisputeProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of this Journey Completion Dispute entity.
   */
  publicId: JourneyCompletionDisputePublicId;

  // ---------------------------------------------------------------------------
  // Completion
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Completion aggregate this dispute belongs
   * to.
   *
   * This is represented as a public domain identity rather than the internal
   * Prisma completionId.
   */
  completionId: JourneyCompletionPublicId;

  // ---------------------------------------------------------------------------
  // Raised By
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the member who raised the dispute.
   */
  raisedByPublicId: JourneyCompletionMemberPublicId;

  // ---------------------------------------------------------------------------
  // Dispute
  // ---------------------------------------------------------------------------

  /**
   * Reason for raising the completion dispute.
   */
  reason: JourneyCompletionDisputeReason;

  /**
   * Optional human-readable description of the dispute.
   */
  description?: JourneyCompletionDisputeDescription | undefined;

  /**
   * Current lifecycle status of the dispute.
   */
  status: JourneyCompletionDisputeStatus;

  // ---------------------------------------------------------------------------
  // Resolution
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the member or authority who resolved the dispute.
   */
  resolvedByPublicId?: JourneyCompletionDisputeResolvedByPublicId | undefined;

  /**
   * Optional explanation of how the dispute was resolved.
   */
  resolutionSummary?: JourneyCompletionDisputeResolutionSummary | undefined;

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Time at which the dispute was opened.
   */
  openedAt: Date;

  /**
   * Time at which the dispute was resolved.
   */
  resolvedAt?: Date | undefined;

  /**
   * Time at which the dispute was rejected.
   */
  rejectedAt?: Date | undefined;

  /**
   * Time at which the dispute was withdrawn.
   */
  withdrawnAt?: Date | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Represents a dispute raised against a Journey Completion.
 *
 * A dispute is an independent child entity of the Journey Completion
 * aggregate. It records:
 *
 * - who raised the dispute;
 * - why the completion is being challenged;
 * - the current dispute lifecycle state;
 * - optional resolution information;
 * - lifecycle timestamps.
 *
 * The dispute lifecycle is:
 *
 * OPEN
 *   The dispute has been raised and is awaiting review.
 *
 * UNDER_REVIEW
 *   The dispute is actively being investigated.
 *
 * RESOLVED
 *   The dispute has been resolved.
 *
 * REJECTED
 *   The dispute was reviewed and rejected.
 *
 * WITHDRAWN
 *   The member who raised the dispute withdrew it.
 */
export class JourneyCompletionDisputeEntity extends Entity<
  JourneyCompletionDisputeProps,
  JourneyCompletionDisputePublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneyCompletionDisputeProps,
    id?: UniqueEntityId,
    publicId?: JourneyCompletionDisputePublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyCompletionDisputePublicId;

    completionId: JourneyCompletionPublicId;

    raisedByPublicId: JourneyCompletionMemberPublicId;

    reason: JourneyCompletionDisputeReason;

    description?: JourneyCompletionDisputeDescription | undefined;

    /**
     * Defaults to OPEN for newly created disputes.
     */
    status?: JourneyCompletionDisputeStatus;

    resolvedByPublicId?: JourneyCompletionDisputeResolvedByPublicId | undefined;

    resolutionSummary?: JourneyCompletionDisputeResolutionSummary | undefined;

    openedAt?: Date | undefined;

    resolvedAt?: Date | undefined;

    rejectedAt?: Date | undefined;

    withdrawnAt?: Date | undefined;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): JourneyCompletionDisputeEntity {
    const now = new Date();

    return new JourneyCompletionDisputeEntity({
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: props.publicId ?? new JourneyCompletionDisputePublicId(),

      // -----------------------------------------------------------------------
      // Completion
      // -----------------------------------------------------------------------

      completionId: props.completionId,

      // -----------------------------------------------------------------------
      // Raised By
      // -----------------------------------------------------------------------

      raisedByPublicId: props.raisedByPublicId,

      // -----------------------------------------------------------------------
      // Dispute
      // -----------------------------------------------------------------------

      reason: props.reason,

      ...(props.description !== undefined
        ? {
            description: props.description,
          }
        : {}),

      // -----------------------------------------------------------------------
      // IMPORTANT:
      // The domain entity always contains a concrete status.
      // -----------------------------------------------------------------------

      status: props.status ?? JourneyCompletionDisputeStatus.open(),

      // -----------------------------------------------------------------------
      // Resolution
      // -----------------------------------------------------------------------

      ...(props.resolvedByPublicId !== undefined
        ? {
            resolvedByPublicId: props.resolvedByPublicId,
          }
        : {}),

      ...(props.resolutionSummary !== undefined
        ? {
            resolutionSummary: props.resolutionSummary,
          }
        : {}),

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      openedAt: JourneyCompletionDisputeEntity.cloneDate(props.openedAt ?? now),

      ...(props.resolvedAt !== undefined
        ? {
            resolvedAt: JourneyCompletionDisputeEntity.cloneDate(
              props.resolvedAt,
            ),
          }
        : {}),

      ...(props.rejectedAt !== undefined
        ? {
            rejectedAt: JourneyCompletionDisputeEntity.cloneDate(
              props.rejectedAt,
            ),
          }
        : {}),

      ...(props.withdrawnAt !== undefined
        ? {
            withdrawnAt: JourneyCompletionDisputeEntity.cloneDate(
              props.withdrawnAt,
            ),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: JourneyCompletionDisputeEntity.cloneDate(
        props.createdAt ?? now,
      ),

      updatedAt: JourneyCompletionDisputeEntity.cloneDate(
        props.updatedAt ?? now,
      ),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyCompletionDisputeProps,
    id: UniqueEntityId,
    publicId: JourneyCompletionDisputePublicId,
  ): JourneyCompletionDisputeEntity {
    return new JourneyCompletionDisputeEntity(
      {
        ...props,

        // ---------------------------------------------------------------------
        // Persistence public ID is authoritative during rehydration.
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Lifecycle timestamps
        // ---------------------------------------------------------------------

        openedAt: JourneyCompletionDisputeEntity.cloneDate(props.openedAt),

        ...(props.resolvedAt !== undefined
          ? {
              resolvedAt: JourneyCompletionDisputeEntity.cloneDate(
                props.resolvedAt,
              ),
            }
          : {}),

        ...(props.rejectedAt !== undefined
          ? {
              rejectedAt: JourneyCompletionDisputeEntity.cloneDate(
                props.rejectedAt,
              ),
            }
          : {}),

        ...(props.withdrawnAt !== undefined
          ? {
              withdrawnAt: JourneyCompletionDisputeEntity.cloneDate(
                props.withdrawnAt,
              ),
            }
          : {}),

        createdAt: JourneyCompletionDisputeEntity.cloneDate(props.createdAt),

        updatedAt: JourneyCompletionDisputeEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneyCompletionDisputePublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Completion
  // ---------------------------------------------------------------------------

  public get completionId(): JourneyCompletionPublicId {
    return this.props.completionId;
  }

  public setCompletionId(completionId: JourneyCompletionPublicId): void {
    this.props.completionId = completionId;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Raised By
  // ---------------------------------------------------------------------------

  public get raisedByPublicId(): JourneyCompletionMemberPublicId {
    return this.props.raisedByPublicId;
  }

  public setRaisedByPublicId(
    raisedByPublicId: JourneyCompletionMemberPublicId,
  ): void {
    this.props.raisedByPublicId = raisedByPublicId;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Reason
  // ---------------------------------------------------------------------------

  public get reason(): JourneyCompletionDisputeReason {
    return this.props.reason;
  }

  public setReason(reason: JourneyCompletionDisputeReason): void {
    this.props.reason = reason;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Description
  // ---------------------------------------------------------------------------

  public get description(): JourneyCompletionDisputeDescription | undefined {
    return this.props.description;
  }

  public setDescription(
    description: JourneyCompletionDisputeDescription,
  ): void {
    this.props.description = description;

    this.touch();
  }

  public clearDescription(): void {
    if (this.props.description === undefined) {
      return;
    }

    delete this.props.description;

    this.touch();
  }

  public hasDescription(): boolean {
    return this.props.description !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): JourneyCompletionDisputeStatus {
    return this.props.status;
  }

  public setStatus(status: JourneyCompletionDisputeStatus): void {
    this.props.status = status;

    this.touch();
  }

  public isOpen(): boolean {
    return this.props.status.isOpen();
  }

  public isUnderReview(): boolean {
    return this.props.status.isUnderReview();
  }

  public isResolved(): boolean {
    return this.props.status.isResolved();
  }

  public isRejected(): boolean {
    return this.props.status.isRejected();
  }

  public isWithdrawn(): boolean {
    return this.props.status.isWithdrawn();
  }

  public isTerminal(): boolean {
    return this.isResolved() || this.isRejected() || this.isWithdrawn();
  }

  public isActive(): boolean {
    return this.isOpen() || this.isUnderReview();
  }

  public canStartReview(): boolean {
    return this.isOpen();
  }

  public canResolve(): boolean {
    return this.isUnderReview();
  }

  public canReject(): boolean {
    return this.isUnderReview();
  }

  public canWithdraw(): boolean {
    return this.isOpen() || this.isUnderReview();
  }

  // ---------------------------------------------------------------------------
  // Resolution
  // ---------------------------------------------------------------------------

  public get resolvedByPublicId():
    JourneyCompletionDisputeResolvedByPublicId | undefined {
    return this.props.resolvedByPublicId;
  }

  public setResolvedByPublicId(
    resolvedByPublicId: JourneyCompletionDisputeResolvedByPublicId,
  ): void {
    this.props.resolvedByPublicId = resolvedByPublicId;

    this.touch();
  }

  public clearResolvedByPublicId(): void {
    if (this.props.resolvedByPublicId === undefined) {
      return;
    }

    delete this.props.resolvedByPublicId;

    this.touch();
  }

  public hasResolver(): boolean {
    return this.props.resolvedByPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Resolution Summary
  // ---------------------------------------------------------------------------

  public get resolutionSummary():
    JourneyCompletionDisputeResolutionSummary | undefined {
    return this.props.resolutionSummary;
  }

  public setResolutionSummary(
    resolutionSummary: JourneyCompletionDisputeResolutionSummary,
  ): void {
    this.props.resolutionSummary = resolutionSummary;

    this.touch();
  }

  public clearResolutionSummary(): void {
    if (this.props.resolutionSummary === undefined) {
      return;
    }

    delete this.props.resolutionSummary;

    this.touch();
  }

  public hasResolutionSummary(): boolean {
    return this.props.resolutionSummary !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Dispute Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Moves an OPEN dispute into active review.
   */
  public startReview(at: Date = new Date()): void {
    this.props.status = JourneyCompletionDisputeStatus.underReview();

    this.touch(at);
  }

  /**
   * Resolves the dispute.
   *
   * A resolver and resolution summary should normally be supplied by the
   * application layer before this operation is persisted.
   */
  public resolve(
    resolvedByPublicId: JourneyCompletionDisputeResolvedByPublicId,
    resolutionSummary: JourneyCompletionDisputeResolutionSummary,
    at: Date = new Date(),
  ): void {
    this.props.status = JourneyCompletionDisputeStatus.resolved();

    this.props.resolvedByPublicId = resolvedByPublicId;

    this.props.resolutionSummary = resolutionSummary;

    this.props.resolvedAt = JourneyCompletionDisputeEntity.cloneDate(at);

    this.props.rejectedAt = undefined;
    this.props.withdrawnAt = undefined;

    this.touch(at);
  }

  /**
   * Rejects the dispute.
   *
   * A resolver and resolution summary should normally be supplied by the
   * application layer before this operation is persisted.
   */
  public reject(
    resolvedByPublicId: JourneyCompletionDisputeResolvedByPublicId,
    resolutionSummary: JourneyCompletionDisputeResolutionSummary,
    at: Date = new Date(),
  ): void {
    this.props.status = JourneyCompletionDisputeStatus.rejected();

    this.props.resolvedByPublicId = resolvedByPublicId;

    this.props.resolutionSummary = resolutionSummary;

    this.props.rejectedAt = JourneyCompletionDisputeEntity.cloneDate(at);

    this.props.resolvedAt = undefined;
    this.props.withdrawnAt = undefined;

    this.touch(at);
  }

  /**
   * Withdraws the dispute.
   */
  public withdraw(at: Date = new Date()): void {
    this.props.status = JourneyCompletionDisputeStatus.withdrawn();

    this.props.withdrawnAt = JourneyCompletionDisputeEntity.cloneDate(at);

    this.props.resolvedAt = undefined;
    this.props.rejectedAt = undefined;

    this.touch(at);
  }

  /**
   * Resets the dispute to OPEN.
   *
   * This is primarily useful for controlled domain recovery/reprocessing.
   */
  public reopen(at: Date = new Date()): void {
    this.props.status = JourneyCompletionDisputeStatus.open();

    this.props.resolvedByPublicId = undefined;
    this.props.resolutionSummary = undefined;

    this.props.resolvedAt = undefined;
    this.props.rejectedAt = undefined;
    this.props.withdrawnAt = undefined;

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  public get openedAt(): Date {
    return JourneyCompletionDisputeEntity.cloneDate(this.props.openedAt);
  }

  public get resolvedAt(): Date | undefined {
    return this.props.resolvedAt
      ? JourneyCompletionDisputeEntity.cloneDate(this.props.resolvedAt)
      : undefined;
  }

  public get rejectedAt(): Date | undefined {
    return this.props.rejectedAt
      ? JourneyCompletionDisputeEntity.cloneDate(this.props.rejectedAt)
      : undefined;
  }

  public get withdrawnAt(): Date | undefined {
    return this.props.withdrawnAt
      ? JourneyCompletionDisputeEntity.cloneDate(this.props.withdrawnAt)
      : undefined;
  }

  // ---------------------------------------------------------------------------
  // Timestamp Queries
  // ---------------------------------------------------------------------------

  public hasBeenResolved(): boolean {
    return this.props.resolvedAt !== undefined;
  }

  public hasBeenRejected(): boolean {
    return this.props.rejectedAt !== undefined;
  }

  public hasBeenWithdrawn(): boolean {
    return this.props.withdrawnAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return JourneyCompletionDisputeEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyCompletionDisputeEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyCompletionDisputeEntity.cloneDate(updatedAt);
  }

  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyCompletionDisputeEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneyCompletionDisputeEntity): boolean {
    if (!other) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyCompletionDisputeProps };

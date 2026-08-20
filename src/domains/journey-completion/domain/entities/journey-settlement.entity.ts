// -----------------------------------------------------------------------------
// Journey Settlement Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneySettlementPublicId } from '../value-objects/journey-settlement-public-id.vo';

import type { JourneyCompletionJourneyPublicId } from '../value-objects/journey-completion-journey-public-id.vo';

import type { JourneyCompletionProviderPublicId } from '../value-objects/journey-completion-provider-public-id.vo';

import { JourneySettlementStatus } from '../value-objects/journey-settlement-status.vo';

import type { JourneySettlementFinancialTransactionPublicId } from '../value-objects/journey-settlement-financial-transaction-public-id.vo';

import type { JourneySettlementFailureReason } from '../value-objects/journey-settlement-failure-reason.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneySettlementProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: JourneySettlementPublicId;

  // ---------------------------------------------------------------------------
  // Journey Completion
  // ---------------------------------------------------------------------------

  /**
   * Internal identity of the Journey Completion entity/aggregate
   * this settlement belongs to.
   *
   * This is intentionally represented by the internal UniqueEntityId
   * rather than a cross-domain public identifier.
   */
  completionId: UniqueEntityId;

  // ---------------------------------------------------------------------------
  // Cross-domain references
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey being settled.
   *
   * References Journey.publicId.
   *
   * This is intentionally NOT a Prisma relation.
   */
  journeyPublicId: JourneyCompletionJourneyPublicId;

  /**
   * Public identity of the Journey provider receiving the settlement.
   *
   * References Identity.publicId.
   *
   * This is intentionally NOT a Prisma relation.
   */
  providerPublicId: JourneyCompletionProviderPublicId;

  // ---------------------------------------------------------------------------
  // Settlement lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current settlement status.
   */
  status: JourneySettlementStatus;

  /**
   * Public identity of the Financial-domain transaction associated
   * with this settlement.
   *
   * This is optional until the settlement has been submitted to
   * the Financial domain.
   */
  financialTransactionPublicId?:
    JourneySettlementFinancialTransactionPublicId | undefined;

  // ---------------------------------------------------------------------------
  // Lifecycle timestamps
  // ---------------------------------------------------------------------------

  submittedAt?: Date | undefined;

  processingAt?: Date | undefined;

  completedAt?: Date | undefined;

  failedAt?: Date | undefined;

  heldAt?: Date | undefined;

  cancelledAt?: Date | undefined;

  // ---------------------------------------------------------------------------
  // Failure
  // ---------------------------------------------------------------------------

  failureReason?: JourneySettlementFailureReason | undefined;

  // ---------------------------------------------------------------------------
  // Aggregate version
  // ---------------------------------------------------------------------------

  version: number;

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
 * Represents the financial settlement associated with a completed Journey.
 *
 * Journey Settlement is created as part of the Journey Completion lifecycle
 * and represents the hand-off and processing of the provider's settlement
 * through the Financial domain.
 *
 * Settlement lifecycle:
 *
 * PENDING
 *   Settlement exists but has not yet been submitted.
 *
 * SUBMITTED
 *   Settlement has been submitted to the Financial domain.
 *
 * PROCESSING
 *   Financial processing is underway.
 *
 * COMPLETED
 *   Settlement has completed successfully.
 *
 * FAILED
 *   Settlement processing has failed.
 *
 * HELD
 *   Settlement has been placed on hold.
 *
 * CANCELLED
 *   Settlement has been cancelled.
 *
 * The entity does not directly own Financial-domain data. It stores only
 * the Financial transaction's public identifier.
 */
export class JourneySettlementEntity extends Entity<
  JourneySettlementProps,
  JourneySettlementPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneySettlementProps,
    id?: UniqueEntityId,
    publicId?: JourneySettlementPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneySettlementPublicId;

    completionId: UniqueEntityId;

    journeyPublicId: JourneyCompletionJourneyPublicId;

    providerPublicId: JourneyCompletionProviderPublicId;

    /**
     * Defaults to PENDING for newly created settlements.
     */
    status?: JourneySettlementStatus;

    financialTransactionPublicId?:
      JourneySettlementFinancialTransactionPublicId | undefined;

    submittedAt?: Date | undefined;

    processingAt?: Date | undefined;

    completedAt?: Date | undefined;

    failedAt?: Date | undefined;

    heldAt?: Date | undefined;

    cancelledAt?: Date | undefined;

    failureReason?: JourneySettlementFailureReason | undefined;

    version?: number;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): JourneySettlementEntity {
    const now = new Date();

    const publicId = props.publicId ?? new JourneySettlementPublicId();

    return new JourneySettlementEntity(
      {
        publicId,

        completionId: props.completionId,

        journeyPublicId: props.journeyPublicId,

        providerPublicId: props.providerPublicId,

        status: props.status ?? JourneySettlementStatus.pending(),

        ...(props.financialTransactionPublicId !== undefined
          ? {
              financialTransactionPublicId: props.financialTransactionPublicId,
            }
          : {}),

        ...(props.submittedAt !== undefined
          ? {
              submittedAt: JourneySettlementEntity.cloneDate(props.submittedAt),
            }
          : {}),

        ...(props.processingAt !== undefined
          ? {
              processingAt: JourneySettlementEntity.cloneDate(
                props.processingAt,
              ),
            }
          : {}),

        ...(props.completedAt !== undefined
          ? {
              completedAt: JourneySettlementEntity.cloneDate(props.completedAt),
            }
          : {}),

        ...(props.failedAt !== undefined
          ? {
              failedAt: JourneySettlementEntity.cloneDate(props.failedAt),
            }
          : {}),

        ...(props.heldAt !== undefined
          ? {
              heldAt: JourneySettlementEntity.cloneDate(props.heldAt),
            }
          : {}),

        ...(props.cancelledAt !== undefined
          ? {
              cancelledAt: JourneySettlementEntity.cloneDate(props.cancelledAt),
            }
          : {}),

        ...(props.failureReason !== undefined
          ? {
              failureReason: props.failureReason,
            }
          : {}),

        version: props.version ?? 1,

        createdAt: JourneySettlementEntity.cloneDate(props.createdAt ?? now),

        updatedAt: JourneySettlementEntity.cloneDate(props.updatedAt ?? now),
      },
      undefined,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneySettlementProps,
    id: UniqueEntityId,
    publicId: JourneySettlementPublicId,
  ): JourneySettlementEntity {
    return new JourneySettlementEntity(
      {
        ...props,

        // Persistence public ID is authoritative during rehydration.
        publicId,

        submittedAt:
          props.submittedAt !== undefined
            ? JourneySettlementEntity.cloneDate(props.submittedAt)
            : undefined,

        processingAt:
          props.processingAt !== undefined
            ? JourneySettlementEntity.cloneDate(props.processingAt)
            : undefined,

        completedAt:
          props.completedAt !== undefined
            ? JourneySettlementEntity.cloneDate(props.completedAt)
            : undefined,

        failedAt:
          props.failedAt !== undefined
            ? JourneySettlementEntity.cloneDate(props.failedAt)
            : undefined,

        heldAt:
          props.heldAt !== undefined
            ? JourneySettlementEntity.cloneDate(props.heldAt)
            : undefined,

        cancelledAt:
          props.cancelledAt !== undefined
            ? JourneySettlementEntity.cloneDate(props.cancelledAt)
            : undefined,

        createdAt: JourneySettlementEntity.cloneDate(props.createdAt),

        updatedAt: JourneySettlementEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneySettlementPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Journey Completion
  // ---------------------------------------------------------------------------

  public get completionId(): UniqueEntityId {
    return this.props.completionId;
  }

  public setCompletionId(completionId: UniqueEntityId): void {
    this.props.completionId = completionId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Journey
  // ---------------------------------------------------------------------------

  public get journeyPublicId(): JourneyCompletionJourneyPublicId {
    return this.props.journeyPublicId;
  }

  public setJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): void {
    this.props.journeyPublicId = journeyPublicId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Provider
  // ---------------------------------------------------------------------------

  public get providerPublicId(): JourneyCompletionProviderPublicId {
    return this.props.providerPublicId;
  }

  public setProviderPublicId(
    providerPublicId: JourneyCompletionProviderPublicId,
  ): void {
    this.props.providerPublicId = providerPublicId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): JourneySettlementStatus {
    return this.props.status;
  }

  public setStatus(status: JourneySettlementStatus): void {
    this.props.status = status;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Status Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.status.isPending();
  }

  public isSubmitted(): boolean {
    return this.props.status.isSubmitted();
  }

  public isProcessing(): boolean {
    return this.props.status.isProcessing();
  }

  public isCompleted(): boolean {
    return this.props.status.isCompleted();
  }

  public isFailed(): boolean {
    return this.props.status.isFailed();
  }

  public isHeld(): boolean {
    return this.props.status.isHeld();
  }

  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  public isTerminal(): boolean {
    return this.isCompleted() || this.isFailed() || this.isCancelled();
  }

  // ---------------------------------------------------------------------------
  // Financial Transaction
  // ---------------------------------------------------------------------------

  public get financialTransactionPublicId():
    JourneySettlementFinancialTransactionPublicId | undefined {
    return this.props.financialTransactionPublicId;
  }

  public setFinancialTransactionPublicId(
    financialTransactionPublicId: JourneySettlementFinancialTransactionPublicId,
  ): void {
    this.props.financialTransactionPublicId = financialTransactionPublicId;

    this.touch();
  }

  public clearFinancialTransactionPublicId(): void {
    if (this.props.financialTransactionPublicId === undefined) {
      return;
    }

    delete this.props.financialTransactionPublicId;

    this.touch();
  }

  public hasFinancialTransaction(): boolean {
    return this.props.financialTransactionPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Settlement Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Marks the settlement as submitted to the Financial domain.
   */
  public submit(at: Date = new Date()): void {
    this.props.status = JourneySettlementStatus.submitted();

    this.props.submittedAt = JourneySettlementEntity.cloneDate(at);

    this.props.processingAt = undefined;
    this.props.completedAt = undefined;
    this.props.failedAt = undefined;
    this.props.heldAt = undefined;
    this.props.cancelledAt = undefined;

    this.props.failureReason = undefined;

    this.touch(at);
  }

  /**
   * Marks the settlement as being processed by the Financial domain.
   */
  public startProcessing(at: Date = new Date()): void {
    this.props.status = JourneySettlementStatus.processing();

    this.props.processingAt = JourneySettlementEntity.cloneDate(at);

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;
    this.props.heldAt = undefined;
    this.props.cancelledAt = undefined;

    this.props.failureReason = undefined;

    this.touch(at);
  }

  /**
   * Marks the settlement as successfully completed.
   */
  public complete(at: Date = new Date()): void {
    this.props.status = JourneySettlementStatus.completed();

    this.props.completedAt = JourneySettlementEntity.cloneDate(at);

    this.props.failedAt = undefined;
    this.props.heldAt = undefined;
    this.props.cancelledAt = undefined;

    this.props.failureReason = undefined;

    this.touch(at);
  }

  /**
   * Marks the settlement as failed.
   */
  public fail(
    failureReason?: JourneySettlementFailureReason,
    at: Date = new Date(),
  ): void {
    this.props.status = JourneySettlementStatus.failed();

    this.props.failedAt = JourneySettlementEntity.cloneDate(at);

    this.props.completedAt = undefined;
    this.props.heldAt = undefined;
    this.props.cancelledAt = undefined;

    this.props.failureReason = failureReason;

    this.touch(at);
  }

  /**
   * Places the settlement on hold.
   */
  public hold(at: Date = new Date()): void {
    this.props.status = JourneySettlementStatus.held();

    this.props.heldAt = JourneySettlementEntity.cloneDate(at);

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(at);
  }

  /**
   * Cancels the settlement.
   */
  public cancel(at: Date = new Date()): void {
    this.props.status = JourneySettlementStatus.cancelled();

    this.props.cancelledAt = JourneySettlementEntity.cloneDate(at);

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamp Queries
  // ---------------------------------------------------------------------------

  public get submittedAt(): Date | undefined {
    return this.props.submittedAt
      ? JourneySettlementEntity.cloneDate(this.props.submittedAt)
      : undefined;
  }

  public get processingAt(): Date | undefined {
    return this.props.processingAt
      ? JourneySettlementEntity.cloneDate(this.props.processingAt)
      : undefined;
  }

  public get completedAt(): Date | undefined {
    return this.props.completedAt
      ? JourneySettlementEntity.cloneDate(this.props.completedAt)
      : undefined;
  }

  public get failedAt(): Date | undefined {
    return this.props.failedAt
      ? JourneySettlementEntity.cloneDate(this.props.failedAt)
      : undefined;
  }

  public get heldAt(): Date | undefined {
    return this.props.heldAt
      ? JourneySettlementEntity.cloneDate(this.props.heldAt)
      : undefined;
  }

  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt
      ? JourneySettlementEntity.cloneDate(this.props.cancelledAt)
      : undefined;
  }

  // ---------------------------------------------------------------------------
  // Failure
  // ---------------------------------------------------------------------------

  public get failureReason(): JourneySettlementFailureReason | undefined {
    return this.props.failureReason;
  }

  public setFailureReason(failureReason: JourneySettlementFailureReason): void {
    this.props.failureReason = failureReason;
    this.touch();
  }

  public clearFailureReason(): void {
    if (this.props.failureReason === undefined) {
      return;
    }

    delete this.props.failureReason;

    this.touch();
  }

  public hasFailureReason(): boolean {
    return this.props.failureReason !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Version
  // ---------------------------------------------------------------------------

  public get version(): number {
    return this.props.version;
  }

  public incrementVersion(): void {
    this.props.version += 1;
    this.touch();
  }

  public setVersion(version: number): void {
    if (!Number.isInteger(version) || version < 1) {
      throw new Error('Journey settlement version must be a positive integer.');
    }

    this.props.version = version;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return JourneySettlementEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneySettlementEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneySettlementEntity.cloneDate(updatedAt);
  }

  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneySettlementEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneySettlementEntity): boolean {
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

export type { JourneySettlementProps };

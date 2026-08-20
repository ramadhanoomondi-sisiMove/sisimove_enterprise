// -----------------------------------------------------------------------------
// Journey Settlement Aggregate
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneySettlementEntity } from '../entities/journey-settlement.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import {
  JourneySettlementCreatedEvent,
  JourneySettlementSubmittedEvent,
  JourneySettlementCompletedEvent,
  JourneySettlementFailedEvent,
  JourneySettlementHeldEvent,
  JourneySettlementCancelledEvent,
} from '../events';

import type { JourneySettlementDomainEvent } from '../events';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import {
  JourneySettlementInvariantException,
  JourneySettlementInvalidStatusTransitionException,
  JourneySettlementAlreadyCompletedException,
  JourneySettlementAlreadyFailedException,
} from '../exceptions';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneySettlementStatus } from '../value-objects';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

/**
 * Aggregate root for the Journey Settlement lifecycle.
 *
 * Aggregate boundary:
 *
 * JourneySettlementAggregate
 * └── JourneySettlementEntity
 *
 * Journey Settlement owns:
 *
 * - settlement lifecycle
 * - submission
 * - financial processing state
 * - completion
 * - failure
 * - hold
 * - cancellation
 *
 * Journey Completion, Journey, Provider and Financial Transaction remain
 * outside this aggregate's ownership boundary.
 */
export class JourneySettlementAggregate extends AggregateRoot<JourneySettlementEntity> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(
    settlement: JourneySettlementEntity,
    id?: UniqueEntityId,
  ) {
    super(settlement, id);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(
    settlement: JourneySettlementEntity,
    correlationId: string,
    causationId?: string,
  ): JourneySettlementAggregate {
    const aggregate = new JourneySettlementAggregate(settlement, settlement.id);

    aggregate.assertStructuralInvariant();
    aggregate.recordCreated(correlationId, causationId);

    return aggregate;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    settlement: JourneySettlementEntity,
  ): JourneySettlementAggregate {
    const aggregate = new JourneySettlementAggregate(settlement, settlement.id);

    aggregate.assertAggregateInvariant();

    return aggregate;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  public get journeySettlement(): JourneySettlementEntity {
    return this.props;
  }

  public get settlement(): JourneySettlementEntity {
    return this.props;
  }

  public get aggregateId(): UniqueEntityId {
    return this.id;
  }

  public override get publicId(): JourneySettlementEntity['publicId'] {
    return this.journeySettlement.publicId;
  }

  // ===========================================================================
  // Journey Completion
  // ===========================================================================

  /**
   * Internal Journey Completion aggregate identity.
   *
   * JourneySettlementEntity intentionally stores completionId rather than a
   * JourneyCompletion public ID.
   */
  public get completionId(): UniqueEntityId {
    return this.journeySettlement.completionId;
  }

  // ===========================================================================
  // Journey
  // ===========================================================================

  public get journeyPublicId(): JourneySettlementEntity['journeyPublicId'] {
    return this.journeySettlement.journeyPublicId;
  }

  public belongsToJourney(
    journeyPublicId: JourneySettlementEntity['journeyPublicId'],
  ): boolean {
    return this.journeyPublicId.equals(journeyPublicId);
  }

  // ===========================================================================
  // Provider
  // ===========================================================================

  public get providerPublicId(): JourneySettlementEntity['providerPublicId'] {
    return this.journeySettlement.providerPublicId;
  }

  public belongsToProvider(
    providerPublicId: JourneySettlementEntity['providerPublicId'],
  ): boolean {
    return this.providerPublicId.equals(providerPublicId);
  }

  // ===========================================================================
  // Financial Transaction
  // ===========================================================================

  public get financialTransactionPublicId(): JourneySettlementEntity['financialTransactionPublicId'] {
    return this.journeySettlement.financialTransactionPublicId;
  }

  public hasFinancialTransaction(): boolean {
    return this.financialTransactionPublicId !== undefined;
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  public get status(): JourneySettlementStatus {
    return this.journeySettlement.status;
  }

  public get submittedAt(): Date | undefined {
    return this.journeySettlement.submittedAt;
  }

  public get processingAt(): Date | undefined {
    return this.journeySettlement.processingAt;
  }

  public get completedAt(): Date | undefined {
    return this.journeySettlement.completedAt;
  }

  public get failedAt(): Date | undefined {
    return this.journeySettlement.failedAt;
  }

  public get heldAt(): Date | undefined {
    return this.journeySettlement.heldAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.journeySettlement.cancelledAt;
  }

  public get failureReason(): JourneySettlementEntity['failureReason'] {
    return this.journeySettlement.failureReason;
  }

  public get version(): number {
    return this.journeySettlement.version;
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isPending(): boolean {
    return this.status.isPending();
  }

  public isSubmitted(): boolean {
    return this.status.isSubmitted();
  }

  public isProcessing(): boolean {
    return this.status.isProcessing();
  }

  public isCompleted(): boolean {
    return this.status.isCompleted();
  }

  public isFailed(): boolean {
    return this.status.isFailed();
  }

  public isHeld(): boolean {
    return this.status.isHeld();
  }

  public isCancelled(): boolean {
    return this.status.isCancelled();
  }

  public isActive(): boolean {
    return (
      this.isPending() ||
      this.isSubmitted() ||
      this.isProcessing() ||
      this.isHeld()
    );
  }

  public isTerminal(): boolean {
    return this.isCompleted() || this.isFailed() || this.isCancelled();
  }

  // ===========================================================================
  // Lifecycle Capabilities
  // ===========================================================================

  public canSubmit(): boolean {
    return this.isPending();
  }

  public canProcess(): boolean {
    return this.isSubmitted();
  }

  public canComplete(): boolean {
    return this.isProcessing();
  }

  public canFail(): boolean {
    return this.isSubmitted() || this.isProcessing();
  }

  public canHold(): boolean {
    return this.isSubmitted() || this.isProcessing();
  }

  public canCancel(): boolean {
    return this.isPending() || this.isSubmitted() || this.isHeld();
  }

  public canModify(): boolean {
    return !this.isCompleted() && !this.isCancelled();
  }

  // ===========================================================================
  // Submission
  // ===========================================================================

  public submit(
    correlationId: string,
    causationId?: string,
    submittedAt: Date = new Date(),
  ): void {
    if (!this.isPending()) {
      throw new JourneySettlementInvalidStatusTransitionException(
        this.status.value,
        'SUBMITTED',
      );
    }

    this.journeySettlement.submit(submittedAt);
    this.journeySettlement.incrementVersion();

    this.addDomainEvent(
      new JourneySettlementSubmittedEvent(
        this.completionId.toString(),
        '',
        this.journeyPublicId.value,
        this.providerPublicId.value,
        this.publicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Processing
  // ===========================================================================

  public markProcessing(
    correlationId: string,
    causationId?: string,
    processingAt: Date = new Date(),
  ): void {
    if (!this.isSubmitted()) {
      throw new JourneySettlementInvalidStatusTransitionException(
        this.status.value,
        'PROCESSING',
      );
    }

    this.journeySettlement.startProcessing(processingAt);
    this.journeySettlement.incrementVersion();

    void correlationId;
    void causationId;
  }

  // ===========================================================================
  // Completion
  // ===========================================================================

  public complete(
    financialTransactionPublicId: JourneySettlementEntity['financialTransactionPublicId'],
    correlationId: string,
    causationId?: string,
    completedAt: Date = new Date(),
  ): void {
    if (this.isCompleted()) {
      throw new JourneySettlementAlreadyCompletedException(this.publicId.value);
    }

    if (this.isFailed()) {
      throw new JourneySettlementAlreadyFailedException(this.publicId.value);
    }

    if (this.isCancelled()) {
      throw new JourneySettlementInvalidStatusTransitionException(
        this.status.value,
        'COMPLETED',
      );
    }

    if (!this.isProcessing()) {
      throw new JourneySettlementInvalidStatusTransitionException(
        this.status.value,
        'COMPLETED',
      );
    }

    if (!financialTransactionPublicId) {
      throw new JourneySettlementInvariantException(
        'A completed Journey Settlement must have a Financial transaction public ID.',
      );
    }

    this.journeySettlement.setFinancialTransactionPublicId(
      financialTransactionPublicId,
    );

    this.journeySettlement.complete(completedAt);
    this.journeySettlement.incrementVersion();

    this.addDomainEvent(
      new JourneySettlementCompletedEvent(
        this.completionId.toString(),
        '',
        this.journeyPublicId.value,
        this.providerPublicId.value,
        this.publicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Failure
  // ===========================================================================

  public fail(
    failureReason: JourneySettlementEntity['failureReason'],
    correlationId: string,
    causationId?: string,
    failedAt: Date = new Date(),
  ): void {
    if (this.isCompleted()) {
      throw new JourneySettlementAlreadyCompletedException(this.publicId.value);
    }

    if (this.isFailed()) {
      throw new JourneySettlementAlreadyFailedException(this.publicId.value);
    }

    if (!this.canFail()) {
      throw new JourneySettlementInvalidStatusTransitionException(
        this.status.value,
        'FAILED',
      );
    }

    if (!failureReason) {
      throw new JourneySettlementInvariantException(
        'A failed Journey Settlement must have a failure reason.',
      );
    }

    this.journeySettlement.fail(failureReason, failedAt);
    this.journeySettlement.incrementVersion();

    this.addDomainEvent(
      new JourneySettlementFailedEvent(
        this.completionId.toString(),
        '',
        this.journeyPublicId.value,
        this.providerPublicId.value,
        this.publicId.value,
        failureReason.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Hold
  // ===========================================================================

  public hold(
    correlationId: string,
    causationId?: string,
    heldAt: Date = new Date(),
  ): void {
    if (!this.canHold()) {
      throw new JourneySettlementInvalidStatusTransitionException(
        this.status.value,
        'HELD',
      );
    }

    this.journeySettlement.hold(heldAt);
    this.journeySettlement.incrementVersion();

    this.addDomainEvent(
      new JourneySettlementHeldEvent(
        this.completionId.toString(),
        '',
        this.journeyPublicId.value,
        this.providerPublicId.value,
        this.publicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Resume
  // ===========================================================================

  /**
   * Releases a held settlement back into SUBMITTED state.
   *
   * There is no JourneySettlementResumedEvent in the available event set,
   * therefore this transition is intentionally state-only.
   */
  public resume(resumedAt: Date = new Date()): void {
    if (!this.isHeld()) {
      throw new JourneySettlementInvalidStatusTransitionException(
        this.status.value,
        'SUBMITTED',
      );
    }

    this.journeySettlement.submit(resumedAt);
    this.journeySettlement.incrementVersion();
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  public cancel(
    correlationId: string,
    causationId?: string,
    cancelledAt: Date = new Date(),
  ): void {
    if (this.isCompleted()) {
      throw new JourneySettlementAlreadyCompletedException(this.publicId.value);
    }

    if (this.isFailed()) {
      throw new JourneySettlementAlreadyFailedException(this.publicId.value);
    }

    if (!this.canCancel()) {
      throw new JourneySettlementInvalidStatusTransitionException(
        this.status.value,
        'CANCELLED',
      );
    }

    this.journeySettlement.cancel(cancelledAt);
    this.journeySettlement.incrementVersion();

    this.addDomainEvent(
      new JourneySettlementCancelledEvent(
        this.completionId.toString(),
        '',
        this.journeyPublicId.value,
        this.providerPublicId.value,
        this.publicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // State Helpers
  // ===========================================================================

  public isSettled(): boolean {
    return this.isCompleted();
  }

  public isAwaitingSubmission(): boolean {
    return this.isPending();
  }

  public isAwaitingProcessing(): boolean {
    return this.isSubmitted();
  }

  public isBeingProcessed(): boolean {
    return this.isProcessing();
  }

  public isAwaitingResolution(): boolean {
    return this.isHeld();
  }

  public requiresRetry(): boolean {
    return this.isFailed();
  }

  // ===========================================================================
  // Consistency
  // ===========================================================================

  public hasValidStructure(): boolean {
    return (
      Boolean(this.completionId) &&
      Boolean(this.journeyPublicId.value) &&
      Boolean(this.providerPublicId.value)
    );
  }

  public hasConsistentLifecycle(): boolean {
    if (this.isPending()) {
      return (
        this.submittedAt === undefined &&
        this.processingAt === undefined &&
        this.completedAt === undefined &&
        this.failedAt === undefined &&
        this.heldAt === undefined &&
        this.cancelledAt === undefined
      );
    }

    if (this.isSubmitted()) {
      return (
        this.submittedAt !== undefined &&
        this.processingAt === undefined &&
        this.completedAt === undefined &&
        this.failedAt === undefined &&
        this.heldAt === undefined &&
        this.cancelledAt === undefined
      );
    }

    if (this.isProcessing()) {
      return (
        this.submittedAt !== undefined &&
        this.processingAt !== undefined &&
        this.completedAt === undefined &&
        this.failedAt === undefined &&
        this.heldAt === undefined &&
        this.cancelledAt === undefined
      );
    }

    if (this.isCompleted()) {
      return (
        this.submittedAt !== undefined &&
        this.processingAt !== undefined &&
        this.completedAt !== undefined &&
        this.failedAt === undefined &&
        this.heldAt === undefined &&
        this.cancelledAt === undefined &&
        this.hasFinancialTransaction()
      );
    }

    if (this.isFailed()) {
      return (
        this.submittedAt !== undefined &&
        this.failedAt !== undefined &&
        this.completedAt === undefined &&
        this.heldAt === undefined &&
        this.cancelledAt === undefined &&
        this.failureReason !== undefined
      );
    }

    if (this.isHeld()) {
      return (
        this.submittedAt !== undefined &&
        this.heldAt !== undefined &&
        this.completedAt === undefined &&
        this.failedAt === undefined &&
        this.cancelledAt === undefined
      );
    }

    if (this.isCancelled()) {
      return (
        this.cancelledAt !== undefined &&
        this.completedAt === undefined &&
        this.failedAt === undefined
      );
    }

    return false;
  }

  public hasValidFinancialReference(): boolean {
    return !this.isCompleted() || this.hasFinancialTransaction();
  }

  public assertAggregateInvariant(): void {
    if (!this.hasValidStructure()) {
      throw new JourneySettlementInvariantException(
        'Journey Settlement contains invalid aggregate references.',
      );
    }

    if (!this.hasConsistentLifecycle()) {
      throw new JourneySettlementInvariantException(
        'Journey Settlement contains an inconsistent lifecycle state.',
      );
    }

    if (!this.hasValidFinancialReference()) {
      throw new JourneySettlementInvariantException(
        'Journey Settlement contains an invalid Financial transaction reference.',
      );
    }
  }

  private assertStructuralInvariant(): void {
    this.assertAggregateInvariant();
  }

  // ===========================================================================
  // Domain Events
  // ===========================================================================

  public recordDomainEvent(event: JourneySettlementDomainEvent): void {
    this.addDomainEvent(event);
  }

  private recordCreated(correlationId: string, causationId?: string): void {
    this.addDomainEvent(
      new JourneySettlementCreatedEvent(
        this.completionId.toString(),
        '',
        this.journeyPublicId.value,
        this.providerPublicId.value,
        this.publicId.value,
        correlationId,
        causationId,
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// Financial Disbursement Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate root for the Financial Disbursement lifecycle.
//
// Aggregate boundary:
//
// FinancialDisbursementAggregate
// ├── FinancialDisbursementEntity
// │   └── FinancialDisbursementAttemptEntity[]
// └── FinancialAccountWithdrawalDestination (immutable value object)
//
// IMPORTANT:
//
// FinancialDisbursementEntity is the aggregate root entity.
//
// FinancialDisbursementAttemptEntity[] is owned exclusively by the
// FinancialDisbursementEntity.
//
// FinancialAccountWithdrawalDestination is an immutable value object
// captured from the originating withdrawal. It is stored as a snapshot on
// FinancialDisbursementEntity and is not a configured destination entity.
// No destination registration, repository lookup, or account-level destination
// ownership relationship is required.
//
// FinancialDisbursementEntity.attempts is the single source of truth for
// disbursement attempts.
//
// The aggregate does not maintain a second attempt collection.
//
// -----------------------------------------------------------------------------
//
// Identity model:
//
// - UniqueEntityId
//     Internal persistence/domain identity.
//
// - FinancialAccountPublicId
//     Public identity of the source Financial Account.
//
// - FinancialDisbursementPublicId
//     Public identity of this Financial Disbursement.
//
// - FinancialAccountWithdrawalDestination
//     Immutable type/value snapshot of the payout destination.
//
// - FinancialDisbursementAttemptPublicId
//     Public identity of an execution attempt.
//
// Internal identities and public identities are intentionally distinct.
//
// Internal identities are used for internal aggregate consistency checks.
//
// Public identities are exposed at application/domain-event boundaries.
//
// No identity type is converted into another through casts or assertions.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Own the Financial Disbursement entity.
// - Own the lifecycle of Financial Disbursement Attempts through the root.
// - Preserve the immutable payout destination snapshot.
// - Enforce amount consistency.
// - Enforce currency consistency.
// - Enforce attempt ownership.
// - Enforce attempt lifecycle consistency.
// - Enforce single-processing-attempt invariant.
// - Enforce single-successful-attempt invariant.
// - Coordinate disbursement processing.
// - Coordinate execution-attempt lifecycle.
// - Coordinate disbursement completion.
// - Coordinate disbursement failure.
// - Coordinate disbursement cancellation.
// - Associate the resulting Financial Transaction reference.
// - Emit Financial Disbursement domain events.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - Execute provider APIs.
// - Communicate with M-Pesa, banks, or other providers.
// - Store provider credentials or secrets.
// - Select provider routing.
// - Determine provider-specific retry policy.
// - Perform external money movement.
// - Modify Financial Account balances directly.
// - Create or post Financial Transactions.
// - Perform accounting.
// - Persist itself.
// - Own Financial Account state.
// - Own Financial Account balance state.
// - Own the underlying external payment instrument.
//
// External provider execution belongs to the Integration/application boundary.
//
// Financial Account balance mutation belongs to the Financial Account
// aggregate.
//
// Financial Transaction creation/posting belongs to the Financial Transaction
// aggregate.
//
// Persistence belongs to repository/infrastructure boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { FinancialDisbursementEntity } from '../entities/financial-disbursement.entity';

import type { FinancialAccountWithdrawalDestination } from '../value-objects/financial-account-withdrawal-destination.vo';

import type { FinancialDisbursementAttemptEntity } from '../entities/financial-disbursement-attempt.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { FinancialDisbursementCreatedEvent } from '../events/financial-disbursement-created.event';

import { FinancialDisbursementProcessingEvent } from '../events/financial-disbursement-processing.event';

import { FinancialDisbursementCompletedEvent } from '../events/financial-disbursement-completed.event';

import { FinancialDisbursementFailedEvent } from '../events/financial-disbursement-failed.event';

import { FinancialDisbursementCancelledEvent } from '../events/financial-disbursement-cancelled.event';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialInvariantException } from '../exceptions/financial-invariant.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { Money } from '../value-objects/money.vo';

import type { Currency } from '../value-objects/currency.vo';

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialDisbursementPublicId } from '../value-objects/financial-disbursement-public-id.vo';

import type { FinancialDisbursementAttemptPublicId } from '../value-objects/financial-disbursement-attempt-public-id.vo';

import type { FinancialDisbursementStatus } from '../value-objects/financial-disbursement-status.vo';

import type { FinancialReferenceType } from '../value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../value-objects/financial-reference-public-id.vo';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialDisbursementAggregateProps {
  /**
   * Aggregate root entity.
   *
   * The disbursement owns its execution-attempt collection.
   */
  disbursement: FinancialDisbursementEntity;
}

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class FinancialDisbursementAggregate extends AggregateRoot<
  FinancialDisbursementAggregateProps,
  FinancialDisbursementPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: FinancialDisbursementAggregateProps) {
    super(props, props.disbursement.id, props.disbursement.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new Financial Disbursement aggregate.
   *
   * Creation does not implicitly emit a domain event.
   *
   * The application workflow may explicitly call recordCreated() after the
   * aggregate has been successfully created and validated.
   */
  public static create(
    disbursement: FinancialDisbursementEntity,
  ): FinancialDisbursementAggregate {
    const aggregate = new FinancialDisbursementAggregate({ disbursement });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates an existing Financial Disbursement aggregate.
   *
   * The supplied FinancialDisbursementEntity must already contain every
   * FinancialDisbursementAttemptEntity belonging to the aggregate.
   *
   * Rehydration does not emit domain events.
   */
  public static rehydrate(
    disbursement: FinancialDisbursementEntity,
  ): FinancialDisbursementAggregate {
    const aggregate = new FinancialDisbursementAggregate({ disbursement });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the aggregate root entity.
   */
  public get disbursement(): FinancialDisbursementEntity {
    return this.props.disbursement;
  }

  /**
   * Returns the immutable payout destination snapshot.
   */
  public get destination(): FinancialAccountWithdrawalDestination {
    return this.disbursement.destination;
  }

  /**
   * Returns the attempts owned by the aggregate root.
   *
   * FinancialDisbursementEntity.attempts remains the single source of truth.
   */
  public get attempts(): readonly FinancialDisbursementAttemptEntity[] {
    return this.disbursement.attempts;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  public override get id(): UniqueEntityId {
    return this.disbursement.id;
  }

  public override get publicId(): FinancialDisbursementPublicId {
    return this.disbursement.publicId;
  }

  // ===========================================================================
  // Disbursement Properties
  // ===========================================================================

  /**
   * Internal identity of the source Financial Account.
   */
  public get sourceAccountId(): UniqueEntityId {
    return this.disbursement.sourceAccountId;
  }

  /**
   * Public identity of the source Financial Account.
   *
   * This remains separate from sourceAccountId.
   */
  public get sourceAccountPublicId(): FinancialAccountPublicId {
    return this.disbursement.sourceAccountPublicId;
  }

  /**
   * Destination type captured when the withdrawal was requested.
   */
  public get destinationType(): string {
    return this.destination.type;
  }

  /**
   * Destination value captured when the withdrawal was requested.
   */
  public get destinationValue(): string {
    return this.destination.value;
  }

  /**
   * Current disbursement lifecycle status.
   */
  public get status(): FinancialDisbursementStatus {
    return this.disbursement.status;
  }

  /**
   * Disbursement monetary amount.
   */
  public get amount(): Money {
    return this.disbursement.amount;
  }

  /**
   * Disbursement currency.
   */
  public get currency(): Currency {
    return this.amount.currency;
  }

  /**
   * Opaque Financial Transaction reference.
   */
  public get transactionPublicId(): FinancialReferencePublicId | undefined {
    return this.disbursement.transactionPublicId;
  }

  /**
   * Opaque originating business reference type.
   */
  public get referenceType(): FinancialReferenceType | undefined {
    return this.disbursement.referenceType;
  }

  /**
   * Opaque originating business reference public identity.
   */
  public get referencePublicId(): FinancialReferencePublicId | undefined {
    return this.disbursement.referencePublicId;
  }

  public get requestedAt(): Date {
    return this.disbursement.requestedAt;
  }

  public get completedAt(): Date | undefined {
    return this.disbursement.completedAt;
  }

  public get failedAt(): Date | undefined {
    return this.disbursement.failedAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.disbursement.cancelledAt;
  }

  public get createdAt(): Date {
    return this.disbursement.createdAt;
  }

  public get updatedAt(): Date {
    return this.disbursement.updatedAt;
  }

  // ===========================================================================
  // Destination Snapshot
  // ===========================================================================

  /**
   * The destination is an immutable type/value snapshot. Provider routing,
   * destination validation, and external execution belong to the
   * application/integration boundary.
   */

  // ===========================================================================
  // Attempts
  // ===========================================================================

  /**
   * Returns an attempt by public identity.
   */
  public getAttempt(
    attemptPublicId: FinancialDisbursementAttemptPublicId,
  ): FinancialDisbursementAttemptEntity | undefined {
    return this.attempts.find((attempt) =>
      attempt.publicId.equals(attemptPublicId),
    );
  }

  /**
   * Returns the latest execution attempt.
   */
  public getLatestAttempt(): FinancialDisbursementAttemptEntity | undefined {
    return this.disbursement.getLatestAttempt();
  }

  /**
   * Returns the total number of execution attempts.
   */
  public getAttemptCount(): number {
    return this.disbursement.getAttemptCount();
  }

  /**
   * Returns whether at least one execution attempt exists.
   */
  public hasAttempts(): boolean {
    return this.disbursement.hasAttempts();
  }

  /**
   * Returns whether at least one attempt succeeded.
   */
  public hasSuccessfulAttempt(): boolean {
    return this.disbursement.hasSuccessfulAttempt();
  }

  /**
   * Returns whether the latest attempt failed.
   */
  public hasFailedLatestAttempt(): boolean {
    return this.disbursement.hasFailedLatestAttempt();
  }

  /**
   * Returns whether any attempt is currently processing.
   */
  public hasProcessingAttempt(): boolean {
    return this.attempts.some((attempt) => attempt.isProcessing());
  }

  /**
   * Returns whether every attached attempt is terminal.
   */
  public areAllAttemptsTerminal(): boolean {
    return this.attempts.every((attempt) => attempt.isTerminal());
  }

  /**
   * Returns whether the latest attempt succeeded.
   */
  public isLatestAttemptSuccessful(): boolean {
    return this.getLatestAttempt()?.isSucceeded() ?? false;
  }

  /**
   * Determines whether another execution attempt can be attached.
   *
   * Attempts are only created while the parent disbursement is PROCESSING.
   *
   * Only one attempt may be processing at a time.
   *
   * Once an attempt succeeds, no additional attempt is permitted.
   */
  public canCreateAttempt(): boolean {
    return (
      this.isProcessing() &&
      !this.hasSuccessfulAttempt() &&
      !this.hasProcessingAttempt()
    );
  }

  /**
   * Adds an execution attempt to the aggregate.
   *
   * FinancialDisbursementEntity remains the owner of the child entity.
   */
  public addAttempt(attempt: FinancialDisbursementAttemptEntity): void {
    if (!this.canCreateAttempt()) {
      throw new FinancialInvariantException(
        `Financial Disbursement cannot create another attempt from status "${this.status.value}".`,
      );
    }

    this.ensureAttemptBelongsToDisbursement(attempt);
    this.ensureAttemptAmountMatches(attempt);
    this.ensureAttemptCurrencyMatches(attempt);

    this.disbursement.addAttempt(attempt);

    this.ensureAggregateConsistency();
  }

  private ensureAttemptBelongsToDisbursement(
    attempt: FinancialDisbursementAttemptEntity,
  ): void {
    if (!attempt.disbursementId.equals(this.id)) {
      throw new FinancialInvariantException(
        'Financial Disbursement Attempt does not belong to this Financial Disbursement.',
      );
    }
  }

  private ensureAttemptAmountMatches(
    attempt: FinancialDisbursementAttemptEntity,
  ): void {
    if (!attempt.amount.equals(this.amount)) {
      throw new FinancialInvariantException(
        'Financial Disbursement Attempt amount must exactly match the Financial Disbursement amount.',
      );
    }
  }

  private ensureAttemptCurrencyMatches(
    attempt: FinancialDisbursementAttemptEntity,
  ): void {
    if (!attempt.amount.currency.equals(this.currency)) {
      throw new FinancialInvariantException(
        'Financial Disbursement Attempt currency must match the Financial Disbursement currency.',
      );
    }
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isPending(): boolean {
    return this.disbursement.isPending();
  }

  public isProcessing(): boolean {
    return this.disbursement.isProcessing();
  }

  public isCompleted(): boolean {
    return this.disbursement.isCompleted();
  }

  public isFailed(): boolean {
    return this.disbursement.isFailed();
  }

  public isCancelled(): boolean {
    return this.disbursement.isCancelled();
  }

  public isTerminal(): boolean {
    return this.disbursement.isTerminal();
  }

  public isSuccessful(): boolean {
    return this.disbursement.isSuccessful();
  }

  // ===========================================================================
  // Lifecycle Permissions
  // ===========================================================================

  /**
   * Returns whether the disbursement may begin processing.
   */
  public canProcess(): boolean {
    return this.isPending();
  }

  /**
   * Returns whether another execution attempt may be created.
   */
  public canExecuteAttempt(): boolean {
    return this.canCreateAttempt();
  }

  /**
   * Returns whether the disbursement may be completed.
   *
   * Completion additionally requires a transaction reference and a successful
   * terminal attempt.
   */
  public canComplete(): boolean {
    return (
      this.isProcessing() &&
      this.hasSuccessfulAttempt() &&
      this.hasTransaction() &&
      this.areAllAttemptsTerminal()
    );
  }

  /**
   * Returns whether the disbursement may be permanently failed.
   *
   * A processing attempt must first reach a terminal state.
   */
  public canFail(): boolean {
    return !this.isTerminal() && !this.hasProcessingAttempt();
  }

  /**
   * Returns whether the disbursement may be cancelled.
   *
   * A processing attempt must first reach a terminal state.
   */
  public canCancel(): boolean {
    return !this.isTerminal() && !this.hasProcessingAttempt();
  }

  // ===========================================================================
  // Processing
  // ===========================================================================

  /**
   * Starts Financial Disbursement processing.
   *
   * Lifecycle:
   *
   * PENDING → PROCESSING
   *
   * No provider API is executed here.
   */
  public startProcessing(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    if (!this.canProcess()) {
      throw new FinancialInvariantException(
        `Financial Disbursement cannot begin processing from status "${this.status.value}".`,
      );
    }

    this.ensureValidDate(at, 'processing start');

    this.disbursement.startProcessing(at);

    this.ensureAggregateConsistency();

    this.addDomainEvent(
      new FinancialDisbursementProcessingEvent(
        this.id.value,
        this.publicId,
        this.sourceAccountPublicId,
        this.destinationType,
        this.destinationValue,
        this.amount,
        this.status,
        this.referenceType,
        this.referencePublicId,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Attempt Processing
  // ===========================================================================

  /**
   * Starts a specific execution attempt.
   *
   * No provider API is executed here.
   */
  public startAttempt(
    attemptPublicId: FinancialDisbursementAttemptPublicId,
    at: Date = new Date(),
  ): void {
    if (!this.isProcessing()) {
      throw new FinancialInvariantException(
        `Financial Disbursement Attempt cannot begin while Financial Disbursement status is "${this.status.value}".`,
      );
    }

    this.ensureValidDate(at, 'attempt start');

    const attempt = this.getAttempt(attemptPublicId);

    if (!attempt) {
      throw new FinancialInvariantException(
        `Financial Disbursement Attempt "${attemptPublicId.value}" does not belong to this Financial Disbursement.`,
      );
    }

    if (this.hasProcessingAttempt()) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot process another attempt while an existing attempt is processing.',
      );
    }

    this.ensureAttemptBelongsToDisbursement(attempt);
    this.ensureAttemptAmountMatches(attempt);
    this.ensureAttemptCurrencyMatches(attempt);

    attempt.start(at);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Provider Correlation Identifiers
  // ===========================================================================

  /**
   * Records the provider-issued OriginatorConversationID for an execution
   * attempt. The attempt must belong to this aggregate and be PROCESSING.
   */
  public setAttemptProviderOriginatorConversationId(
    attemptPublicId: FinancialDisbursementAttemptPublicId,
    value: string,
  ): void {
    const attempt =
      this.getProcessingAttemptForProviderCorrelation(attemptPublicId);

    attempt.setProviderOriginatorConversationId(value);
    this.ensureAggregateConsistency();
  }

  /**
   * Records the provider-issued ConversationID for an execution attempt.
   */
  public setAttemptProviderConversationId(
    attemptPublicId: FinancialDisbursementAttemptPublicId,
    value: string,
  ): void {
    const attempt =
      this.getProcessingAttemptForProviderCorrelation(attemptPublicId);

    attempt.setProviderConversationId(value);
    this.ensureAggregateConsistency();
  }

  /**
   * Records the provider-issued TransactionID for an execution attempt.
   *
   * This identifier may arrive in the asynchronous B2C result callback.
   */
  public setAttemptProviderTransactionId(
    attemptPublicId: FinancialDisbursementAttemptPublicId,
    value: string,
  ): void {
    const attempt =
      this.getProcessingAttemptForProviderCorrelation(attemptPublicId);

    attempt.setProviderTransactionId(value);
    this.ensureAggregateConsistency();
  }

  /**
   * Resolves an attempt eligible to receive provider correlation identifiers.
   *
   * Correlation identifiers may only be attached to an active attempt while
   * its parent disbursement is PROCESSING. This prevents late or unrelated
   * provider responses from mutating historical attempts.
   */
  private getProcessingAttemptForProviderCorrelation(
    attemptPublicId: FinancialDisbursementAttemptPublicId,
  ): FinancialDisbursementAttemptEntity {
    if (!this.isProcessing()) {
      throw new FinancialInvariantException(
        'Provider correlation identifiers may only be recorded while the Financial Disbursement is PROCESSING.',
      );
    }

    const attempt = this.getAttempt(attemptPublicId);

    if (!attempt) {
      throw new FinancialInvariantException(
        `Financial Disbursement Attempt "${attemptPublicId.value}" does not belong to this Financial Disbursement.`,
      );
    }

    if (!attempt.isProcessing()) {
      throw new FinancialInvariantException(
        `Financial Disbursement Attempt "${attempt.publicId.value}" must be PROCESSING before provider correlation identifiers can be recorded.`,
      );
    }

    this.ensureAttemptBelongsToDisbursement(attempt);
    this.ensureAttemptAmountMatches(attempt);
    this.ensureAttemptCurrencyMatches(attempt);

    return attempt;
  }

  // ===========================================================================
  // Attempt Success
  // ===========================================================================

  /**
   * Records successful completion of an execution attempt.
   *
   * The parent disbursement remains PROCESSING until complete() is invoked.
   */
  public succeedAttempt(
    attemptPublicId: FinancialDisbursementAttemptPublicId,
    at: Date = new Date(),
  ): void {
    if (!this.isProcessing()) {
      throw new FinancialInvariantException(
        `Financial Disbursement Attempt cannot succeed while Financial Disbursement status is "${this.status.value}".`,
      );
    }

    this.ensureValidDate(at, 'attempt completion');

    const attempt = this.getAttempt(attemptPublicId);

    if (!attempt) {
      throw new FinancialInvariantException(
        `Financial Disbursement Attempt "${attemptPublicId.value}" does not belong to this Financial Disbursement.`,
      );
    }

    if (!attempt.isProcessing()) {
      throw new FinancialInvariantException(
        `Financial Disbursement Attempt "${attempt.publicId.value}" must be processing before it can succeed.`,
      );
    }

    this.ensureAttemptBelongsToDisbursement(attempt);
    this.ensureAttemptAmountMatches(attempt);
    this.ensureAttemptCurrencyMatches(attempt);

    attempt.succeed(at);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Attempt Failure
  // ===========================================================================

  /**
   * Records failure of one execution attempt.
   *
   * Attempt failure does not automatically fail the parent disbursement.
   *
   * The application workflow determines whether another attempt should be
   * created or whether the parent should be permanently failed.
   */
  public failAttempt(
    attemptPublicId: FinancialDisbursementAttemptPublicId,
    failureCode?: string,
    failureMessage?: string,
    at: Date = new Date(),
  ): void {
    if (!this.isProcessing()) {
      throw new FinancialInvariantException(
        `Financial Disbursement Attempt cannot fail while Financial Disbursement status is "${this.status.value}".`,
      );
    }

    this.ensureValidDate(at, 'attempt failure');

    const attempt = this.getAttempt(attemptPublicId);

    if (!attempt) {
      throw new FinancialInvariantException(
        `Financial Disbursement Attempt "${attemptPublicId.value}" does not belong to this Financial Disbursement.`,
      );
    }

    if (!attempt.isProcessing()) {
      throw new FinancialInvariantException(
        `Financial Disbursement Attempt "${attempt.publicId.value}" must be processing before it can fail.`,
      );
    }

    this.ensureAttemptBelongsToDisbursement(attempt);
    this.ensureAttemptAmountMatches(attempt);
    this.ensureAttemptCurrencyMatches(attempt);

    attempt.fail(failureCode, failureMessage, at);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Completion
  // ===========================================================================

  /**
   * Completes the Financial Disbursement.
   *
   * Lifecycle:
   *
   * PROCESSING → COMPLETED
   *
   * Completion requires:
   *
   * - PROCESSING parent status;
   * - exactly one successful attempt;
   * - successful attempt matches the disbursement;
   * - all attempts are terminal;
   * - Financial Transaction reference exists.
   *
   * The aggregate does not create or post the Financial Transaction.
   */
  public complete(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    if (!this.canComplete()) {
      throw new FinancialInvariantException(
        `Financial Disbursement cannot be completed from status "${this.status.value}".`,
      );
    }

    this.ensureValidDate(at, 'completion');
    this.ensureCompletable();

    this.disbursement.complete(at);

    this.ensureAggregateConsistency();

    const transactionPublicId = this.transactionPublicId;

    if (!transactionPublicId) {
      throw new FinancialInvariantException(
        'Completed Financial Disbursement must have a Financial Transaction reference.',
      );
    }

    this.addDomainEvent(
      new FinancialDisbursementCompletedEvent(
        this.id.value,
        this.publicId,
        this.sourceAccountPublicId,
        this.destinationType,
        this.destinationValue,
        this.amount,
        this.status,
        transactionPublicId,
        this.referenceType,
        this.referencePublicId,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Performs all completion-specific checks before mutating the parent
   * lifecycle.
   */
  private ensureCompletable(): void {
    // ---------------------------------------------------------------------------
    // Successful Attempt
    // ---------------------------------------------------------------------------

    const successfulAttempt = this.attempts.find((attempt) =>
      attempt.isSucceeded(),
    );

    if (!successfulAttempt) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot be completed without a successful attempt.',
      );
    }

    // ---------------------------------------------------------------------------
    // Attempt Consistency
    // ---------------------------------------------------------------------------

    this.ensureAttemptBelongsToDisbursement(successfulAttempt);
    this.ensureAttemptAmountMatches(successfulAttempt);
    this.ensureAttemptCurrencyMatches(successfulAttempt);

    // ---------------------------------------------------------------------------
    // Financial Transaction
    // ---------------------------------------------------------------------------

    if (!this.hasTransaction()) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot be completed without a Financial Transaction reference.',
      );
    }

    // ---------------------------------------------------------------------------
    // Attempt Terminality
    // ---------------------------------------------------------------------------

    if (!this.areAllAttemptsTerminal()) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot be completed while a Financial Disbursement Attempt is non-terminal.',
      );
    }
  }

  // ===========================================================================
  // Failure
  // ===========================================================================

  /**
   * Permanently fails the Financial Disbursement.
   *
   * Individual attempt failures do not automatically fail the parent.
   */
  public fail(
    reason: string,
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    if (!this.canFail()) {
      if (this.hasProcessingAttempt()) {
        throw new FinancialInvariantException(
          'Financial Disbursement cannot be failed while a Financial Disbursement Attempt is processing.',
        );
      }

      throw new FinancialInvariantException(
        'A terminal Financial Disbursement cannot be failed.',
      );
    }

    this.ensureValidDate(at, 'failure');

    const normalizedReason = reason.trim();

    if (normalizedReason.length === 0) {
      throw new FinancialInvariantException(
        'Financial Disbursement failure reason is required.',
      );
    }

    this.ensureFailureAllowed();

    this.disbursement.fail(at);

    this.ensureAggregateConsistency();

    this.addDomainEvent(
      new FinancialDisbursementFailedEvent(
        this.id.value,
        this.publicId,
        this.sourceAccountPublicId,
        this.destinationType,
        this.destinationValue,
        this.amount,
        this.status,
        this.referenceType,
        this.referencePublicId,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Ensures the parent cannot be permanently failed while an execution
   * attempt is still active.
   */
  private ensureFailureAllowed(): void {
    if (this.hasProcessingAttempt()) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot be failed while a Financial Disbursement Attempt is processing.',
      );
    }

    if (!this.areAllAttemptsTerminal()) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot be failed while a Financial Disbursement Attempt is non-terminal.',
      );
    }

    if (this.hasSuccessfulAttempt()) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot be failed after a successful execution attempt exists.',
      );
    }
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Cancels the Financial Disbursement.
   *
   * Cancellation is an internal Financial-domain lifecycle transition.
   *
   * It does not claim that an external provider cancelled an already-submitted
   * request.
   */
  public cancel(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    if (!this.canCancel()) {
      if (this.hasProcessingAttempt()) {
        throw new FinancialInvariantException(
          'Financial Disbursement cannot be cancelled while a Financial Disbursement Attempt is processing.',
        );
      }

      throw new FinancialInvariantException(
        'A terminal Financial Disbursement cannot be cancelled.',
      );
    }

    this.ensureValidDate(at, 'cancellation');

    this.ensureCancellationAllowed();

    this.disbursement.cancel(at);

    this.ensureAggregateConsistency();

    this.addDomainEvent(
      new FinancialDisbursementCancelledEvent(
        this.id.value,
        this.publicId,
        this.sourceAccountPublicId,
        this.destinationType,
        this.destinationValue,
        this.amount,
        this.status,
        this.referenceType,
        this.referencePublicId,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Ensures cancellation does not occur after successful execution.
   */
  private ensureCancellationAllowed(): void {
    if (this.hasProcessingAttempt()) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot be cancelled while a Financial Disbursement Attempt is processing.',
      );
    }

    if (!this.areAllAttemptsTerminal()) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot be cancelled while a Financial Disbursement Attempt is non-terminal.',
      );
    }

    if (this.hasSuccessfulAttempt()) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot be cancelled after a successful execution attempt exists.',
      );
    }
  }

  // ===========================================================================
  // Transaction Reference
  // ===========================================================================

  /**
   * Associates the Financial Transaction produced by the disbursement
   * workflow.
   *
   * The aggregate does not create or post the transaction.
   *
   * The reference is immutable once assigned.
   *
   * Re-applying the same reference is idempotent.
   */
  public setTransactionPublicId(
    transactionPublicId: FinancialReferencePublicId,
  ): void {
    if (!this.isProcessing()) {
      throw new FinancialInvariantException(
        'A Financial Transaction reference may only be assigned to a PROCESSING Financial Disbursement.',
      );
    }

    this.disbursement.setTransactionPublicId(transactionPublicId);

    this.ensureAggregateConsistency();
  }

  /**
   * Returns whether a Financial Transaction reference exists.
   */
  public hasTransaction(): boolean {
    return this.disbursement.hasTransaction();
  }

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  public hasReference(): boolean {
    return this.disbursement.hasReference();
  }

  /**
   * Determines whether this disbursement references the supplied opaque
   * business object.
   */
  public references(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): boolean {
    return this.disbursement.references(referenceType, referencePublicId);
  }

  // ===========================================================================
  // Creation Event
  // ===========================================================================

  /**
   * Records the Financial Disbursement Created event.
   *
   * Creation itself does not implicitly emit a domain event.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.ensureAggregateConsistency();

    this.addDomainEvent(
      new FinancialDisbursementCreatedEvent(
        this.id.value,
        this.publicId,
        this.sourceAccountPublicId,
        this.destinationType,
        this.destinationValue,
        this.amount,
        this.status,
        this.referenceType,
        this.referencePublicId,
        this.requestedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates invariants spanning the complete Financial Disbursement
   * aggregate boundary.
   *
   * This method is used both during creation and rehydration.
   *
   * It intentionally validates structural and historical invariants without
   * requiring the destination to remain currently active.
   */
  private ensureAggregateConsistency(): void {
    // -------------------------------------------------------------------------
    // Root Entity
    // -------------------------------------------------------------------------

    if (!this.disbursement) {
      throw new FinancialInvariantException(
        'Financial Disbursement aggregate must contain a Financial Disbursement entity.',
      );
    }

    // -------------------------------------------------------------------------
    // Destination Snapshot
    // -------------------------------------------------------------------------

    if (
      this.destination.type.trim().length === 0 ||
      this.destination.value.trim().length === 0
    ) {
      throw new FinancialInvariantException(
        'Financial Disbursement must contain a valid destination type and value snapshot.',
      );
    }

    // -------------------------------------------------------------------------
    // Amount
    // -------------------------------------------------------------------------

    if (!this.amount.isPositive()) {
      throw new FinancialInvariantException(
        'Financial Disbursement amount must be greater than zero.',
      );
    }

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    const hasReferenceType = this.referenceType !== undefined;
    const hasReferencePublicId = this.referencePublicId !== undefined;

    if (hasReferenceType !== hasReferencePublicId) {
      throw new FinancialInvariantException(
        'Financial Disbursement reference type and public ID must be provided together.',
      );
    }

    // -------------------------------------------------------------------------
    // Attempts — Processing
    // -------------------------------------------------------------------------

    const processingAttempts = this.attempts.filter((attempt) =>
      attempt.isProcessing(),
    );

    if (processingAttempts.length > 1) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot have more than one processing attempt at the same time.',
      );
    }

    // -------------------------------------------------------------------------
    // Attempts — Successful
    // -------------------------------------------------------------------------

    const successfulAttempts = this.attempts.filter((attempt) =>
      attempt.isSucceeded(),
    );

    if (successfulAttempts.length > 1) {
      throw new FinancialInvariantException(
        'Financial Disbursement cannot contain more than one successful execution attempt.',
      );
    }

    // -------------------------------------------------------------------------
    // Attempts — Structural Consistency
    // -------------------------------------------------------------------------

    const attemptIds = new Set<string>();

    for (const attempt of this.attempts) {
      // -----------------------------------------------------------------------
      // Attempt identity uniqueness
      // -----------------------------------------------------------------------

      const attemptId = attempt.id.value;

      if (attemptIds.has(attemptId)) {
        throw new FinancialInvariantException(
          `Financial Disbursement contains duplicate execution attempt "${attemptId}".`,
        );
      }

      attemptIds.add(attemptId);

      // -----------------------------------------------------------------------
      // Ownership
      // -----------------------------------------------------------------------

      this.ensureAttemptBelongsToDisbursement(attempt);

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      this.ensureAttemptAmountMatches(attempt);

      // -----------------------------------------------------------------------
      // Currency
      // -----------------------------------------------------------------------

      this.ensureAttemptCurrencyMatches(attempt);
    }

    // -------------------------------------------------------------------------
    // Completed Disbursement
    // -------------------------------------------------------------------------

    if (this.isCompleted()) {
      if (successfulAttempts.length !== 1) {
        throw new FinancialInvariantException(
          'A completed Financial Disbursement must have exactly one successful attempt.',
        );
      }

      if (!this.hasTransaction()) {
        throw new FinancialInvariantException(
          'A completed Financial Disbursement must have a Financial Transaction reference.',
        );
      }

      if (!this.areAllAttemptsTerminal()) {
        throw new FinancialInvariantException(
          'A completed Financial Disbursement cannot contain a non-terminal execution attempt.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Failed Disbursement
    // -------------------------------------------------------------------------

    if (this.isFailed()) {
      if (this.hasSuccessfulAttempt()) {
        throw new FinancialInvariantException(
          'A failed Financial Disbursement cannot contain a successful execution attempt.',
        );
      }

      if (!this.areAllAttemptsTerminal()) {
        throw new FinancialInvariantException(
          'A failed Financial Disbursement cannot contain a non-terminal execution attempt.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Cancelled Disbursement
    // -------------------------------------------------------------------------

    if (this.isCancelled()) {
      if (this.hasSuccessfulAttempt()) {
        throw new FinancialInvariantException(
          'A cancelled Financial Disbursement cannot contain a successful execution attempt.',
        );
      }

      if (!this.areAllAttemptsTerminal()) {
        throw new FinancialInvariantException(
          'A cancelled Financial Disbursement cannot contain a non-terminal execution attempt.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Terminal Disbursement
    // -------------------------------------------------------------------------

    if (this.isTerminal() && !this.areAllAttemptsTerminal()) {
      throw new FinancialInvariantException(
        'A terminal Financial Disbursement cannot contain a non-terminal execution attempt.',
      );
    }
  }

  // ===========================================================================
  // Date Validation
  // ===========================================================================

  /**
   * Validates lifecycle timestamps before they are passed into domain state.
   */
  private ensureValidDate(at: Date, operation: string): void {
    if (Number.isNaN(at.getTime())) {
      throw new FinancialInvariantException(
        `Financial Disbursement ${operation} timestamp must be a valid date.`,
      );
    }
  }
}

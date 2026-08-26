// -----------------------------------------------------------------------------
// Financial Disbursement Entity
// -----------------------------------------------------------------------------
//
// Aggregate root for a Financial Disbursement.
//
// Aggregate ownership:
//
// FinancialDisbursementAggregate
// └── FinancialDisbursementEntity
//     └── FinancialDisbursementAttemptEntity[]
//
// A Financial Disbursement represents an instruction to move a defined amount
// of funds from an internal Financial Account to a Financial Disbursement
// Destination.
//
// The disbursement aggregate owns:
// - the disbursement instruction;
// - its lifecycle;
// - its execution-attempt history.
//
// The aggregate does NOT own:
// - the Financial Account;
// - the Financial Account balance;
// - the Financial Disbursement Destination;
// - the external payment instrument;
// - provider integrations;
// - Financial Transactions.
//
// -----------------------------------------------------------------------------
//
// Responsibilities
// -----------------------------------------------------------------------------
//
// - Maintain disbursement identity.
// - Maintain source Financial Account identities.
// - Maintain destination identity.
// - Maintain disbursement amount.
// - Maintain disbursement lifecycle.
// - Maintain originating business reference.
// - Maintain resulting Financial Transaction reference.
// - Maintain lifecycle timestamps.
// - Own Financial Disbursement Attempt entities.
// - Enforce attempt ownership.
// - Enforce attempt amount consistency.
// - Enforce one active execution attempt at a time.
// - Prevent multiple successful attempts.
// - Prevent mutation of terminal disbursements.
// - Enforce valid aggregate lifecycle transitions.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT
// -----------------------------------------------------------------------------
//
// - Execute provider APIs.
// - Communicate with external providers.
// - Select providers.
// - Perform provider routing.
// - Determine provider retry strategy.
// - Store provider credentials or secrets.
// - Modify Financial Account balances.
// - Create or post Financial Transactions.
// - Create ledger entries.
// - Persist itself.
// - Guarantee external provider settlement.
// - Own Financial Account state.
// - Own Financial Account balance state.
// - Own the external destination instrument.
//
// External provider communication belongs to the Integration/application
// boundary.
//
// Financial Transactions remain the authoritative record of financial
// movement.
//
// The application/integration workflow coordinates provider execution,
// Financial Account interaction, Financial Transaction creation, and this
// aggregate's lifecycle.
//
// -----------------------------------------------------------------------------
//
// Identity model
// -----------------------------------------------------------------------------
//
// sourceAccountId
//   -> UniqueEntityId
//   -> Internal Financial Account identity.
//
// sourceAccountPublicId
//   -> FinancialAccountPublicId
//   -> Public Financial Account identity.
//
// destinationId
//   -> UniqueEntityId
//   -> Internal Financial Disbursement Destination identity.
//
// publicId
//   -> FinancialDisbursementPublicId
//   -> Public Financial Disbursement identity.
//
// Internal identities and public identities represent different identity
// boundaries and must never be converted through casts or type assertions.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import { FinancialDisbursementPublicId } from '../value-objects/financial-disbursement-public-id.vo';

import { FinancialDisbursementStatus } from '../value-objects/financial-disbursement-status.vo';

import type { FinancialReferenceType } from '../value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../value-objects/financial-reference-public-id.vo';

import type { Money } from '../value-objects/money.vo';

import type { FinancialDisbursementAttemptEntity } from '../entities/financial-disbursement-attempt.entity';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialDisbursementProps {
  // ---------------------------------------------------------------------------
  // Source Financial Account
  // ---------------------------------------------------------------------------

  /**
   * Internal identity of the source Financial Account.
   *
   * The Financial Account aggregate remains the owner of this account.
   */
  sourceAccountId: UniqueEntityId;

  /**
   * Public identity of the source Financial Account.
   *
   * Kept separately from sourceAccountId because the two identities belong to
   * different identity boundaries.
   */
  sourceAccountPublicId: FinancialAccountPublicId;

  // ---------------------------------------------------------------------------
  // Destination
  // ---------------------------------------------------------------------------

  /**
   * Internal identity of the Financial Disbursement Destination.
   *
   * The destination is outside this aggregate's ownership.
   */
  destinationId: UniqueEntityId;

  // ---------------------------------------------------------------------------
  // Monetary Value
  // ---------------------------------------------------------------------------

  /**
   * Amount instructed for disbursement.
   *
   * Money keeps amount and currency inseparable.
   */
  amount: Money;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current Financial Disbursement lifecycle status.
   *
   * New disbursements begin in PENDING state.
   */
  status: FinancialDisbursementStatus;

  // ---------------------------------------------------------------------------
  // Execution Attempts
  // ---------------------------------------------------------------------------

  /**
   * Execution attempts owned by this aggregate.
   *
   * Each attempt represents one concrete execution attempt against a provider.
   */
  attempts: FinancialDisbursementAttemptEntity[];

  // ---------------------------------------------------------------------------
  // Business Reference
  // ---------------------------------------------------------------------------

  /**
   * Optional opaque reference to the originating business operation.
   */
  referenceType: FinancialReferenceType | undefined;

  /**
   * Public identity of the originating business operation.
   */
  referencePublicId: FinancialReferencePublicId | undefined;

  // ---------------------------------------------------------------------------
  // Financial Transaction Reference
  // ---------------------------------------------------------------------------

  /**
   * Opaque public identity of the Financial Transaction associated with the
   * disbursement workflow.
   */
  transactionPublicId: FinancialReferencePublicId | undefined;

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Time at which the disbursement was requested.
   */
  requestedAt: Date;

  /**
   * Time at which the disbursement reached COMPLETED.
   */
  completedAt: Date | undefined;

  /**
   * Time at which the disbursement reached FAILED.
   */
  failedAt: Date | undefined;

  /**
   * Time at which the disbursement reached CANCELLED.
   */
  cancelledAt: Date | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialDisbursementEntity extends Entity<
  FinancialDisbursementProps,
  FinancialDisbursementPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    props: FinancialDisbursementProps,
    id?: UniqueEntityId,
    publicId?: FinancialDisbursementPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Financial Disbursement.
   *
   * The factory validates invariants intrinsic to the disbursement itself.
   *
   * External conditions remain outside the entity, including:
   *
   * - source account existence;
   * - source account status;
   * - source account balance;
   * - destination existence;
   * - destination ownership;
   * - destination activity;
   * - disbursement policy;
   * - provider availability;
   * - provider routing;
   * - provider execution eligibility.
   */
  public static create(
    sourceAccountId: UniqueEntityId,
    sourceAccountPublicId: FinancialAccountPublicId,
    destinationId: UniqueEntityId,
    amount: Money,
    referenceType?: FinancialReferenceType,
    referencePublicId?: FinancialReferencePublicId,
  ): FinancialDisbursementEntity {
    // -------------------------------------------------------------------------
    // Amount invariant
    // -------------------------------------------------------------------------

    if (!amount.isPositive()) {
      throw new Error(
        'Financial Disbursement amount must be greater than zero',
      );
    }

    // -------------------------------------------------------------------------
    // Business reference invariant
    // -------------------------------------------------------------------------

    const hasReferenceType = referenceType !== undefined;
    const hasReferencePublicId = referencePublicId !== undefined;

    if (hasReferenceType !== hasReferencePublicId) {
      throw new Error(
        'Financial Disbursement reference type and public ID must be provided together',
      );
    }

    // -------------------------------------------------------------------------
    // Timestamp
    // -------------------------------------------------------------------------

    const now = new Date();

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return new FinancialDisbursementEntity(
      {
        // Source Account
        sourceAccountId,
        sourceAccountPublicId,

        // Destination
        destinationId,

        // Monetary Value
        amount,

        // Lifecycle
        status: FinancialDisbursementStatus.pending(),

        // Attempts
        attempts: [],

        // Business Reference
        referenceType: referenceType ?? undefined,
        referencePublicId: referencePublicId ?? undefined,

        // Financial Transaction
        transactionPublicId: undefined,

        // Lifecycle Timestamps
        requestedAt: now,
        completedAt: undefined,
        failedAt: undefined,
        cancelledAt: undefined,

        // Audit
        createdAt: now,
        updatedAt: now,
      },

      new UniqueEntityId(),

      new FinancialDisbursementPublicId(),
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Disbursement.
   */
  public override get publicId(): FinancialDisbursementPublicId {
    return super.publicId;
  }

  /**
   * Internal identity of the source Financial Account.
   */
  public get sourceAccountId(): UniqueEntityId {
    return this.props.sourceAccountId;
  }

  /**
   * Public identity of the source Financial Account.
   */
  public get sourceAccountPublicId(): FinancialAccountPublicId {
    return this.props.sourceAccountPublicId;
  }

  /**
   * Internal identity of the Financial Disbursement Destination.
   */
  public get destinationId(): UniqueEntityId {
    return this.props.destinationId;
  }

  // ---------------------------------------------------------------------------
  // Monetary Value
  // ---------------------------------------------------------------------------

  /**
   * Returns the amount instructed for disbursement.
   */
  public get amount(): Money {
    return this.props.amount;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Returns the current disbursement lifecycle status.
   */
  public get status(): FinancialDisbursementStatus {
    return this.props.status;
  }

  // ---------------------------------------------------------------------------
  // Attempts
  // ---------------------------------------------------------------------------

  /**
   * Returns the aggregate's execution attempts as a read-only collection.
   *
   * The collection itself must only be mutated through aggregate behavior.
   */
  public get attempts(): readonly FinancialDisbursementAttemptEntity[] {
    return this.props.attempts;
  }

  // ---------------------------------------------------------------------------
  // Business Reference
  // ---------------------------------------------------------------------------

  public get referenceType(): FinancialReferenceType | undefined {
    return this.props.referenceType;
  }

  public get referencePublicId(): FinancialReferencePublicId | undefined {
    return this.props.referencePublicId;
  }

  // ---------------------------------------------------------------------------
  // Financial Transaction Reference
  // ---------------------------------------------------------------------------

  public get transactionPublicId(): FinancialReferencePublicId | undefined {
    return this.props.transactionPublicId;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  public get requestedAt(): Date {
    return this.props.requestedAt;
  }

  public get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  public get failedAt(): Date | undefined {
    return this.props.failedAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt;
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ===========================================================================
  // Attempt Management
  // ===========================================================================

  /**
   * Adds a new execution attempt to the aggregate.
   *
   * Aggregate invariants:
   *
   * - The disbursement must not be terminal.
   * - The attempt must belong to this disbursement.
   * - The attempt must be PENDING.
   * - The attempt amount must exactly equal the disbursement amount.
   * - The attempt must not already be attached.
   * - No other attempt may currently be PROCESSING.
   * - A successful attempt must not already exist.
   *
   * Provider selection and retry policy remain outside this aggregate.
   */
  public addAttempt(attempt: FinancialDisbursementAttemptEntity): void {
    // -------------------------------------------------------------------------
    // Terminal invariant
    // -------------------------------------------------------------------------

    this.ensureMutable();

    // -------------------------------------------------------------------------
    // Ownership invariant
    // -------------------------------------------------------------------------

    if (!attempt.disbursementId.equals(this.id)) {
      throw new Error(
        'Financial Disbursement Attempt does not belong to this Financial Disbursement',
      );
    }

    // -------------------------------------------------------------------------
    // Attempt lifecycle invariant
    // -------------------------------------------------------------------------

    if (!attempt.isPending()) {
      throw new Error(
        'Only a PENDING Financial Disbursement Attempt may be attached',
      );
    }

    // -------------------------------------------------------------------------
    // Amount invariant
    // -------------------------------------------------------------------------

    if (!attempt.amount.equals(this.props.amount)) {
      throw new Error(
        'Financial Disbursement Attempt amount must exactly match the Financial Disbursement amount',
      );
    }

    // -------------------------------------------------------------------------
    // Successful attempt invariant
    // -------------------------------------------------------------------------

    if (this.hasSuccessfulAttempt()) {
      throw new Error(
        'Cannot add an attempt after a successful Financial Disbursement Attempt exists',
      );
    }

    // -------------------------------------------------------------------------
    // Concurrent execution invariant
    // -------------------------------------------------------------------------

    if (this.hasProcessingAttempt()) {
      throw new Error(
        'Cannot add a Financial Disbursement Attempt while another attempt is processing',
      );
    }

    // -------------------------------------------------------------------------
    // Duplicate invariant
    // -------------------------------------------------------------------------

    const duplicate = this.props.attempts.some((existingAttempt) =>
      existingAttempt.id.equals(attempt.id),
    );

    if (duplicate) {
      throw new Error(
        'Financial Disbursement Attempt is already attached to this Financial Disbursement',
      );
    }

    // -------------------------------------------------------------------------
    // Attach
    // -------------------------------------------------------------------------

    this.props.attempts.push(attempt);

    this.touch();
  }

  /**
   * Returns the most recently attached execution attempt.
   */
  public getLatestAttempt(): FinancialDisbursementAttemptEntity | undefined {
    return this.props.attempts.length > 0
      ? this.props.attempts[this.props.attempts.length - 1]
      : undefined;
  }

  /**
   * Returns the number of execution attempts.
   */
  public getAttemptCount(): number {
    return this.props.attempts.length;
  }

  /**
   * Returns whether this disbursement has any execution attempts.
   */
  public hasAttempts(): boolean {
    return this.props.attempts.length > 0;
  }

  /**
   * Returns whether any attempt has successfully completed.
   */
  public hasSuccessfulAttempt(): boolean {
    return this.props.attempts.some((attempt) => attempt.isSucceeded());
  }

  /**
   * Returns whether any attempt is currently processing.
   */
  public hasProcessingAttempt(): boolean {
    return this.props.attempts.some((attempt) => attempt.isProcessing());
  }

  /**
   * Returns whether the latest attempt failed.
   */
  public hasFailedLatestAttempt(): boolean {
    return this.getLatestAttempt()?.isFailed() ?? false;
  }

  /**
   * Returns whether the latest attempt is processing.
   */
  public hasProcessingLatestAttempt(): boolean {
    return this.getLatestAttempt()?.isProcessing() ?? false;
  }

  /**
   * Returns whether the latest attempt succeeded.
   */
  public hasSucceededLatestAttempt(): boolean {
    return this.getLatestAttempt()?.isSucceeded() ?? false;
  }

  /**
   * Returns whether another attempt may be attached.
   *
   * The aggregate permits multiple attempts as execution history, but never
   * permits concurrent active attempts or an attempt after successful
   * execution.
   *
   * Whether another attempt SHOULD be created is an application/integration
   * retry-policy decision.
   */
  public canCreateAttempt(): boolean {
    return (
      !this.isTerminal() &&
      !this.hasSuccessfulAttempt() &&
      !this.hasProcessingAttempt()
    );
  }

  // ===========================================================================
  // Lifecycle Commands
  // ===========================================================================

  /**
   * Moves the disbursement from PENDING into PROCESSING.
   *
   * This represents the beginning of the aggregate execution workflow.
   *
   * It does not execute a provider operation.
   */
  public startProcessing(processingAt: Date = new Date()): void {
    if (!this.isPending()) {
      throw new Error(
        `Financial Disbursement cannot begin processing from status: ${this.props.status.value}`,
      );
    }

    this.transitionTo(FinancialDisbursementStatus.processing());

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(processingAt);
  }

  /**
   * Completes the disbursement.
   *
   * Completion requires:
   *
   * - a successful execution attempt;
   * - no active processing attempt.
   *
   * The Financial Transaction is not created here.
   */
  public complete(completedAt: Date = new Date()): void {
    // -------------------------------------------------------------------------
    // Successful execution invariant
    // -------------------------------------------------------------------------

    if (!this.hasSuccessfulAttempt()) {
      throw new Error(
        'Financial Disbursement cannot be completed without a successful attempt',
      );
    }

    // -------------------------------------------------------------------------
    // Concurrent execution invariant
    // -------------------------------------------------------------------------

    if (this.hasProcessingAttempt()) {
      throw new Error(
        'Financial Disbursement cannot be completed while an attempt is processing',
      );
    }

    // -------------------------------------------------------------------------
    // Lifecycle transition
    // -------------------------------------------------------------------------

    this.transitionTo(FinancialDisbursementStatus.completed());

    this.props.completedAt = completedAt;

    this.props.failedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(completedAt);
  }

  /**
   * Marks the disbursement as failed.
   *
   * Failure is terminal.
   *
   * The application workflow must only call this after the relevant execution
   * attempt has reached a terminal state and no successful attempt exists.
   *
   * Retry policy itself does not belong here.
   */
  public fail(failedAt: Date = new Date()): void {
    // -------------------------------------------------------------------------
    // Successful execution invariant
    // -------------------------------------------------------------------------

    if (this.hasSuccessfulAttempt()) {
      throw new Error(
        'Financial Disbursement cannot fail after a successful attempt',
      );
    }

    // -------------------------------------------------------------------------
    // Active execution invariant
    // -------------------------------------------------------------------------

    if (this.hasProcessingAttempt()) {
      throw new Error(
        'Financial Disbursement cannot fail while an attempt is processing',
      );
    }

    // -------------------------------------------------------------------------
    // Lifecycle transition
    // -------------------------------------------------------------------------

    this.transitionTo(FinancialDisbursementStatus.failed());

    this.props.failedAt = failedAt;

    this.props.completedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(failedAt);
  }

  /**
   * Cancels the disbursement.
   *
   * Cancellation is an internal Financial Disbursement lifecycle state.
   *
   * It does not claim that an external provider-side operation was cancelled.
   */
  public cancel(cancelledAt: Date = new Date()): void {
    // -------------------------------------------------------------------------
    // Active execution invariant
    // -------------------------------------------------------------------------

    if (this.hasProcessingAttempt()) {
      throw new Error(
        'Financial Disbursement cannot be cancelled while an attempt is processing',
      );
    }

    // -------------------------------------------------------------------------
    // Lifecycle transition
    // -------------------------------------------------------------------------

    this.transitionTo(FinancialDisbursementStatus.cancelled());

    this.props.cancelledAt = cancelledAt;

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;

    this.touch(cancelledAt);
  }

  // ===========================================================================
  // Financial Transaction Reference
  // ===========================================================================

  /**
   * Associates the Financial Transaction produced by the disbursement
   * workflow.
   *
   * The transaction is represented only by an opaque public identity.
   *
   * The reference:
   *
   * - may only be assigned after successful execution;
   * - may only be assigned once;
   * - is idempotent when the same reference is supplied.
   *
   * This entity does not create or post the transaction.
   */
  public setTransactionPublicId(
    transactionPublicId: FinancialReferencePublicId,
  ): void {
    // -------------------------------------------------------------------------
    // Successful execution invariant
    // -------------------------------------------------------------------------

    if (!this.hasSuccessfulAttempt()) {
      throw new Error(
        'Financial Transaction reference cannot be assigned before a successful Financial Disbursement Attempt exists',
      );
    }

    // -------------------------------------------------------------------------
    // Existing reference invariant
    // -------------------------------------------------------------------------

    if (this.props.transactionPublicId !== undefined) {
      if (this.props.transactionPublicId.equals(transactionPublicId)) {
        return;
      }

      throw new Error(
        'Financial Disbursement already has a Financial Transaction reference',
      );
    }

    // -------------------------------------------------------------------------
    // Associate
    // -------------------------------------------------------------------------

    this.props.transactionPublicId = transactionPublicId;

    this.touch();
  }

  /**
   * Returns whether a Financial Transaction reference has been associated.
   */
  public hasTransaction(): boolean {
    return this.props.transactionPublicId !== undefined;
  }

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  /**
   * Returns whether the disbursement has an originating business reference.
   */
  public hasReference(): boolean {
    return (
      this.props.referenceType !== undefined &&
      this.props.referencePublicId !== undefined
    );
  }

  /**
   * Determines whether this disbursement references the supplied external
   * business object.
   *
   * Financial treats the reference as opaque.
   */
  public references(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): boolean {
    return (
      this.props.referenceType?.equals(referenceType) === true &&
      this.props.referencePublicId?.equals(referencePublicId) === true
    );
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isPending(): boolean {
    return this.props.status.isPending();
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

  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  /**
   * Returns whether the disbursement has reached a terminal state.
   */
  public isTerminal(): boolean {
    return this.props.status.isTerminal();
  }

  /**
   * Returns whether the disbursement completed successfully.
   */
  public isSuccessful(): boolean {
    return this.isCompleted();
  }

  /**
   * Returns whether the disbursement may begin execution.
   *
   * Execution may only begin while PENDING.
   */
  public isExecutable(): boolean {
    return this.isPending() && this.canCreateAttempt();
  }

  /**
   * Returns whether the aggregate currently has an active execution.
   */
  public isExecutionInProgress(): boolean {
    return this.isProcessing() || this.hasProcessingAttempt();
  }

  /**
   * Returns whether the disbursement has finished its execution workflow.
   */
  public hasFinished(): boolean {
    return this.isTerminal();
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Performs the aggregate lifecycle transition.
   *
   * FinancialDisbursementStatus remains authoritative for permitted
   * lifecycle transitions.
   */
  private transitionTo(nextStatus: FinancialDisbursementStatus): void {
    if (!this.props.status.canTransitionTo(nextStatus)) {
      throw new Error(
        `Invalid Financial Disbursement status transition: ` +
          `${this.props.status.value} -> ${nextStatus.value}`,
      );
    }

    this.props.status = nextStatus;
  }

  // ===========================================================================
  // Aggregate Mutation Guard
  // ===========================================================================

  /**
   * Ensures the aggregate is still mutable.
   *
   * Once a disbursement reaches COMPLETED, FAILED, or CANCELLED, its business
   * state must not be reopened or altered through normal domain behavior.
   */
  private ensureMutable(): void {
    if (this.isTerminal()) {
      throw new Error('Cannot mutate a terminal Financial Disbursement');
    }
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Updates the audit timestamp.
   *
   * Primarily intended for persistence reconstitution/mapping.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }
}

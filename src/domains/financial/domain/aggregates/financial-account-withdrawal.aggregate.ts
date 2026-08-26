// -----------------------------------------------------------------------------
// Financial Account Withdrawal Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate root for a Financial Account Withdrawal.
//
// Responsibilities:
//
// - Own the Financial Account Withdrawal entity.
// - Enforce Financial Account Withdrawal aggregate invariants.
// - Coordinate withdrawal lifecycle transitions.
// - Emit Financial Account Withdrawal domain events.
//
// This aggregate does NOT:
//
// - Modify Financial Account balances.
// - Create or execute Financial Transactions.
// - Create or execute Financial Disbursements.
// - Communicate with payment/disbursement providers.
// - Coordinate Financial Account state.
// - Coordinate Financial Disbursement state.
// - Move money.
// - Persist itself.
//
// Financial Account balance mutations, Financial Transaction creation and
// Financial Disbursement execution are coordinated by the appropriate
// application/domain workflows.
//
// -----------------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------------
//
//     PENDING
//        │
//        ├── PROCESSING
//        │      ├── COMPLETED
//        │      ├── FAILED
//        │      └── CANCELLED
//        │
//        └── CANCELLED
//
// COMPLETED, FAILED and CANCELLED are terminal states.
//
// -----------------------------------------------------------------------------
// Destination
// -----------------------------------------------------------------------------
//
// The withdrawal owns an immutable snapshot of the selected external
// withdrawal destination.
//
// The destination is:
//
//     FinancialAccountWithdrawalDestination
//
// and contains:
//
//     - type
//     - value
//
// The destination is NOT:
//
// - another aggregate;
// - a repository reference;
// - a FinancialDisbursementDestination aggregate;
// - a FinancialDisbursementDestinationPublicId;
// - a live/mutable external destination reference.
//
// The application layer may select the destination from:
//
// - an explicitly selected destination; or
// - a configured/default payout destination.
//
// Once the withdrawal is created, the selected destination snapshot belongs
// to the withdrawal and remains part of the withdrawal request.
//
// The later Financial Disbursement workflow consumes this snapshot when
// creating and executing the external payout.
//
// Conceptual relationship:
//
//     FinancialAccount
//            │
//            │ creates withdrawal request
//            ▼
//     FinancialAccountWithdrawal
//            │
//            │ owns destination snapshot
//            ▼
//     FinancialDisbursement
//            │
//            ▼
//     External Provider
//
// -----------------------------------------------------------------------------
// Important
// -----------------------------------------------------------------------------
//
// - The entity owns lifecycle state mutation and lifecycle invariants.
// - The aggregate coordinates operations and emits domain events.
// - Financial Disbursement is a separate aggregate.
// - Financial Account balance mutation occurs outside this aggregate.
// - Domain event publication occurs outside this aggregate.
// - The destination snapshot is part of the withdrawal request.
// - The destination is not resolved through another aggregate during
//   withdrawal lifecycle processing.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalEntity } from '../entities/financial-account-withdrawal.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalRequestedEvent } from '../events/financial-account-withdrawal-requested.event';

import { FinancialAccountWithdrawalProcessingEvent } from '../events/financial-account-withdrawal-processing.event';

import { FinancialAccountWithdrawalCompletedEvent } from '../events/financial-account-withdrawal-completed.event';

import { FinancialAccountWithdrawalFailedEvent } from '../events/financial-account-withdrawal-failed.event';

import { FinancialAccountWithdrawalCancelledEvent } from '../events/financial-account-withdrawal-cancelled.event';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalException } from '../exceptions';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalPublicId } from '../value-objects/financial-account-withdrawal-public-id.vo';

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialAccountWithdrawalDestination } from '../value-objects/financial-account-withdrawal-destination.vo';

import type { FinancialAccountWithdrawalStatus } from '../value-objects/financial-account-withdrawal-status.vo';

import type { FinancialReferenceType } from '../value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../value-objects/financial-reference-public-id.vo';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountWithdrawalAggregateProps {
  withdrawal: FinancialAccountWithdrawalEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

export class FinancialAccountWithdrawalAggregate extends AggregateRoot<FinancialAccountWithdrawalAggregateProps> {
  // ===========================================================================
  // Private State
  // ===========================================================================

  /**
   * Withdrawal entity owned by this aggregate.
   *
   * Consumers should interact with the aggregate through its state accessors
   * and behavior methods.
   */
  private readonly withdrawalEntity: FinancialAccountWithdrawalEntity;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: FinancialAccountWithdrawalAggregateProps) {
    super(props);

    this.withdrawalEntity = props.withdrawal;
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Financial Account Withdrawal aggregate.
   *
   * Creation itself does not emit a domain event.
   *
   * The application workflow explicitly calls recordRequested() after the
   * withdrawal request has been accepted.
   */
  public static create(
    withdrawal: FinancialAccountWithdrawalEntity,
  ): FinancialAccountWithdrawalAggregate {
    return new FinancialAccountWithdrawalAggregate({
      withdrawal,
    });
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Financial Account Withdrawal aggregate.
   *
   * Historical domain events are not emitted during rehydration.
   */
  public static rehydrate(
    withdrawal: FinancialAccountWithdrawalEntity,
  ): FinancialAccountWithdrawalAggregate {
    return new FinancialAccountWithdrawalAggregate({
      withdrawal,
    });
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the withdrawal entity owned by this aggregate.
   *
   * Primarily intended for persistence and mapping infrastructure.
   *
   * Domain consumers should prefer aggregate behavior methods.
   */
  public get withdrawal(): FinancialAccountWithdrawalEntity {
    return this.withdrawalEntity;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal aggregate identity.
   */
  public override get id(): UniqueEntityId {
    return this.withdrawalEntity.id;
  }

  /**
   * Public identity of the Financial Account Withdrawal.
   */
  public override get publicId(): FinancialAccountWithdrawalPublicId {
    return this.withdrawalEntity.publicId;
  }

  // ===========================================================================
  // Account Reference
  // ===========================================================================

  /**
   * Internal identity of the owning Financial Account.
   *
   * The Financial Account aggregate is never embedded inside this aggregate.
   */
  public get accountId(): UniqueEntityId {
    return this.withdrawalEntity.accountId;
  }

  /**
   * Public identity of the owning Financial Account.
   *
   * This is an opaque cross-aggregate reference.
   */
  public get accountPublicId(): FinancialAccountPublicId {
    return this.withdrawalEntity.accountPublicId;
  }

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Requested withdrawal amount.
   */
  public get amount() {
    return this.withdrawalEntity.amount;
  }

  /**
   * Numeric withdrawal amount.
   */
  public get amountValue(): number {
    return this.withdrawalEntity.amountValue;
  }

  /**
   * Withdrawal currency.
   */
  public get currency(): string {
    return this.withdrawalEntity.currency;
  }

  // ===========================================================================
  // Destination
  // ===========================================================================

  /**
   * Immutable snapshot of the selected external withdrawal destination.
   *
   * The destination is owned by the withdrawal and is not an aggregate
   * reference.
   */
  public get destination(): FinancialAccountWithdrawalDestination {
    return this.withdrawalEntity.destination;
  }

  /**
   * Destination type.
   *
   * Examples:
   *
   * - MOBILE_MONEY
   * - BANK_ACCOUNT
   * - OTHER
   */
  public get destinationType(): string {
    return this.withdrawalEntity.destinationType;
  }

  /**
   * Destination value.
   *
   * Examples may include:
   *
   * - mobile-money number;
   * - bank-account identifier;
   * - external payout identifier.
   *
   * The value belongs to the withdrawal destination snapshot and must not be
   * interpreted as a FinancialDisbursementDestinationPublicId.
   */
  public get destinationValue(): string {
    return this.withdrawalEntity.destinationValue;
  }

  /**
   * Determines whether this withdrawal targets the supplied destination
   * value.
   *
   * Comparison is performed against the destination snapshot owned by the
   * withdrawal.
   */
  public isForDestination(destinationValue: string): boolean {
    return this.withdrawalEntity.isForDestination(destinationValue);
  }

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  /**
   * Optional originating business reference type.
   */
  public get referenceType(): FinancialReferenceType | undefined {
    return this.withdrawalEntity.referenceType;
  }

  /**
   * Optional originating business reference public ID.
   */
  public get referencePublicId(): FinancialReferencePublicId | undefined {
    return this.withdrawalEntity.referencePublicId;
  }

  /**
   * Whether the withdrawal has a complete business reference.
   */
  public get hasReference(): boolean {
    return (
      this.referenceType !== undefined && this.referencePublicId !== undefined
    );
  }

  // ===========================================================================
  // Disbursement Reference
  // ===========================================================================

  /**
   * Public identity of the Financial Disbursement associated with this
   * withdrawal.
   *
   * This is an opaque cross-aggregate reference.
   */
  public get disbursementPublicId(): string | undefined {
    return this.withdrawalEntity.disbursementPublicId;
  }

  /**
   * Whether a Financial Disbursement has been associated with this withdrawal.
   */
  public get hasDisbursement(): boolean {
    return this.withdrawalEntity.hasDisbursement();
  }

  /**
   * Associates the Financial Disbursement responsible for executing this
   * withdrawal.
   *
   * This method does not create or execute the Financial Disbursement.
   */
  public setDisbursementPublicId(disbursementPublicId: string): void {
    this.withdrawalEntity.setDisbursementPublicId(disbursementPublicId);
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  /**
   * Current withdrawal lifecycle status.
   */
  public get status(): FinancialAccountWithdrawalStatus {
    return this.withdrawalEntity.status;
  }

  /**
   * Whether the withdrawal is PENDING.
   */
  public get isPending(): boolean {
    return this.withdrawalEntity.isPending();
  }

  /**
   * Whether the withdrawal is PROCESSING.
   */
  public get isProcessing(): boolean {
    return this.withdrawalEntity.isProcessing();
  }

  /**
   * Whether the withdrawal is COMPLETED.
   */
  public get isCompleted(): boolean {
    return this.withdrawalEntity.isCompleted();
  }

  /**
   * Whether the withdrawal is FAILED.
   */
  public get isFailed(): boolean {
    return this.withdrawalEntity.isFailed();
  }

  /**
   * Whether the withdrawal is CANCELLED.
   */
  public get isCancelled(): boolean {
    return this.withdrawalEntity.isCancelled();
  }

  /**
   * Whether the withdrawal is in a terminal state.
   */
  public get isTerminal(): boolean {
    return this.withdrawalEntity.isTerminal();
  }

  // ===========================================================================
  // Lifecycle Eligibility
  // ===========================================================================

  /**
   * Determines whether the withdrawal can move to PROCESSING.
   */
  public canProcess(): boolean {
    return this.withdrawalEntity.canProcess();
  }

  /**
   * Determines whether the withdrawal can be completed.
   */
  public canComplete(): boolean {
    return this.withdrawalEntity.canComplete();
  }

  /**
   * Determines whether the withdrawal can fail.
   */
  public canFail(): boolean {
    return this.withdrawalEntity.canFail();
  }

  /**
   * Determines whether the withdrawal can be cancelled.
   */
  public canCancel(): boolean {
    return this.withdrawalEntity.canCancel();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the withdrawal was requested.
   */
  public get requestedAt(): Date {
    return this.withdrawalEntity.requestedAt;
  }

  /**
   * Timestamp at which the withdrawal completed.
   */
  public get completedAt(): Date | undefined {
    return this.withdrawalEntity.completedAt;
  }

  /**
   * Timestamp at which the withdrawal failed.
   */
  public get failedAt(): Date | undefined {
    return this.withdrawalEntity.failedAt;
  }

  /**
   * Timestamp at which the withdrawal was cancelled.
   */
  public get cancelledAt(): Date | undefined {
    return this.withdrawalEntity.cancelledAt;
  }

  /**
   * Entity creation timestamp.
   */
  public get createdAt(): Date {
    return this.withdrawalEntity.createdAt;
  }

  /**
   * Entity last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.withdrawalEntity.updatedAt;
  }

  // ===========================================================================
  // Requested
  // ===========================================================================

  /**
   * Records the Financial Account Withdrawal Requested domain event.
   *
   * The withdrawal must be PENDING.
   *
   * The complete destination snapshot is included in the event.
   *
   * This operation does not change the lifecycle state.
   */
  public recordRequested(correlationId: string, causationId?: string): void {
    this.ensurePending();

    this.addDomainEvent(
      new FinancialAccountWithdrawalRequestedEvent(
        this.id.value,
        this.publicId,
        this.accountPublicId,
        this.amount,
        this.destination,
        this.referenceType,
        this.referencePublicId,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Processing
  // ===========================================================================

  /**
   * Moves the withdrawal:
   *
   *     PENDING -> PROCESSING
   *
   * The entity owns lifecycle transition validation and mutation.
   */
  public process(correlationId: string, causationId?: string): void {
    this.withdrawalEntity.process();

    this.addDomainEvent(
      new FinancialAccountWithdrawalProcessingEvent(
        this.id.value,
        this.publicId,
        this.accountPublicId,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Completion
  // ===========================================================================

  /**
   * Completes the withdrawal:
   *
   *     PROCESSING -> COMPLETED
   */
  public complete(
    completedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    this.withdrawalEntity.complete(completedAt);

    this.addDomainEvent(
      new FinancialAccountWithdrawalCompletedEvent(
        this.id.value,
        this.publicId,
        this.accountPublicId,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Failure
  // ===========================================================================

  /**
   * Fails the withdrawal:
   *
   *     PROCESSING -> FAILED
   *
   * The failure reason belongs to the failure event/workflow context and is
   * not part of the withdrawal lifecycle state.
   */
  public fail(
    reason: string,
    failedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    this.withdrawalEntity.fail(failedAt);

    this.addDomainEvent(
      new FinancialAccountWithdrawalFailedEvent(
        this.id.value,
        this.publicId,
        this.accountPublicId,
        reason,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  /**
   * Cancels the withdrawal.
   *
   * Valid transitions:
   *
   *     PENDING    -> CANCELLED
   *     PROCESSING -> CANCELLED
   */
  public cancel(
    reason: string,
    cancelledAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    this.withdrawalEntity.cancel(cancelledAt);

    this.addDomainEvent(
      new FinancialAccountWithdrawalCancelledEvent(
        this.id.value,
        this.publicId,
        this.accountPublicId,
        reason,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Persistence / Rehydration
  // ===========================================================================

  /**
   * Updates the persistence timestamp without producing a domain event.
   *
   * Intended for mapper/repository workflows.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.withdrawalEntity.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Internal Invariant Guards
  // ===========================================================================

  /**
   * Ensures the withdrawal is PENDING.
   */
  private ensurePending(): void {
    if (!this.withdrawalEntity.isPending()) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal "${this.publicId.value}" is not in PENDING state`,
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountWithdrawalAggregate;

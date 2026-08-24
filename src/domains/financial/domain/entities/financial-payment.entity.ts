// -----------------------------------------------------------------------------
// Financial Payment Entity
// -----------------------------------------------------------------------------
//
// Entity owned by:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Responsibilities:
// - Maintain payment identity.
// - Maintain target Financial Account reference.
// - Maintain payment amount.
// - Maintain payment lifecycle.
// - Maintain selected payment method reference.
// - Own payment attempts.
// - Maintain originating business reference.
// - Maintain resulting Financial Transaction reference.
// - Enforce payment and attempt invariants.
// - Enforce valid payment lifecycle transitions.
//
// This entity does NOT:
// - Execute provider APIs.
// - Communicate with payment providers.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Create ledger entries.
// - Emit domain events.
// - Persist itself.
//
// Domain-event emission and aggregate-level orchestration belong to
// FinancialPaymentAggregate.
//
// Cross-aggregate references are represented by opaque public identities.
// The child FinancialPaymentAttemptEntity uses the parent's internal
// UniqueEntityId because it is structurally owned by this aggregate.
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

import { FinancialPaymentPublicId } from '../value-objects/financial-payment-public-id.vo';

import { FinancialPaymentStatus } from '../value-objects/financial-payment-status.vo';

import type { Money } from '../value-objects/money.vo';

import type { FinancialPaymentMethodPublicId } from '../value-objects/financial-payment-method-public-id.vo';

import type { FinancialReferenceType } from '../value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../value-objects/financial-reference-public-id.vo';

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Child Entity
// -----------------------------------------------------------------------------

import type { FinancialPaymentAttemptEntity } from './financial-payment-attempt.entity';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialPaymentProps {
  /**
   * Financial Account receiving the external funds.
   *
   * This is a cross-aggregate identity reference.
   *
   * The Financial Account aggregate is intentionally not embedded inside the
   * Financial Payment aggregate.
   */
  accountId: PublicEntityId;

  /**
   * Monetary amount of the payment.
   *
   * Money keeps amount and currency inseparable.
   */
  amount: Money;

  /**
   * Payment lifecycle.
   */
  status: FinancialPaymentStatus;

  /**
   * Selected Financial Payment Method.
   *
   * Only the payment method's public identity is retained.
   */
  methodId: FinancialPaymentMethodPublicId | undefined;

  /**
   * Provider execution attempts owned by this aggregate.
   */
  attempts: FinancialPaymentAttemptEntity[];

  /**
   * Financial Transaction resulting from successful payment execution.
   *
   * This is an opaque reference to another aggregate.
   */
  transactionPublicId: string | undefined;

  /**
   * Originating business reference.
   *
   * Both values must either be present or absent.
   */
  referenceType: FinancialReferenceType | undefined;

  referencePublicId: FinancialReferencePublicId | undefined;

  /**
   * Payment lifecycle timestamps.
   */
  initiatedAt: Date;

  completedAt: Date | undefined;

  failedAt: Date | undefined;

  cancelledAt: Date | undefined;

  /**
   * Audit timestamps.
   */
  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialPaymentEntity extends Entity<
  FinancialPaymentProps,
  FinancialPaymentPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    props: FinancialPaymentProps,
    id?: UniqueEntityId,
    publicId?: FinancialPaymentPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Financial Payment entity.
   *
   * New payments always begin in PENDING state.
   *
   * The aggregate is responsible for recording the corresponding creation
   * domain event.
   */
  public static create(
    accountId: PublicEntityId,
    amount: Money,
    methodId?: FinancialPaymentMethodPublicId,
    referenceType?: FinancialReferenceType,
    referencePublicId?: FinancialReferencePublicId,
  ): FinancialPaymentEntity {
    // -------------------------------------------------------------------------
    // Amount invariant
    // -------------------------------------------------------------------------

    if (!amount.isPositive()) {
      throw new Error('Financial Payment amount must be greater than zero');
    }

    // -------------------------------------------------------------------------
    // Reference invariant
    // -------------------------------------------------------------------------

    const hasReferenceType = referenceType !== undefined;

    const hasReferencePublicId = referencePublicId !== undefined;

    if (hasReferenceType !== hasReferencePublicId) {
      throw new Error(
        'Financial Payment reference type and public ID must be provided together',
      );
    }

    // -------------------------------------------------------------------------
    // Initial state
    // -------------------------------------------------------------------------

    const now = new Date();

    return new FinancialPaymentEntity(
      {
        accountId,

        amount,

        status: FinancialPaymentStatus.create('PENDING'),

        methodId: methodId ?? undefined,

        attempts: [],

        transactionPublicId: undefined,

        referenceType: referenceType ?? undefined,

        referencePublicId: referencePublicId ?? undefined,

        initiatedAt: now,

        completedAt: undefined,

        failedAt: undefined,

        cancelledAt: undefined,

        createdAt: now,

        updatedAt: now,
      },

      new UniqueEntityId(),

      new FinancialPaymentPublicId(),
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): FinancialPaymentPublicId {
    return super.publicId;
  }

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Account receiving the payment.
   *
   * This is an opaque cross-aggregate reference.
   */
  public get accountId(): PublicEntityId {
    return this.props.accountId;
  }

  /**
   * Payment amount and currency.
   */
  public get amount(): Money {
    return this.props.amount;
  }

  /**
   * Current payment lifecycle status.
   */
  public get status(): FinancialPaymentStatus {
    return this.props.status;
  }

  /**
   * Selected payment method public identity.
   */
  public get methodId(): FinancialPaymentMethodPublicId | undefined {
    return this.props.methodId;
  }

  /**
   * Read-only view of the payment attempts.
   *
   * Callers cannot directly push, remove, or replace attempts.
   */
  public get attempts(): readonly FinancialPaymentAttemptEntity[] {
    return this.props.attempts;
  }

  /**
   * Public identity of the resulting Financial Transaction.
   */
  public get transactionPublicId(): string | undefined {
    return this.props.transactionPublicId;
  }

  /**
   * Originating business reference type.
   */
  public get referenceType(): FinancialReferenceType | undefined {
    return this.props.referenceType;
  }

  /**
   * Originating business reference public identity.
   */
  public get referencePublicId(): FinancialReferencePublicId | undefined {
    return this.props.referencePublicId;
  }

  /**
   * Payment initiation timestamp.
   */
  public get initiatedAt(): Date {
    return this.props.initiatedAt;
  }

  /**
   * Payment completion timestamp.
   */
  public get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  /**
   * Payment failure timestamp.
   */
  public get failedAt(): Date | undefined {
    return this.props.failedAt;
  }

  /**
   * Payment cancellation timestamp.
   */
  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt;
  }

  /**
   * Entity creation timestamp.
   */
  public get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Entity last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Status Queries
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.status.isPending();
  }

  public isProcessing(): boolean {
    return this.props.status.isProcessing();
  }

  public isSucceeded(): boolean {
    return this.props.status.isSucceeded();
  }

  public isFailed(): boolean {
    return this.props.status.isFailed();
  }

  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  public isExpired(): boolean {
    return this.props.status.isExpired();
  }

  public isTerminal(): boolean {
    return this.props.status.isTerminal();
  }

  public isSuccessful(): boolean {
    return this.props.status.isSuccessful();
  }

  // ---------------------------------------------------------------------------
  // Payment Method
  // ---------------------------------------------------------------------------

  /**
   * Selects a Financial Payment Method.
   *
   * The entity stores only the method's public identity.
   *
   * Validation that the referenced payment method actually exists, belongs to
   * the correct account, and is usable belongs to the application/domain
   * service boundary.
   */
  public setPaymentMethod(methodId: FinancialPaymentMethodPublicId): void {
    if (this.isTerminal()) {
      throw new Error(
        'Cannot change payment method of a terminal Financial Payment',
      );
    }

    this.props.methodId = methodId;

    this.touch();
  }

  /**
   * Clears the selected payment method.
   */
  public clearPaymentMethod(): void {
    if (this.isTerminal()) {
      throw new Error(
        'Cannot change payment method of a terminal Financial Payment',
      );
    }

    this.props.methodId = undefined;

    this.touch();
  }

  public hasPaymentMethod(): boolean {
    return this.props.methodId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Attempts
  // ---------------------------------------------------------------------------

  /**
   * Adds a provider execution attempt to the aggregate.
   *
   * Aggregate invariants enforced here:
   *
   * 1. The payment must be able to accept another attempt.
   * 2. The attempt must belong to this payment.
   * 3. The attempt amount must exactly equal the payment amount.
   * 4. The attempt must not already exist in the aggregate.
   */
  public addAttempt(attempt: FinancialPaymentAttemptEntity): void {
    // -------------------------------------------------------------------------
    // Attempt eligibility
    // -------------------------------------------------------------------------

    if (!this.canCreateAttempt()) {
      throw new Error(
        'Financial Payment cannot accept another payment attempt',
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate ownership
    // -------------------------------------------------------------------------

    if (!attempt.paymentId.equals(this.id)) {
      throw new Error(
        'Financial Payment Attempt does not belong to this Financial Payment',
      );
    }

    // -------------------------------------------------------------------------
    // Amount invariant
    // -------------------------------------------------------------------------

    if (!attempt.amount.equals(this.amount)) {
      throw new Error(
        'Financial Payment Attempt amount and currency must exactly match the Financial Payment amount and currency',
      );
    }

    // -------------------------------------------------------------------------
    // Duplicate invariant
    // -------------------------------------------------------------------------

    if (
      this.props.attempts.some((existingAttempt) =>
        existingAttempt.id.equals(attempt.id),
      )
    ) {
      throw new Error(
        'Financial Payment Attempt has already been added to this Financial Payment',
      );
    }

    // -------------------------------------------------------------------------
    // Attach child
    // -------------------------------------------------------------------------

    this.props.attempts.push(attempt);

    this.touch();
  }

  /**
   * Returns the most recently added attempt.
   */
  public getLatestAttempt(): FinancialPaymentAttemptEntity | undefined {
    return this.props.attempts[this.props.attempts.length - 1];
  }

  /**
   * Returns the latest non-terminal attempt.
   */
  public getActiveAttempt(): FinancialPaymentAttemptEntity | undefined {
    for (let index = this.props.attempts.length - 1; index >= 0; index -= 1) {
      const attempt = this.props.attempts[index];

      if (attempt !== undefined && !attempt.isTerminal()) {
        return attempt;
      }
    }

    return undefined;
  }

  /**
   * Determines whether the aggregate currently has an active provider
   * execution attempt.
   */
  public hasActiveAttempt(): boolean {
    return this.getActiveAttempt() !== undefined;
  }

  /**
   * Determines whether at least one attempt has succeeded.
   */
  public hasSuccessfulAttempt(): boolean {
    return this.props.attempts.some((attempt) => attempt.isSuccessful());
  }

  /**
   * Determines whether another provider execution attempt may be created.
   *
   * A new attempt is allowed only while the payment is:
   *
   * - PENDING, or
   * - PROCESSING
   *
   * and no previous attempt has succeeded.
   */
  public canCreateAttempt(): boolean {
    return (
      (this.isPending() || this.isProcessing()) && !this.hasSuccessfulAttempt()
    );
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Moves the Financial Payment into PROCESSING state.
   *
   * Domain-event emission is handled by FinancialPaymentAggregate.
   */
  public startProcessing(at: Date = new Date()): void {
    this.transitionTo(FinancialPaymentStatus.create('PROCESSING'));

    this.touch(at);
  }

  /**
   * Completes the Financial Payment successfully.
   *
   * A successful provider attempt is mandatory.
   */
  public succeed(at: Date = new Date()): void {
    if (!this.hasSuccessfulAttempt()) {
      throw new Error(
        'Financial Payment cannot succeed without a successful payment attempt',
      );
    }

    this.transitionTo(FinancialPaymentStatus.create('SUCCEEDED'));

    this.props.completedAt = at;

    this.props.failedAt = undefined;

    this.props.cancelledAt = undefined;

    this.touch(at);
  }

  /**
   * Marks the payment as failed.
   */
  public fail(at: Date = new Date()): void {
    this.transitionTo(FinancialPaymentStatus.create('FAILED'));

    this.props.failedAt = at;

    this.props.completedAt = undefined;

    this.props.cancelledAt = undefined;

    this.touch(at);
  }

  /**
   * Cancels the payment.
   */
  public cancel(at: Date = new Date()): void {
    this.transitionTo(FinancialPaymentStatus.create('CANCELLED'));

    this.props.cancelledAt = at;

    this.props.completedAt = undefined;

    this.props.failedAt = undefined;

    this.touch(at);
  }

  /**
   * Expires the payment.
   */
  public expire(at: Date = new Date()): void {
    this.transitionTo(FinancialPaymentStatus.create('EXPIRED'));

    this.props.completedAt = undefined;

    this.props.failedAt = undefined;

    this.props.cancelledAt = undefined;

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Transaction Reference
  // ---------------------------------------------------------------------------

  /**
   * Links this payment to the Financial Transaction representing its
   * resulting financial effect.
   *
   * The transaction must already exist and be represented by its public
   * identity.
   *
   * The Financial Payment entity never creates or modifies that transaction.
   */
  public setTransactionPublicId(transactionPublicId: string): void {
    const normalized = transactionPublicId.trim();

    if (!normalized) {
      throw new Error(
        'Financial Payment transaction public ID must not be empty',
      );
    }

    // -------------------------------------------------------------------------
    // Idempotent assignment
    // -------------------------------------------------------------------------

    if (this.props.transactionPublicId !== undefined) {
      if (this.props.transactionPublicId === normalized) {
        return;
      }

      throw new Error(
        'Financial Payment already has a Financial Transaction reference',
      );
    }

    // -------------------------------------------------------------------------
    // Lifecycle invariant
    // -------------------------------------------------------------------------

    if (!this.isSucceeded()) {
      throw new Error(
        'A Financial Transaction reference can only be assigned to a successful Financial Payment',
      );
    }

    this.props.transactionPublicId = normalized;

    this.touch();
  }

  public hasTransaction(): boolean {
    return this.props.transactionPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Business Reference
  // ---------------------------------------------------------------------------

  /**
   * Sets the originating business reference.
   *
   * Both reference components must be supplied together.
   */
  public setReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): void {
    if (this.isTerminal()) {
      throw new Error(
        'Cannot change reference of a terminal Financial Payment',
      );
    }

    this.props.referenceType = referenceType;

    this.props.referencePublicId = referencePublicId;

    this.touch();
  }

  /**
   * Clears the originating business reference.
   */
  public clearReference(): void {
    if (this.isTerminal()) {
      throw new Error(
        'Cannot change reference of a terminal Financial Payment',
      );
    }

    this.props.referenceType = undefined;

    this.props.referencePublicId = undefined;

    this.touch();
  }

  public hasReference(): boolean {
    return (
      this.props.referenceType !== undefined &&
      this.props.referencePublicId !== undefined
    );
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Transition
  // ---------------------------------------------------------------------------

  /**
   * Applies a payment lifecycle transition.
   *
   * FinancialPaymentStatus owns the transition matrix.
   *
   * This entity only applies a transition that the value object has already
   * determined to be valid.
   */
  private transitionTo(nextStatus: FinancialPaymentStatus): void {
    if (!this.props.status.canTransitionTo(nextStatus)) {
      throw new Error(
        `Invalid Financial Payment status transition: ` +
          `${this.props.status.value} -> ${nextStatus.value}`,
      );
    }

    this.props.status = nextStatus;
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Explicitly sets the entity's update timestamp.
   *
   * Normally lifecycle mutations use touch(), while rehydration/mapping may
   * use this method when restoring persisted state.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }
}

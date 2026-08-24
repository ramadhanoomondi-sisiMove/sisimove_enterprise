// -----------------------------------------------------------------------------
// Financial Payment Attempt Entity
// -----------------------------------------------------------------------------
//
// Represents one concrete execution attempt of a Financial Payment against
// an external financial provider.
//
// Aggregate ownership:
//
// FinancialPaymentAggregate
// └── FinancialPaymentEntity
//     └── FinancialPaymentAttemptEntity[]
//
// FinancialPaymentEntity is the aggregate root.
// FinancialPaymentAttemptEntity is a child entity and must not be treated as
// an independent aggregate root.
//
// Responsibilities:
// - Maintain attempt identity.
// - Maintain owning Financial Payment identity.
// - Maintain provider information.
// - Maintain provider reference.
// - Maintain attempted monetary amount.
// - Maintain attempt lifecycle.
// - Maintain provider failure information.
// - Maintain execution timestamps.
// - Enforce attempt lifecycle invariants.
//
// This entity does NOT:
// - Execute provider APIs.
// - Communicate with external providers.
// - Post Financial Transactions.
// - Modify Financial Account balances.
// - Create ledger entries.
// - Persist itself.
// - Decide whether the parent Financial Payment may create another attempt.
//
// The parent FinancialPaymentEntity owns aggregate-level attempt invariants.
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

import { FinancialPaymentAttemptPublicId } from '../value-objects/financial-payment-attempt-public-id.vo';

import { FinancialPaymentAttemptStatus } from '../value-objects/financial-payment-attempt-status.vo';

import type { Money } from '../value-objects/money.vo';

import type { FinancialProvider } from '../value-objects/financial-provider.vo';

import type { FinancialProviderReference } from '../value-objects/financial-provider-reference.vo';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialPaymentAttemptProps {
  /**
   * Internal identity of the owning Financial Payment aggregate.
   *
   * This is intentionally an internal entity identity because the parent
   * aggregate uses it to enforce ownership.
   */
  paymentId: UniqueEntityId;

  /**
   * Attempt lifecycle status.
   *
   * Newly created attempts begin in PENDING state.
   */
  status: FinancialPaymentAttemptStatus;

  /**
   * External financial provider used for this execution attempt.
   */
  provider: FinancialProvider;

  /**
   * Provider-issued reference.
   *
   * This may be unavailable until the provider accepts the execution request.
   *
   * Only a safe provider reference may be stored here.
   * Raw credentials, secrets, tokens, card numbers, or equivalent sensitive
   * provider data must never be stored in the domain entity.
   */
  providerReference: FinancialProviderReference | undefined;

  /**
   * Monetary amount attempted.
   *
   * Money keeps amount and currency inseparable.
   *
   * FinancialPaymentEntity enforces that this exactly matches the parent
   * Financial Payment amount before attaching the attempt.
   */
  amount: Money;

  /**
   * Safe provider/domain failure information.
   */
  failureCode: string | undefined;
  failureMessage: string | undefined;

  /**
   * Attempt execution timestamps.
   */
  startedAt: Date | undefined;
  completedAt: Date | undefined;
  failedAt: Date | undefined;
  cancelledAt: Date | undefined;
  expiredAt: Date | undefined;

  /**
   * Audit timestamps.
   */
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialPaymentAttemptEntity extends Entity<
  FinancialPaymentAttemptProps,
  FinancialPaymentAttemptPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    props: FinancialPaymentAttemptProps,
    id?: UniqueEntityId,
    publicId?: FinancialPaymentAttemptPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Financial Payment Attempt.
   *
   * New attempts always begin in PENDING state.
   *
   * The parent FinancialPaymentEntity is responsible for enforcing aggregate
   * invariants, including:
   *
   * - attempt belongs to the payment;
   * - attempt amount exactly matches payment amount;
   * - another attempt is permitted;
   * - a successful payment cannot receive another attempt.
   */
  public static create(
    paymentId: UniqueEntityId,
    provider: FinancialProvider,
    amount: Money,
    providerReference?: FinancialProviderReference,
  ): FinancialPaymentAttemptEntity {
    if (!amount.isPositive()) {
      throw new Error(
        'Financial Payment Attempt amount must be greater than zero',
      );
    }

    const now = new Date();

    return new FinancialPaymentAttemptEntity(
      {
        paymentId,

        status: FinancialPaymentAttemptStatus.create('PENDING'),

        provider,

        providerReference: providerReference ?? undefined,

        amount,

        failureCode: undefined,
        failureMessage: undefined,

        startedAt: undefined,
        completedAt: undefined,
        failedAt: undefined,
        cancelledAt: undefined,
        expiredAt: undefined,

        createdAt: now,
        updatedAt: now,
      },

      new UniqueEntityId(),

      new FinancialPaymentAttemptPublicId(),
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): FinancialPaymentAttemptPublicId {
    return super.publicId;
  }

  /**
   * Internal identity of the owning Financial Payment aggregate.
   */
  public get paymentId(): UniqueEntityId {
    return this.props.paymentId;
  }

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  public get status(): FinancialPaymentAttemptStatus {
    return this.props.status;
  }

  public get provider(): FinancialProvider {
    return this.props.provider;
  }

  public get providerReference(): FinancialProviderReference | undefined {
    return this.props.providerReference;
  }

  public get amount(): Money {
    return this.props.amount;
  }

  public get failureCode(): string | undefined {
    return this.props.failureCode;
  }

  public get failureMessage(): string | undefined {
    return this.props.failureMessage;
  }

  public get startedAt(): Date | undefined {
    return this.props.startedAt;
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

  public get expiredAt(): Date | undefined {
    return this.props.expiredAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Moves a PENDING attempt into PROCESSING.
   *
   * The status value object is responsible for validating whether the
   * transition is legal.
   */
  public start(startedAt: Date = new Date()): void {
    this.transitionTo(FinancialPaymentAttemptStatus.create('PROCESSING'));

    this.props.startedAt = startedAt;

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;
    this.props.cancelledAt = undefined;
    this.props.expiredAt = undefined;

    this.clearFailureInformation();

    this.touch(startedAt);
  }

  /**
   * Marks the attempt as successfully completed.
   */
  public succeed(completedAt: Date = new Date()): void {
    this.transitionTo(FinancialPaymentAttemptStatus.create('SUCCEEDED'));

    this.props.completedAt = completedAt;

    this.props.failedAt = undefined;
    this.props.cancelledAt = undefined;
    this.props.expiredAt = undefined;

    this.clearFailureInformation();

    this.touch(completedAt);
  }

  /**
   * Marks the attempt as failed.
   *
   * Failure information is intentionally limited to safe diagnostic
   * information. Provider credentials and sensitive provider data must never
   * be passed here.
   */
  public fail(
    failureCode?: string,
    failureMessage?: string,
    failedAt: Date = new Date(),
  ): void {
    this.transitionTo(FinancialPaymentAttemptStatus.create('FAILED'));

    this.props.failureCode = failureCode?.trim() || undefined;

    this.props.failureMessage = failureMessage?.trim() || undefined;

    this.props.failedAt = failedAt;

    this.props.completedAt = undefined;
    this.props.cancelledAt = undefined;
    this.props.expiredAt = undefined;

    this.touch(failedAt);
  }

  /**
   * Cancels the attempt.
   *
   * Cancellation does not imply that provider-side cancellation has occurred.
   * Provider communication belongs to the integration boundary.
   */
  public cancel(cancelledAt: Date = new Date()): void {
    this.transitionTo(FinancialPaymentAttemptStatus.create('CANCELLED'));

    this.props.cancelledAt = cancelledAt;

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;
    this.props.expiredAt = undefined;

    this.clearFailureInformation();

    this.touch(cancelledAt);
  }

  /**
   * Expires the attempt.
   *
   * Expiration represents the domain lifecycle becoming EXPIRED. It does not
   * communicate with the external provider or cancel a provider-side request.
   */
  public expire(expiredAt: Date = new Date()): void {
    this.transitionTo(FinancialPaymentAttemptStatus.create('EXPIRED'));

    this.props.expiredAt = expiredAt;

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;
    this.props.cancelledAt = undefined;

    this.clearFailureInformation();

    this.touch(expiredAt);
  }

  // ---------------------------------------------------------------------------
  // Provider Reference
  // ---------------------------------------------------------------------------

  /**
   * Assigns the provider reference returned by the integration boundary.
   *
   * A provider reference may only be changed while the attempt remains
   * non-terminal.
   */
  public setProviderReference(
    providerReference: FinancialProviderReference,
  ): void {
    if (this.isTerminal()) {
      throw new Error(
        'Cannot set a provider reference on a terminal Financial Payment Attempt',
      );
    }

    this.props.providerReference = providerReference;

    this.touch();
  }

  /**
   * Returns whether a provider reference has been assigned.
   */
  public hasProviderReference(): boolean {
    return this.props.providerReference !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Failure Information
  // ---------------------------------------------------------------------------

  /**
   * Clears provider failure information.
   *
   * Failure information may only be changed while the attempt is
   * non-terminal.
   */
  public clearFailure(): void {
    if (this.isTerminal()) {
      throw new Error(
        'Cannot clear failure information from a terminal Financial Payment Attempt',
      );
    }

    this.clearFailureInformation();

    this.touch();
  }

  /**
   * Internal failure-information reset.
   *
   * This deliberately does not call touch(), allowing lifecycle methods to
   * perform one consistent audit update.
   */
  private clearFailureInformation(): void {
    this.props.failureCode = undefined;
    this.props.failureMessage = undefined;
  }

  /**
   * Returns whether provider failure information exists.
   */
  public hasFailure(): boolean {
    return (
      this.props.failureCode !== undefined ||
      this.props.failureMessage !== undefined
    );
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Queries
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
  // Status
  // ---------------------------------------------------------------------------

  private transitionTo(nextStatus: FinancialPaymentAttemptStatus): void {
    if (!this.props.status.canTransitionTo(nextStatus)) {
      throw new Error(
        `Invalid Financial Payment Attempt status transition: ` +
          `${this.props.status.value} -> ${nextStatus.value}`,
      );
    }

    this.props.status = nextStatus;
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }
}

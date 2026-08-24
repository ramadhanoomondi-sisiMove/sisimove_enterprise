// -----------------------------------------------------------------------------
// Financial Payment Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate root for the Financial Payment lifecycle.
//
// Aggregate:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Responsibilities:
// - Own the Financial Payment entity.
// - Own and coordinate Financial Payment Attempts.
// - Enforce payment lifecycle invariants at the aggregate boundary.
// - Coordinate payment-method selection.
// - Coordinate provider-attempt creation.
// - Coordinate payment lifecycle transitions.
// - Coordinate linking of the resulting Financial Transaction.
// - Emit Financial Payment domain events.
//
// This aggregate does NOT:
// - Execute external provider APIs.
// - Communicate directly with payment providers.
// - Modify Financial Account balances.
// - Create or post Financial Transactions.
// - Persist itself.
// - Perform settlement.
// - Perform accounting.
// - Retry provider operations itself.
//
// Provider execution belongs to the application/integration boundary.
// Financial Transaction creation/posting belongs to the appropriate
// transaction boundary.
// Persistence belongs to the repository/infrastructure boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { FinancialPaymentEntity } from '../entities/financial-payment.entity';

// -----------------------------------------------------------------------------
// Child Entity
// -----------------------------------------------------------------------------

import type { FinancialPaymentAttemptEntity } from '../entities/financial-payment-attempt.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { FinancialPaymentCreatedEvent } from '../events/financial-payment-created.event';

import { FinancialPaymentAttemptAddedEvent } from '../events/financial-payment-attempt-added.event';

import { FinancialPaymentProcessingEvent } from '../events/financial-payment-processing.event';

import { FinancialPaymentSucceededEvent } from '../events/financial-payment-succeeded.event';

import { FinancialPaymentFailedEvent } from '../events/financial-payment-failed.event';

import { FinancialPaymentCancelledEvent } from '../events/financial-payment-cancelled.event';

import { FinancialPaymentExpiredEvent } from '../events/financial-payment-expired.event';

import { FinancialPaymentTransactionLinkedEvent } from '../events/financial-payment-transaction-linked.event';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentException } from '../exceptions/financial-payment.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodPublicId } from '../value-objects/financial-payment-method-public-id.vo';

import type { FinancialPaymentStatus } from '../value-objects/financial-payment-status.vo';

import type { Money } from '../value-objects/money.vo';

import type { FinancialReferencePublicId } from '../value-objects/financial-reference-public-id.vo';

import type { FinancialReferenceType } from '../value-objects/financial-reference-type.vo';

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialPaymentAggregateProps {
  payment: FinancialPaymentEntity;
}

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class FinancialPaymentAggregate extends AggregateRoot<FinancialPaymentAggregateProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(props: FinancialPaymentAggregateProps) {
    super(props);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a brand-new Financial Payment aggregate.
   *
   * The FinancialPaymentEntity is expected to already contain the complete
   * initial state established by its entity factory.
   *
   * Creation does not automatically emit a domain event. Event emission is
   * explicit through emitCreatedEvent().
   */
  public static create(
    payment: FinancialPaymentEntity,
  ): FinancialPaymentAggregate {
    return new FinancialPaymentAggregate({
      payment,
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Rehydrates a Financial Payment aggregate from persistence.
   *
   * No domain events are emitted during rehydration.
   */
  public static rehydrate(
    payment: FinancialPaymentEntity,
  ): FinancialPaymentAggregate {
    return new FinancialPaymentAggregate({
      payment,
    });
  }

  // ---------------------------------------------------------------------------
  // Aggregate State
  // ---------------------------------------------------------------------------

  public get payment(): FinancialPaymentEntity {
    return this.props.payment;
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get id() {
    return this.payment.id;
  }

  public override get publicId() {
    return this.payment.publicId;
  }

  // ---------------------------------------------------------------------------
  // Payment State
  // ---------------------------------------------------------------------------

  public get accountId(): PublicEntityId {
    return this.payment.accountId;
  }

  public get amount(): Money {
    return this.payment.amount;
  }

  public get status(): FinancialPaymentStatus {
    return this.payment.status;
  }

  public get methodId(): FinancialPaymentMethodPublicId | undefined {
    return this.payment.methodId;
  }

  public get transactionPublicId(): string | undefined {
    return this.payment.transactionPublicId;
  }

  public get referenceType(): FinancialReferenceType | undefined {
    return this.payment.referenceType;
  }

  public get referencePublicId(): FinancialReferencePublicId | undefined {
    return this.payment.referencePublicId;
  }

  public get initiatedAt(): Date {
    return this.payment.initiatedAt;
  }

  public get completedAt(): Date | undefined {
    return this.payment.completedAt;
  }

  public get failedAt(): Date | undefined {
    return this.payment.failedAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.payment.cancelledAt;
  }

  public get createdAt(): Date {
    return this.payment.createdAt;
  }

  public get updatedAt(): Date {
    return this.payment.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Attempts
  // ---------------------------------------------------------------------------

  /**
   * Returns the payment attempts as a read-only collection.
   */
  public get attempts(): readonly FinancialPaymentAttemptEntity[] {
    return this.payment.attempts;
  }

  public getLatestAttempt(): FinancialPaymentAttemptEntity | undefined {
    return this.payment.getLatestAttempt();
  }

  public getActiveAttempt(): FinancialPaymentAttemptEntity | undefined {
    return this.payment.getActiveAttempt();
  }

  public hasActiveAttempt(): boolean {
    return this.payment.hasActiveAttempt();
  }

  public hasSuccessfulAttempt(): boolean {
    return this.payment.hasSuccessfulAttempt();
  }

  public canCreateAttempt(): boolean {
    return this.payment.canCreateAttempt();
  }

  // ---------------------------------------------------------------------------
  // Status Queries
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.payment.isPending();
  }

  public isProcessing(): boolean {
    return this.payment.isProcessing();
  }

  public isSucceeded(): boolean {
    return this.payment.isSucceeded();
  }

  public isFailed(): boolean {
    return this.payment.isFailed();
  }

  public isCancelled(): boolean {
    return this.payment.isCancelled();
  }

  public isExpired(): boolean {
    return this.payment.isExpired();
  }

  public isTerminal(): boolean {
    return this.payment.isTerminal();
  }

  public isSuccessful(): boolean {
    return this.payment.isSuccessful();
  }

  // ---------------------------------------------------------------------------
  // Payment Method
  // ---------------------------------------------------------------------------

  /**
   * Selects the Financial Payment Method used by the payment.
   *
   * The aggregate stores only the payment method public identity.
   *
   * It does not load or mutate the FinancialPaymentMethod aggregate.
   */
  public setPaymentMethod(methodId: FinancialPaymentMethodPublicId): void {
    if (this.payment.isTerminal()) {
      throw new FinancialPaymentException(
        'Cannot change payment method of a terminal Financial Payment',
      );
    }

    this.payment.setPaymentMethod(methodId);
  }

  /**
   * Removes the selected payment method.
   */
  public clearPaymentMethod(): void {
    if (this.payment.isTerminal()) {
      throw new FinancialPaymentException(
        'Cannot change payment method of a terminal Financial Payment',
      );
    }

    this.payment.clearPaymentMethod();
  }

  public hasPaymentMethod(): boolean {
    return this.payment.hasPaymentMethod();
  }

  // ---------------------------------------------------------------------------
  // Attempts
  // ---------------------------------------------------------------------------

  /**
   * Adds a provider execution attempt to the Financial Payment.
   *
   * The entity enforces:
   * - aggregate ownership;
   * - amount equality;
   * - duplicate prevention;
   * - attempt creation eligibility.
   *
   * The aggregate emits the corresponding domain event after the attempt
   * has successfully been attached.
   */
  public addAttempt(
    attempt: FinancialPaymentAttemptEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    this.payment.addAttempt(attempt);

    this.addDomainEvent(
      new FinancialPaymentAttemptAddedEvent(
        this.id.value,
        this.publicId,
        attempt.publicId,
        attempt.status,
        attempt.provider,
        attempt.amount,
        correlationId,
        causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Processing
  // ---------------------------------------------------------------------------

  /**
   * Moves the Financial Payment into PROCESSING.
   *
   * The aggregate does not execute the provider operation.
   *
   * Provider execution is performed by the application/integration layer after
   * this lifecycle event has been emitted.
   */
  public startProcessing(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    this.payment.startProcessing(at);

    this.addDomainEvent(
      new FinancialPaymentProcessingEvent(
        this.id.value,
        this.publicId,
        this.accountId,
        this.amount,
        this.status,
        correlationId,
        causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Success
  // ---------------------------------------------------------------------------

  /**
   * Completes the Financial Payment successfully.
   *
   * A successful payment attempt is mandatory.
   *
   * The resulting Financial Transaction may already have been established
   * before this event is emitted, but the aggregate does not create it.
   */
  public succeed(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    const successfulAttempt = this.getSuccessfulAttempt();

    if (successfulAttempt === undefined) {
      throw new FinancialPaymentException(
        'Financial Payment cannot succeed without a successful payment attempt',
      );
    }

    this.payment.succeed(at);

    this.addDomainEvent(
      new FinancialPaymentSucceededEvent(
        this.id.value,
        this.publicId,
        this.amount,
        this.status,
        this.methodId,
        successfulAttempt.publicId,
        this.transactionPublicId,
        this.completedAt ?? at,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Returns the successful attempt.
   *
   * At most one successful attempt is permitted by the aggregate invariant.
   */
  public getSuccessfulAttempt(): FinancialPaymentAttemptEntity | undefined {
    for (const attempt of this.payment.attempts) {
      if (attempt.isSuccessful()) {
        return attempt;
      }
    }

    return undefined;
  }

  // ---------------------------------------------------------------------------
  // Failure
  // ---------------------------------------------------------------------------

  /**
   * Marks the Financial Payment as failed.
   *
   * The latest attempt is included in the event when available so consumers
   * can understand which provider execution resulted in the failure.
   *
   * Failure information is read from the latest attempt when available.
   */
  public fail(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    if (this.payment.hasActiveAttempt()) {
      throw new FinancialPaymentException(
        'Financial Payment cannot fail while a payment attempt is still active',
      );
    }

    const latestAttempt = this.getLatestAttempt();

    this.payment.fail(at);

    this.addDomainEvent(
      new FinancialPaymentFailedEvent(
        this.id.value,
        this.publicId,
        this.amount,
        this.status,
        latestAttempt?.publicId,
        latestAttempt?.failureCode,
        latestAttempt?.failureMessage,
        this.failedAt ?? at,
        correlationId,
        causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Cancellation
  // ---------------------------------------------------------------------------

  /**
   * Cancels the Financial Payment.
   *
   * Provider-side cancellation is intentionally outside this aggregate.
   */
  public cancel(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    if (this.payment.hasActiveAttempt()) {
      throw new FinancialPaymentException(
        'Financial Payment cannot be cancelled while a payment attempt is active',
      );
    }

    this.payment.cancel(at);

    this.addDomainEvent(
      new FinancialPaymentCancelledEvent(
        this.id.value,
        this.publicId,
        this.amount,
        this.status,
        this.cancelledAt ?? at,
        correlationId,
        causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Expiration
  // ---------------------------------------------------------------------------

  /**
   * Expires the Financial Payment.
   *
   * Expiration is a payment lifecycle concern. Provider-side expiration or
   * cancellation remains an integration concern.
   */
  public expire(
    at: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    if (this.payment.hasActiveAttempt()) {
      throw new FinancialPaymentException(
        'Financial Payment cannot expire while a payment attempt is active',
      );
    }

    this.payment.expire(at);

    this.addDomainEvent(
      new FinancialPaymentExpiredEvent(
        this.id.value,
        this.publicId,
        this.amount,
        this.status,
        at,
        correlationId,
        causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Transaction Reference
  // ---------------------------------------------------------------------------

  /**
   * Links the Financial Payment to its resulting Financial Transaction.
   *
   * The transaction is a separate aggregate.
   *
   * This aggregate stores only its opaque public identity.
   */
  public linkTransaction(
    transactionPublicId: string,
    correlationId: string,
    causationId?: string,
  ): void {
    this.payment.setTransactionPublicId(transactionPublicId);

    this.addDomainEvent(
      new FinancialPaymentTransactionLinkedEvent(
        this.id.value,
        this.publicId,
        this.transactionPublicId!,
        this.status,
        correlationId,
        causationId,
      ),
    );
  }

  public hasTransaction(): boolean {
    return this.payment.hasTransaction();
  }

  // ---------------------------------------------------------------------------
  // Business Reference
  // ---------------------------------------------------------------------------

  /**
   * Sets the originating business reference.
   *
   * The aggregate stores only opaque references and never embeds the
   * originating business aggregate.
   */
  public setReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): void {
    this.payment.setReference(referenceType, referencePublicId);
  }

  public clearReference(): void {
    this.payment.clearReference();
  }

  public hasReference(): boolean {
    return this.payment.hasReference();
  }

  // ---------------------------------------------------------------------------
  // Creation Event
  // ---------------------------------------------------------------------------

  /**
   * Emits the FinancialPaymentCreated event.
   *
   * This is intentionally separate from create() so that aggregate creation
   * and event recording remain explicit.
   *
   * Rehydration never emits this event.
   */
  public emitCreatedEvent(correlationId: string, causationId?: string): void {
    this.addDomainEvent(
      new FinancialPaymentCreatedEvent(
        this.id.value,
        this.publicId,
        this.accountId,
        this.amount,
        this.status,
        this.methodId,
        this.referenceType,
        this.referencePublicId,
        correlationId,
        causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Event Helpers
  // ---------------------------------------------------------------------------

  /**
   * Emits the creation event.
   *
   * Alias retained for consistency with other Financial aggregates.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.emitCreatedEvent(correlationId, causationId);
  }
}

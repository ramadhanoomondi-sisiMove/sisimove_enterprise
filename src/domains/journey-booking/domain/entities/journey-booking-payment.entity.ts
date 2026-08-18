// -----------------------------------------------------------------------------
// Journey Booking Payment Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyBookingPaymentPublicId } from '../value-objects/journey-booking-payment-public-id.vo';

import type { JourneyBookingPaymentStatus } from '../value-objects/journey-booking-payment-status.vo';

import type { JourneyBookingPaymentAmount } from '../value-objects/journey-booking-payment-amount.vo';

import type { JourneyBookingCurrency } from '../value-objects/journey-booking-currency.vo';

import type { JourneyBookingTransactionPublicId } from '../value-objects/journey-booking-transaction-public-id.vo';

import type { JourneyBookingPaymentFailureReason } from '../value-objects/journey-booking-payment-failure-reason.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyBookingPaymentProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: JourneyBookingPaymentPublicId;

  // ---------------------------------------------------------------------------
  // Payment State
  // ---------------------------------------------------------------------------

  status: JourneyBookingPaymentStatus;

  amount: JourneyBookingPaymentAmount;

  currency: JourneyBookingCurrency;

  // ---------------------------------------------------------------------------
  // Cross-domain Transaction Reference
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the transaction in the Payment/Transaction domain.
   *
   * This is intentionally NOT a domain relation.
   */
  transactionPublicId: JourneyBookingTransactionPublicId | undefined;

  // ---------------------------------------------------------------------------
  // Payment Lifecycle
  // ---------------------------------------------------------------------------

  authorizedAt: Date | undefined;

  capturedAt: Date | undefined;

  failedAt: Date | undefined;

  refundedAt: Date | undefined;

  failureReason: JourneyBookingPaymentFailureReason | undefined;

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
 * Represents the payment state belonging to a Journey Booking.
 *
 * The JourneyBooking aggregate owns this entity.
 *
 * The entity stores the booking payment state and payment lifecycle.
 * Actual payment processing remains outside the Journey Booking domain.
 */
export class JourneyBookingPaymentEntity extends Entity<
  JourneyBookingPaymentProps,
  JourneyBookingPaymentPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneyBookingPaymentProps,
    id?: UniqueEntityId,
    publicId?: JourneyBookingPaymentPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyBookingPaymentPublicId;

    /**
     * The aggregate/application layer supplies the initial payment status.
     *
     * A newly created payment should normally be PENDING.
     */
    status: JourneyBookingPaymentStatus;

    amount: JourneyBookingPaymentAmount;

    currency: JourneyBookingCurrency;

    transactionPublicId?: JourneyBookingTransactionPublicId | undefined;

    authorizedAt?: Date | undefined;

    capturedAt?: Date | undefined;

    failedAt?: Date | undefined;

    refundedAt?: Date | undefined;

    failureReason?: JourneyBookingPaymentFailureReason | undefined;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): JourneyBookingPaymentEntity {
    const now = new Date();

    const entityProps: JourneyBookingPaymentProps = {
      publicId: props.publicId ?? new JourneyBookingPaymentPublicId(),

      status: props.status,

      amount: props.amount,

      currency: props.currency,

      transactionPublicId: props.transactionPublicId,

      authorizedAt:
        props.authorizedAt !== undefined
          ? JourneyBookingPaymentEntity.cloneDate(props.authorizedAt)
          : undefined,

      capturedAt:
        props.capturedAt !== undefined
          ? JourneyBookingPaymentEntity.cloneDate(props.capturedAt)
          : undefined,

      failedAt:
        props.failedAt !== undefined
          ? JourneyBookingPaymentEntity.cloneDate(props.failedAt)
          : undefined,

      refundedAt:
        props.refundedAt !== undefined
          ? JourneyBookingPaymentEntity.cloneDate(props.refundedAt)
          : undefined,

      failureReason: props.failureReason,

      createdAt: JourneyBookingPaymentEntity.cloneDate(props.createdAt ?? now),

      updatedAt: JourneyBookingPaymentEntity.cloneDate(props.updatedAt ?? now),
    };

    return new JourneyBookingPaymentEntity(entityProps);
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyBookingPaymentProps,
    id: UniqueEntityId,
    publicId: JourneyBookingPaymentPublicId,
  ): JourneyBookingPaymentEntity {
    const entityProps: JourneyBookingPaymentProps = {
      publicId,

      status: props.status,

      amount: props.amount,

      currency: props.currency,

      transactionPublicId: props.transactionPublicId,

      authorizedAt:
        props.authorizedAt !== undefined
          ? JourneyBookingPaymentEntity.cloneDate(props.authorizedAt)
          : undefined,

      capturedAt:
        props.capturedAt !== undefined
          ? JourneyBookingPaymentEntity.cloneDate(props.capturedAt)
          : undefined,

      failedAt:
        props.failedAt !== undefined
          ? JourneyBookingPaymentEntity.cloneDate(props.failedAt)
          : undefined,

      refundedAt:
        props.refundedAt !== undefined
          ? JourneyBookingPaymentEntity.cloneDate(props.refundedAt)
          : undefined,

      failureReason: props.failureReason,

      createdAt: JourneyBookingPaymentEntity.cloneDate(props.createdAt),

      updatedAt: JourneyBookingPaymentEntity.cloneDate(props.updatedAt),
    };

    return new JourneyBookingPaymentEntity(entityProps, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneyBookingPaymentPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): JourneyBookingPaymentStatus {
    return this.props.status;
  }

  public setStatus(status: JourneyBookingPaymentStatus): void {
    this.props.status = status;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Amount
  // ---------------------------------------------------------------------------

  public get amount(): JourneyBookingPaymentAmount {
    return this.props.amount;
  }

  public setAmount(amount: JourneyBookingPaymentAmount): void {
    this.props.amount = amount;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  public get currency(): JourneyBookingCurrency {
    return this.props.currency;
  }

  public setCurrency(currency: JourneyBookingCurrency): void {
    this.props.currency = currency;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Transaction
  // ---------------------------------------------------------------------------

  public get transactionPublicId():
    JourneyBookingTransactionPublicId | undefined {
    return this.props.transactionPublicId;
  }

  public setTransactionPublicId(
    transactionPublicId: JourneyBookingTransactionPublicId,
  ): void {
    this.props.transactionPublicId = transactionPublicId;

    this.touch();
  }

  public clearTransactionPublicId(): void {
    if (this.props.transactionPublicId === undefined) {
      return;
    }

    this.props.transactionPublicId = undefined;

    this.touch();
  }

  public hasTransaction(): boolean {
    return this.props.transactionPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Authorized
  // ---------------------------------------------------------------------------

  public get authorizedAt(): Date | undefined {
    return this.props.authorizedAt !== undefined
      ? JourneyBookingPaymentEntity.cloneDate(this.props.authorizedAt)
      : undefined;
  }

  public setAuthorizedAt(at: Date): void {
    this.props.authorizedAt = JourneyBookingPaymentEntity.cloneDate(at);

    this.touch();
  }

  public clearAuthorizedAt(): void {
    if (this.props.authorizedAt === undefined) {
      return;
    }

    this.props.authorizedAt = undefined;

    this.touch();
  }

  public hasBeenAuthorized(): boolean {
    return this.props.authorizedAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Captured
  // ---------------------------------------------------------------------------

  public get capturedAt(): Date | undefined {
    return this.props.capturedAt !== undefined
      ? JourneyBookingPaymentEntity.cloneDate(this.props.capturedAt)
      : undefined;
  }

  public setCapturedAt(at: Date): void {
    this.props.capturedAt = JourneyBookingPaymentEntity.cloneDate(at);

    this.touch();
  }

  public clearCapturedAt(): void {
    if (this.props.capturedAt === undefined) {
      return;
    }

    this.props.capturedAt = undefined;

    this.touch();
  }

  public hasBeenCaptured(): boolean {
    return this.props.capturedAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Failed
  // ---------------------------------------------------------------------------

  public get failedAt(): Date | undefined {
    return this.props.failedAt !== undefined
      ? JourneyBookingPaymentEntity.cloneDate(this.props.failedAt)
      : undefined;
  }

  public setFailedAt(at: Date): void {
    this.props.failedAt = JourneyBookingPaymentEntity.cloneDate(at);

    this.touch();
  }

  public clearFailedAt(): void {
    if (this.props.failedAt === undefined) {
      return;
    }

    this.props.failedAt = undefined;

    this.touch();
  }

  public hasFailed(): boolean {
    return this.props.failedAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Refunded
  // ---------------------------------------------------------------------------

  public get refundedAt(): Date | undefined {
    return this.props.refundedAt !== undefined
      ? JourneyBookingPaymentEntity.cloneDate(this.props.refundedAt)
      : undefined;
  }

  public setRefundedAt(at: Date): void {
    this.props.refundedAt = JourneyBookingPaymentEntity.cloneDate(at);

    this.touch();
  }

  public clearRefundedAt(): void {
    if (this.props.refundedAt === undefined) {
      return;
    }

    this.props.refundedAt = undefined;

    this.touch();
  }

  public hasBeenRefunded(): boolean {
    return this.props.refundedAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Failure Reason
  // ---------------------------------------------------------------------------

  public get failureReason(): JourneyBookingPaymentFailureReason | undefined {
    return this.props.failureReason;
  }

  public setFailureReason(
    failureReason: JourneyBookingPaymentFailureReason,
  ): void {
    this.props.failureReason = failureReason;

    this.touch();
  }

  public clearFailureReason(): void {
    if (this.props.failureReason === undefined) {
      return;
    }

    this.props.failureReason = undefined;

    this.touch();
  }

  public hasFailureReason(): boolean {
    return this.props.failureReason !== undefined;
  }

  // ---------------------------------------------------------------------------
  // State Queries
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.status.isPending();
  }

  public isAuthorized(): boolean {
    return this.status.isAuthorized();
  }

  public isCaptured(): boolean {
    return this.status.isCaptured();
  }

  public isFailed(): boolean {
    return this.status.isFailed();
  }

  public isRefunded(): boolean {
    return this.status.isRefunded();
  }

  public isPartiallyRefunded(): boolean {
    return this.status.isPartiallyRefunded();
  }

  public isSuccessful(): boolean {
    return this.isCaptured() || this.isPartiallyRefunded();
  }

  // ---------------------------------------------------------------------------
  // Payment State
  // ---------------------------------------------------------------------------

  public hasAuthorization(): boolean {
    return (
      this.isAuthorized() ||
      this.isCaptured() ||
      this.isRefunded() ||
      this.isPartiallyRefunded()
    );
  }

  public hasCapture(): boolean {
    return this.isCaptured() || this.isRefunded() || this.isPartiallyRefunded();
  }

  public canBeCaptured(): boolean {
    return this.isAuthorized();
  }

  public canBeRefunded(): boolean {
    return this.isCaptured() || this.isPartiallyRefunded();
  }

  public canBeFailed(): boolean {
    return this.isPending() || this.isAuthorized();
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * A failed payment must have both a failure
   * timestamp and a failure reason.
   */
  public hasRequiredFailureInformation(): boolean {
    if (!this.isFailed()) {
      return true;
    }

    return (
      this.props.failedAt !== undefined &&
      this.props.failureReason !== undefined
    );
  }

  /**
   * A payment that has progressed beyond PENDING
   * should have a transaction reference.
   */
  public hasRequiredTransactionReference(): boolean {
    if (this.isPending()) {
      return true;
    }

    return this.hasTransaction();
  }

  /**
   * Determines whether the payment entity contains
   * the minimum information required by the aggregate.
   */
  public isComplete(): boolean {
    return (
      this.hasRequiredFailureInformation() &&
      this.hasRequiredTransactionReference()
    );
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return JourneyBookingPaymentEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyBookingPaymentEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyBookingPaymentEntity.cloneDate(updatedAt);
  }

  /**
   * Updates the entity modification timestamp.
   *
   * Public visibility is intentional because the
   * foundation Entity contract exposes touch().
   */
  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyBookingPaymentEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneyBookingPaymentEntity): boolean {
    return other !== undefined && this.id.equals(other.id);
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

export type { JourneyBookingPaymentProps };

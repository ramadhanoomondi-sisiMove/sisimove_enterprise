// src/domains/booking/domain/aggregates/journey-booking.aggregate.ts

// -----------------------------------------------------------------------------
// Journey Booking Aggregate
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyBookingEntity } from '../entities/journey-booking.entity';
import type { JourneyBookingSnapshotEntity } from '../entities/journey-booking-snapshot.entity';
import type { JourneyBookingPricingEntity } from '../entities/journey-booking-pricing.entity';
import type { JourneyBookingPaymentEntity } from '../entities/journey-booking-payment.entity';
import type { JourneyBookingCancellationEntity } from '../entities/journey-booking-cancellation.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import {
  JourneyBookingCreatedEvent,
  JourneyBookingConfirmedEvent,
  JourneyBookingCancelledEvent,
  JourneyBookingCompletedEvent,
  JourneyBookingExpiredEvent,
  JourneyBookingSnapshotCreatedEvent,
  JourneyBookingPricingSetEvent,
  JourneyBookingPaymentAuthorizedEvent,
  JourneyBookingPaymentCapturedEvent,
  JourneyBookingPaymentFailedEvent,
  JourneyBookingPaymentRefundedEvent,
  JourneyBookingPaymentPartiallyRefundedEvent,
} from '../events';

import type { JourneyBookingDomainEvent } from '../events';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import {
  JourneyBookingInvariantException,
  JourneyBookingInvalidStatusTransitionException,
  JourneyBookingAlreadyConfirmedException,
  JourneyBookingAlreadyCancelledException,
  JourneyBookingAlreadyCompletedException,
  JourneyBookingAlreadyExpiredException,
  JourneyBookingSnapshotRequiredException,
  JourneyBookingPricingRequiredException,
  JourneyBookingPaymentRequiredException,
  JourneyBookingPaymentInvalidTransitionException,
  JourneyBookingPaymentFailedException,
  JourneyBookingPaymentNotAuthorizedException,
  JourneyBookingPaymentNotCapturedException,
  JourneyBookingPaymentAlreadyRefundedException,
  JourneyBookingCancellationRequiredException,
  JourneyBookingCancellationNotAllowedException,
} from '../exceptions';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBookingCancellationReason } from '../value-objects';

import {
  JourneyBookingStatus,
  JourneyBookingPaymentStatus,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

/**
 * Aggregate root for a passenger booking a Journey.
 *
 * Aggregate boundary:
 *
 * JourneyBookingAggregate
 * └── JourneyBookingEntity
 *     ├── JourneyBookingSnapshotEntity?
 *     ├── JourneyBookingPricingEntity?
 *     ├── JourneyBookingPaymentEntity?
 *     └── JourneyBookingCancellationEntity?
 *
 * JourneyBookingEntity remains the canonical aggregate state holder.
 *
 * External bounded contexts are represented only through public identifiers:
 *
 * - Journey
 * - Passenger / Identity
 * - Financial Transaction
 *
 * The aggregate owns booking lifecycle and booking-local payment state.
 * Actual payment processing remains outside this bounded context.
 */
export class JourneyBookingAggregate extends AggregateRoot<JourneyBookingEntity> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(booking: JourneyBookingEntity, id?: UniqueEntityId) {
    super(booking, id);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(
    booking: JourneyBookingEntity,
    correlationId: string,
    causationId?: string,
  ): JourneyBookingAggregate {
    const aggregate = new JourneyBookingAggregate(booking, booking.id);

    aggregate.recordCreated(correlationId, causationId);

    return aggregate;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    booking: JourneyBookingEntity,
    snapshot?: JourneyBookingSnapshotEntity,
    pricing?: JourneyBookingPricingEntity,
    payment?: JourneyBookingPaymentEntity,
    cancellation?: JourneyBookingCancellationEntity,
  ): JourneyBookingAggregate {
    const aggregate = new JourneyBookingAggregate(booking, booking.id);

    if (snapshot !== undefined) {
      booking.setSnapshot(snapshot);
    }

    if (pricing !== undefined) {
      booking.setPricing(pricing);
    }

    if (payment !== undefined) {
      booking.setPayment(payment);
    }

    if (cancellation !== undefined) {
      booking.setCancellation(cancellation);
    }

    return aggregate;
  }

  // ===========================================================================
  // Aggregate Identity
  // ===========================================================================

  public get journeyBooking(): JourneyBookingEntity {
    return this.props;
  }

  public get booking(): JourneyBookingEntity {
    return this.props;
  }

  public get aggregateId(): UniqueEntityId {
    return this.id;
  }

  // ===========================================================================
  // Booking References
  // ===========================================================================

  public get journeyPublicId(): JourneyBookingEntity['journeyPublicId'] {
    return this.journeyBooking.journeyPublicId;
  }

  public get passengerPublicId(): JourneyBookingEntity['passengerPublicId'] {
    return this.journeyBooking.passengerPublicId;
  }

  public belongsToJourney(
    journeyPublicId: JourneyBookingEntity['journeyPublicId'],
  ): boolean {
    return this.journeyBooking.journeyPublicId.equals(journeyPublicId);
  }

  public belongsToPassenger(
    passengerPublicId: JourneyBookingEntity['passengerPublicId'],
  ): boolean {
    return this.journeyBooking.passengerPublicId.equals(passengerPublicId);
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  public get status(): JourneyBookingStatus {
    return this.journeyBooking.status;
  }

  public get seats(): JourneyBookingEntity['seats'] {
    return this.journeyBooking.seats;
  }

  public get confirmedAt(): Date | undefined {
    return this.journeyBooking.confirmedAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.journeyBooking.cancelledAt;
  }

  public get completedAt(): Date | undefined {
    return this.journeyBooking.completedAt;
  }

  public get expiredAt(): Date | undefined {
    return this.journeyBooking.expiredAt;
  }

  public get version(): number {
    return this.journeyBooking.version;
  }

  // ===========================================================================
  // Components
  // ===========================================================================

  public get snapshot(): JourneyBookingSnapshotEntity | undefined {
    return this.journeyBooking.snapshot;
  }

  public get pricing(): JourneyBookingPricingEntity | undefined {
    return this.journeyBooking.pricing;
  }

  public get payment(): JourneyBookingPaymentEntity | undefined {
    return this.journeyBooking.payment;
  }

  public get cancellation(): JourneyBookingCancellationEntity | undefined {
    return this.journeyBooking.cancellation;
  }

  // ===========================================================================
  // Booking Lifecycle
  // ===========================================================================

  public confirm(
    correlationId: string,
    causationId?: string,
    confirmedAt: Date = new Date(),
  ): void {
    if (this.isConfirmed()) {
      throw new JourneyBookingAlreadyConfirmedException();
    }

    if (!this.isPending()) {
      throw new JourneyBookingInvalidStatusTransitionException(
        this.journeyBooking.status.value,
        'CONFIRMED',
      );
    }

    if (!this.hasSnapshot()) {
      throw new JourneyBookingSnapshotRequiredException();
    }

    if (!this.hasPricing()) {
      throw new JourneyBookingPricingRequiredException();
    }

    if (!this.hasPayment()) {
      throw new JourneyBookingPaymentRequiredException();
    }

    if (!this.hasPaymentInformation()) {
      throw new JourneyBookingPaymentRequiredException();
    }

    if (!this.journeyBooking.canBeConfirmed()) {
      throw new JourneyBookingInvalidStatusTransitionException(
        this.journeyBooking.status.value,
        'CONFIRMED',
      );
    }

    this.journeyBooking.setStatus(JourneyBookingStatus.confirmed());
    this.journeyBooking.setConfirmedAt(confirmedAt);
    this.journeyBooking.setUpdatedAt(confirmedAt);
    this.journeyBooking.incrementVersion();

    this.addDomainEvent(
      new JourneyBookingConfirmedEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        this.seats.value,
        confirmedAt,
        correlationId,
        causationId,
      ),
    );
  }

  public cancel(
    reason: JourneyBookingCancellationReason,
    cancelledByPublicId: string | undefined,
    reasonDescription: string | undefined,
    correlationId: string,
    causationId?: string,
    cancelledAt: Date = new Date(),
  ): void {
    if (this.isCancelled()) {
      throw new JourneyBookingAlreadyCancelledException();
    }

    if (!this.canCancel()) {
      throw new JourneyBookingCancellationNotAllowedException();
    }

    if (!this.isValidCancellationRequest()) {
      throw new JourneyBookingCancellationRequiredException();
    }

    this.journeyBooking.setStatus(JourneyBookingStatus.cancelled());

    this.journeyBooking.setCancelledAt(cancelledAt);
    this.journeyBooking.setUpdatedAt(cancelledAt);
    this.journeyBooking.incrementVersion();

    this.addDomainEvent(
      new JourneyBookingCancelledEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        reason.value,
        cancelledByPublicId,
        cancelledAt,
        reasonDescription,
        correlationId,
        causationId,
      ),
    );
  }

  public complete(
    correlationId: string,
    causationId?: string,
    completedAt: Date = new Date(),
  ): void {
    if (this.isCompleted()) {
      throw new JourneyBookingAlreadyCompletedException();
    }

    if (!this.isConfirmed()) {
      throw new JourneyBookingInvalidStatusTransitionException(
        this.journeyBooking.status.value,
        'COMPLETED',
      );
    }

    if (!this.journeyBooking.canBeCompleted()) {
      throw new JourneyBookingInvalidStatusTransitionException(
        this.journeyBooking.status.value,
        'COMPLETED',
      );
    }

    this.journeyBooking.setStatus(JourneyBookingStatus.completed());

    this.journeyBooking.setCompletedAt(completedAt);
    this.journeyBooking.setUpdatedAt(completedAt);
    this.journeyBooking.incrementVersion();

    this.addDomainEvent(
      new JourneyBookingCompletedEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        completedAt,
        correlationId,
        causationId,
      ),
    );
  }

  public expire(
    correlationId: string,
    causationId?: string,
    expiredAt: Date = new Date(),
  ): void {
    if (this.isExpired()) {
      throw new JourneyBookingAlreadyExpiredException();
    }

    if (!this.isPending()) {
      throw new JourneyBookingInvalidStatusTransitionException(
        this.journeyBooking.status.value,
        'EXPIRED',
      );
    }

    if (!this.journeyBooking.canBeExpired()) {
      throw new JourneyBookingInvalidStatusTransitionException(
        this.journeyBooking.status.value,
        'EXPIRED',
      );
    }

    this.journeyBooking.setStatus(JourneyBookingStatus.expired());

    this.journeyBooking.setExpiredAt(expiredAt);
    this.journeyBooking.setUpdatedAt(expiredAt);
    this.journeyBooking.incrementVersion();

    this.addDomainEvent(
      new JourneyBookingExpiredEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        expiredAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isPending(): boolean {
    return this.journeyBooking.status.isPending();
  }

  public isConfirmed(): boolean {
    return this.journeyBooking.status.isConfirmed();
  }

  public isCancelled(): boolean {
    return this.journeyBooking.status.isCancelled();
  }

  public isCompleted(): boolean {
    return this.journeyBooking.status.isCompleted();
  }

  public isExpired(): boolean {
    return this.journeyBooking.status.isExpired();
  }

  public isActive(): boolean {
    return this.isPending() || this.isConfirmed();
  }

  public isTerminal(): boolean {
    return this.isCancelled() || this.isCompleted() || this.isExpired();
  }

  // ===========================================================================
  // Lifecycle Capabilities
  // ===========================================================================

  public canConfirm(): boolean {
    return (
      this.isPending() &&
      this.hasRequiredComponents() &&
      this.hasPaymentInformation()
    );
  }

  public canCancel(): boolean {
    return !this.isTerminal();
  }

  public canComplete(): boolean {
    return this.isConfirmed();
  }

  public canExpire(): boolean {
    return this.isPending();
  }

  // ===========================================================================
  // Snapshot
  // ===========================================================================

  public attachSnapshot(
    snapshot: JourneyBookingSnapshotEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    if (!snapshot) {
      throw new JourneyBookingSnapshotRequiredException();
    }

    this.journeyBooking.setSnapshot(snapshot);
    this.journeyBooking.setUpdatedAt(new Date());
    this.journeyBooking.incrementVersion();

    this.addDomainEvent(
      new JourneyBookingSnapshotCreatedEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        snapshot.publicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  public removeSnapshot(): void {
    if (!this.hasSnapshot()) {
      return;
    }

    this.journeyBooking.clearSnapshot();
    this.journeyBooking.setUpdatedAt(new Date());
    this.journeyBooking.incrementVersion();
  }

  public hasSnapshot(): boolean {
    return this.journeyBooking.snapshot !== undefined;
  }

  public get snapshotId():
    JourneyBookingSnapshotEntity['publicId'] | undefined {
    return this.snapshot?.publicId;
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  public attachPricing(
    pricing: JourneyBookingPricingEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    if (!pricing) {
      throw new JourneyBookingPricingRequiredException();
    }

    this.journeyBooking.setPricing(pricing);
    this.journeyBooking.setUpdatedAt(new Date());
    this.journeyBooking.incrementVersion();

    this.addDomainEvent(
      new JourneyBookingPricingSetEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        pricing.publicId.value,
        pricing.seats.value,
        pricing.totalAmount.value,
        pricing.currency.value,
        correlationId,
        causationId,
      ),
    );
  }

  public clearPricing(): void {
    if (!this.hasPricing()) {
      return;
    }

    this.journeyBooking.clearPricing();
    this.journeyBooking.setUpdatedAt(new Date());
    this.journeyBooking.incrementVersion();
  }

  public hasPricing(): boolean {
    return this.journeyBooking.pricing !== undefined;
  }

  public get pricingId(): JourneyBookingPricingEntity['publicId'] | undefined {
    return this.pricing?.publicId;
  }

  // ===========================================================================
  // Payment
  // ===========================================================================

  public attachPayment(payment: JourneyBookingPaymentEntity): void {
    if (!payment) {
      throw new JourneyBookingPaymentRequiredException();
    }

    this.journeyBooking.setPayment(payment);
  }

  public removePayment(): void {
    if (!this.hasPayment()) {
      return;
    }

    this.journeyBooking.clearPayment();
    this.journeyBooking.setUpdatedAt(new Date());
    this.journeyBooking.incrementVersion();
  }

  public hasPayment(): boolean {
    return this.journeyBooking.payment !== undefined;
  }

  public get paymentId(): JourneyBookingPaymentEntity['publicId'] | undefined {
    return this.payment?.publicId;
  }

  // ===========================================================================
  // Payment Queries
  // ===========================================================================

  public isPaymentPending(): boolean {
    return this.payment?.status.isPending() ?? false;
  }

  public isPaymentAuthorized(): boolean {
    return this.payment?.status.isAuthorized() ?? false;
  }

  public isPaymentCaptured(): boolean {
    return this.payment?.status.isCaptured() ?? false;
  }

  public isPaymentFailed(): boolean {
    return this.payment?.status.isFailed() ?? false;
  }

  public isPaymentRefunded(): boolean {
    return this.payment?.status.isRefunded() ?? false;
  }

  public isPaymentPartiallyRefunded(): boolean {
    return this.payment?.status.isPartiallyRefunded() ?? false;
  }

  public hasPaymentTransaction(): boolean {
    return this.payment?.hasTransaction() ?? false;
  }

  public hasPaymentAuthorization(): boolean {
    return this.payment?.hasAuthorization() ?? false;
  }

  public hasPaymentCapture(): boolean {
    return this.payment?.hasCapture() ?? false;
  }

  // ===========================================================================
  // Payment Authorization
  // ===========================================================================

  public authorizePayment(
    transactionPublicId: NonNullable<
      JourneyBookingPaymentEntity['transactionPublicId']
    >,
    correlationId: string,
    causationId?: string,
    authorizedAt: Date = new Date(),
  ): void {
    const payment = this.requirePayment();

    if (payment.isFailed()) {
      throw new JourneyBookingPaymentFailedException();
    }

    if (!payment.isPending()) {
      throw new JourneyBookingPaymentInvalidTransitionException(
        payment.status.value,
        'AUTHORIZED',
      );
    }

    payment.setTransactionPublicId(transactionPublicId);
    payment.setStatus(JourneyBookingPaymentStatus.authorized());
    payment.setAuthorizedAt(authorizedAt);

    this.journeyBooking.setUpdatedAt(authorizedAt);
    this.journeyBooking.incrementVersion();

    this.addDomainEvent(
      new JourneyBookingPaymentAuthorizedEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        payment.publicId.value,
        transactionPublicId.value,
        payment.amount.value,
        payment.currency.value,
        authorizedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Payment Capture
  // ===========================================================================

  public capturePayment(
    correlationId: string,
    causationId?: string,
    capturedAt: Date = new Date(),
  ): void {
    const payment = this.requirePayment();

    if (payment.isFailed()) {
      throw new JourneyBookingPaymentFailedException();
    }

    if (!payment.isAuthorized()) {
      throw new JourneyBookingPaymentNotAuthorizedException();
    }

    if (!payment.canBeCaptured()) {
      throw new JourneyBookingPaymentInvalidTransitionException(
        payment.status.value,
        'CAPTURED',
      );
    }

    const transactionPublicId = payment.transactionPublicId;

    if (transactionPublicId === undefined) {
      throw new JourneyBookingPaymentInvalidTransitionException(
        payment.status.value,
        'CAPTURED',
      );
    }

    payment.setStatus(JourneyBookingPaymentStatus.captured());
    payment.setCapturedAt(capturedAt);

    this.journeyBooking.setUpdatedAt(capturedAt);
    this.journeyBooking.incrementVersion();

    this.addDomainEvent(
      new JourneyBookingPaymentCapturedEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        payment.publicId.value,
        transactionPublicId.value,
        payment.amount.value,
        payment.currency.value,
        capturedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Payment Failure
  // ===========================================================================
  public failPayment(
    failureReason: NonNullable<JourneyBookingPaymentEntity['failureReason']>,
    correlationId: string,
    causationId?: string,
    failedAt: Date = new Date(),
  ): void {
    const payment = this.requirePayment();

    if (!payment.canBeFailed()) {
      throw new JourneyBookingPaymentInvalidTransitionException(
        payment.status.value,
        'FAILED',
      );
    }

    payment.setStatus(JourneyBookingPaymentStatus.failed());
    payment.setFailureReason(failureReason);
    payment.setFailedAt(failedAt);

    this.journeyBooking.setUpdatedAt(failedAt);
    this.journeyBooking.incrementVersion();

    this.addDomainEvent(
      new JourneyBookingPaymentFailedEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        payment.publicId.value,
        payment.amount.value,
        payment.currency.value,
        failureReason.value,
        failedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Full Payment Refund
  // ===========================================================================

  public refundPayment(
    correlationId: string,
    causationId?: string,
    refundedAt: Date = new Date(),
  ): void {
    const payment = this.requirePayment();

    if (payment.isRefunded()) {
      throw new JourneyBookingPaymentAlreadyRefundedException();
    }

    if (!payment.isCaptured()) {
      throw new JourneyBookingPaymentInvalidTransitionException(
        payment.status.value,
        'REFUNDED',
      );
    }

    const transactionPublicId = payment.transactionPublicId;

    if (transactionPublicId === undefined) {
      throw new JourneyBookingPaymentInvalidTransitionException(
        payment.status.value,
        'REFUNDED',
      );
    }

    payment.setStatus(JourneyBookingPaymentStatus.refunded());
    payment.setRefundedAt(refundedAt);

    this.journeyBooking.setUpdatedAt(refundedAt);
    this.journeyBooking.incrementVersion();

    this.addDomainEvent(
      new JourneyBookingPaymentRefundedEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        payment.publicId.value,
        transactionPublicId.value,
        payment.amount.value,
        payment.currency.value,
        refundedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Partial Payment Refund
  // ===========================================================================

  public partiallyRefundPayment(
    refundedAmount: number,
    remainingAmount: number,
    correlationId: string,
    causationId?: string,
    refundedAt: Date = new Date(),
  ): void {
    const payment = this.requirePayment();

    if (payment.isRefunded()) {
      throw new JourneyBookingPaymentAlreadyRefundedException();
    }

    if (!payment.canBeRefunded()) {
      throw new JourneyBookingPaymentNotCapturedException();
    }

    if (refundedAmount <= 0 || remainingAmount < 0) {
      throw new JourneyBookingInvariantException(
        'Refunded amount and remaining amount must be valid positive values.',
      );
    }

    const transactionPublicId = payment.transactionPublicId;

    if (transactionPublicId === undefined) {
      throw new JourneyBookingPaymentInvalidTransitionException(
        payment.status.value,
        'PARTIALLY_REFUNDED',
      );
    }

    payment.setStatus(JourneyBookingPaymentStatus.partiallyRefunded());
    payment.setRefundedAt(refundedAt);

    this.journeyBooking.setUpdatedAt(refundedAt);
    this.journeyBooking.incrementVersion();

    this.addDomainEvent(
      new JourneyBookingPaymentPartiallyRefundedEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        payment.publicId.value,
        transactionPublicId.value,
        refundedAmount,
        remainingAmount,
        payment.currency.value,
        refundedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  public attachCancellation(
    cancellation: JourneyBookingCancellationEntity,
  ): void {
    if (!cancellation) {
      throw new JourneyBookingCancellationRequiredException();
    }

    this.journeyBooking.setCancellation(cancellation);
  }

  public removeCancellation(): void {
    if (!this.hasCancellation()) {
      return;
    }

    this.journeyBooking.clearCancellation();
    this.journeyBooking.setUpdatedAt(new Date());
    this.journeyBooking.incrementVersion();
  }

  public hasCancellation(): boolean {
    return this.journeyBooking.cancellation !== undefined;
  }

  public get cancellationId():
    JourneyBookingCancellationEntity['publicId'] | undefined {
    return this.cancellation?.publicId;
  }

  public hasCancellationInformation(): boolean {
    return this.cancellation?.isComplete() ?? false;
  }

  // ===========================================================================
  // Aggregate Invariants
  // ===========================================================================

  public hasRequiredComponents(): boolean {
    return this.hasSnapshot() && this.hasPricing();
  }

  public hasPaymentInformation(): boolean {
    return this.payment?.isComplete() ?? false;
  }

  public isComplete(): boolean {
    return this.journeyBooking.isComplete();
  }

  public hasConsistentLifecycle(): boolean {
    return this.journeyBooking.hasConsistentLifecycle();
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  private requirePayment(): JourneyBookingPaymentEntity {
    const payment = this.payment;

    if (payment === undefined) {
      throw new JourneyBookingPaymentRequiredException();
    }

    return payment;
  }

  private isValidCancellationRequest(): boolean {
    return this.cancellation !== undefined;
  }

  // ===========================================================================
  // Domain Event Recording
  // ===========================================================================

  public recordDomainEvent(event: JourneyBookingDomainEvent): void {
    this.addDomainEvent(event);
  }

  // ===========================================================================
  // Created Event
  // ===========================================================================

  private recordCreated(correlationId: string, causationId?: string): void {
    this.addDomainEvent(
      new JourneyBookingCreatedEvent(
        this.id.toString(),
        this.journeyBooking.publicId.value,
        this.journeyPublicId.value,
        this.passengerPublicId.value,
        this.seats.value,
        correlationId,
        causationId,
      ),
    );
  }
}

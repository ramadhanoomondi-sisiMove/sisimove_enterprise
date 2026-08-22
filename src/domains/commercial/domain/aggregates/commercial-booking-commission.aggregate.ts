// -----------------------------------------------------------------------------
// Commercial Booking Commission Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate root for a Commercial Booking Commission.
//
// A Commercial Booking Commission represents the platform commission assessed
// against a Booking.
//
// Aggregate boundary:
//
//   CommercialBookingCommissionAggregate
//              │
//              └── CommercialBookingCommissionEntity
//
// The aggregate owns:
//
// - booking commission lifecycle
// - commission assessment
// - commission cancellation
// - domain event recording
//
// The aggregate does NOT own:
//
// - Booking
// - Journey
// - Commercial Commission Rule
// - Wallet
// - Settlement
// - Accounting
// - Identity
//
// Those concepts belong to other bounded contexts or independent Commercial
// aggregates and are represented through public identifiers.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionEntity } from '../entities/commercial-booking-commission.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionAssessedEvent } from '../events/commercial-booking-commission-assessed.event';

import { CommercialBookingCommissionCancelledEvent } from '../events/commercial-booking-commission-cancelled.event';

import { CommercialBookingCommissionCreatedEvent } from '../events/commercial-booking-commission-created.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionAlreadyAssessedException } from '../exceptions/commercial-booking-commission-already-assessed.exception';

import { CommercialBookingCommissionAlreadyCancelledException } from '../exceptions/commercial-booking-commission-already-cancelled.exception';

import { CommercialBookingCommissionCannotAssessException } from '../exceptions/commercial-booking-commission-cannot-assess.exception';

import { CommercialBookingCommissionCannotCancelException } from '../exceptions/commercial-booking-commission-cannot-cancel.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionStatus } from '../value-objects/commercial-booking-commission-status.vo';

// -----------------------------------------------------------------------------
// Aggregate Props
// -----------------------------------------------------------------------------

interface CommercialBookingCommissionAggregateProps {
  bookingCommission: CommercialBookingCommissionEntity;
}

// -----------------------------------------------------------------------------
// Aggregate Root
// -----------------------------------------------------------------------------

/**
 * Aggregate root for a Commercial Booking Commission.
 *
 * A Commercial Booking Commission represents the platform commission assessed
 * against a Booking.
 *
 * The booking commission is the consistency boundary.
 *
 * The aggregate owns the booking commission entity and coordinates:
 *
 * - aggregate creation;
 * - commission assessment;
 * - commission cancellation;
 * - domain event recording.
 *
 * The aggregate does not own:
 *
 * - Booking;
 * - Journey;
 * - Commercial Commission Rule;
 * - Identity;
 * - Wallet;
 * - Settlement;
 * - Treasury;
 * - Accounting.
 *
 * Those concepts belong to other bounded contexts or independent Commercial
 * aggregates and are represented here through their public identifiers.
 *
 * The commission rule reference identifies the commercial policy used to
 * produce the assessment. The percentage and monetary values are snapshots
 * stored on the booking commission entity and therefore remain historically
 * stable even when the underlying commercial rule changes.
 */
export class CommercialBookingCommissionAggregate extends AggregateRoot<CommercialBookingCommissionAggregateProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(props: CommercialBookingCommissionAggregateProps) {
    super(props);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Commercial Booking Commission aggregate.
   *
   * The supplied entity is expected to have already been created and validated
   * by the Commercial Booking Commission entity factory.
   *
   * Creation records a CommercialBookingCommissionCreatedEvent containing the
   * complete commercial assessment snapshot.
   */
  public static create(
    bookingCommission: CommercialBookingCommissionEntity,
    correlationId: string,
  ): CommercialBookingCommissionAggregate {
    const aggregate = new CommercialBookingCommissionAggregate({
      bookingCommission,
    });

    aggregate.addDomainEvent(
      new CommercialBookingCommissionCreatedEvent(
        aggregate.id.value,
        aggregate.publicId.value,
        aggregate.bookingPublicId,
        aggregate.journeyPublicId,
        aggregate.commissionRulePublicId,
        aggregate.percentage,
        aggregate.baseAmount,
        aggregate.commissionAmount,
        aggregate.currency,
        aggregate.status.value,
        correlationId,
      ),
    );

    return aggregate;
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Rehydrates an existing Commercial Booking Commission aggregate.
   *
   * Rehydration restores persisted state and does not emit domain events.
   */
  public static rehydrate(
    bookingCommission: CommercialBookingCommissionEntity,
  ): CommercialBookingCommissionAggregate {
    return new CommercialBookingCommissionAggregate({
      bookingCommission,
    });
  }

  // ---------------------------------------------------------------------------
  // Aggregate State
  // ---------------------------------------------------------------------------

  /**
   * Returns the Commercial Booking Commission entity owned by this aggregate.
   */
  public get bookingCommission(): CommercialBookingCommissionEntity {
    return this.props.bookingCommission;
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Returns the aggregate's internal identity.
   *
   * The identity is owned by the underlying booking commission entity.
   */
  public override get id() {
    return this.bookingCommission.id;
  }

  /**
   * Returns the aggregate's public identity.
   *
   * The public identity is owned by the underlying booking commission entity.
   */
  public override get publicId() {
    return this.bookingCommission.publicId;
  }

  // ---------------------------------------------------------------------------
  // Commercial Policy Reference
  // ---------------------------------------------------------------------------

  /**
   * Returns the Commercial Commission Rule used to produce this assessment.
   *
   * This is a cross-aggregate reference represented by public identity.
   */
  public get commissionRulePublicId(): string {
    return this.bookingCommission.commissionRulePublicId.value;
  }

  // ---------------------------------------------------------------------------
  // Booking Reference
  // ---------------------------------------------------------------------------

  /**
   * Returns the Booking associated with this commission.
   *
   * Booking belongs to another bounded context and is represented only by its
   * public identity.
   */
  public get bookingPublicId(): string {
    return this.bookingCommission.bookingPublicId.value;
  }

  // ---------------------------------------------------------------------------
  // Journey Reference
  // ---------------------------------------------------------------------------

  /**
   * Returns the Journey associated with this commission.
   *
   * Journey belongs to another bounded context and is represented only by its
   * public identity.
   */
  public get journeyPublicId(): string {
    return this.bookingCommission.journeyPublicId.value;
  }

  // ---------------------------------------------------------------------------
  // Commission Assessment Snapshot
  // ---------------------------------------------------------------------------

  /**
   * Commission percentage captured when this assessment was created.
   *
   * The value is a historical snapshot and does not change when the underlying
   * Commercial Commission Rule changes.
   */
  public get percentage(): string {
    return this.bookingCommission.percentage.value.toString();
  }

  /**
   * Booking amount against which the commission was assessed.
   *
   * This is the historical assessment base amount.
   */
  public get baseAmount(): number {
    return this.bookingCommission.baseAmount.value;
  }

  /**
   * Commission amount assessed against the Booking.
   *
   * This is a persisted historical snapshot and is not recalculated by the
   * aggregate lifecycle methods.
   */
  public get commissionAmount(): number {
    return this.bookingCommission.commissionAmount.value;
  }

  /**
   * Currency in which the commission assessment was made.
   */
  public get currency(): string {
    return this.bookingCommission.currency.value;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle State
  // ---------------------------------------------------------------------------

  /**
   * Current booking commission lifecycle status.
   */
  public get status(): CommercialBookingCommissionStatus {
    return this.bookingCommission.status;
  }

  /**
   * Timestamp at which the commission was assessed.
   */
  public get assessedAt(): Date | undefined {
    return this.bookingCommission.assessedAt;
  }

  /**
   * Timestamp at which the commission was cancelled.
   */
  public get cancelledAt(): Date | undefined {
    return this.bookingCommission.cancelledAt;
  }

  /**
   * Aggregate creation timestamp.
   */
  public get createdAt(): Date {
    return this.bookingCommission.createdAt;
  }

  /**
   * Aggregate last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.bookingCommission.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Queries
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the commission is pending assessment.
   */
  public isPending(): boolean {
    return this.bookingCommission.isPending();
  }

  /**
   * Indicates whether the commission has been assessed.
   */
  public isAssessed(): boolean {
    return this.bookingCommission.isAssessed();
  }

  /**
   * Indicates whether the commission has been cancelled.
   */
  public isCancelled(): boolean {
    return this.bookingCommission.isCancelled();
  }

  /**
   * Indicates whether the commission is currently active in the commercial
   * assessment workflow.
   *
   * Only PENDING commissions are considered active.
   */
  public isActive(): boolean {
    return this.bookingCommission.isActive();
  }

  /**
   * Indicates whether the commission has reached a terminal state.
   *
   * Both ASSESSED and CANCELLED are terminal states according to the current
   * booking commission lifecycle.
   */
  public isTerminal(): boolean {
    return this.bookingCommission.isTerminal();
  }

  /**
   * Indicates whether the commission can currently be assessed.
   */
  public canAssess(): boolean {
    return this.bookingCommission.canAssess();
  }

  /**
   * Indicates whether the commission can currently be cancelled.
   */
  public canCancel(): boolean {
    return this.bookingCommission.canCancel();
  }

  /**
   * Indicates whether assessment has occurred at any point.
   */
  public hasBeenAssessed(): boolean {
    return this.bookingCommission.hasBeenAssessed();
  }

  /**
   * Indicates whether cancellation has occurred at any point.
   */
  public hasBeenCancelled(): boolean {
    return this.bookingCommission.hasBeenCancelled();
  }

  // ---------------------------------------------------------------------------
  // Commission Assessment
  // ---------------------------------------------------------------------------

  /**
   * Assesses the booking commission.
   *
   * Assessment is valid only while the commission is pending.
   *
   * The entity performs the intrinsic lifecycle transition while the aggregate
   * records the resulting domain event.
   *
   * The commission percentage, base amount, and commission amount are not
   * recalculated here because they are immutable commercial assessment
   * snapshots.
   */
  public assess(assessedAt: Date, correlationId: string): void {
    if (this.isAssessed()) {
      throw new CommercialBookingCommissionAlreadyAssessedException();
    }

    if (!this.canAssess()) {
      throw new CommercialBookingCommissionCannotAssessException();
    }

    this.bookingCommission.assess(assessedAt);

    this.bookingCommission.setUpdatedAt(assessedAt);

    this.addDomainEvent(
      new CommercialBookingCommissionAssessedEvent(
        this.id.value,
        this.publicId.value,
        this.bookingPublicId,
        this.journeyPublicId,
        this.commissionRulePublicId,
        this.percentage,
        this.baseAmount,
        this.commissionAmount,
        this.currency,
        assessedAt,
        correlationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Commission Cancellation
  // ---------------------------------------------------------------------------

  /**
   * Cancels the booking commission.
   *
   * Cancellation is valid while the commission is PENDING or ASSESSED.
   *
   * If the commission was previously assessed, the entity preserves
   * assessedAt so the historical assessment fact remains available.
   *
   * The aggregate records a cancellation event after the intrinsic entity
   * transition succeeds.
   */
  public cancel(cancelledAt: Date, correlationId: string): void {
    if (this.isCancelled()) {
      throw new CommercialBookingCommissionAlreadyCancelledException();
    }

    if (!this.canCancel()) {
      throw new CommercialBookingCommissionCannotCancelException();
    }

    this.bookingCommission.cancel(cancelledAt);

    this.bookingCommission.setUpdatedAt(cancelledAt);

    this.addDomainEvent(
      new CommercialBookingCommissionCancelledEvent(
        this.id.value,
        this.publicId.value,
        this.bookingPublicId,
        this.journeyPublicId,
        this.commissionRulePublicId,
        this.percentage,
        this.baseAmount,
        this.commissionAmount,
        this.currency,
        cancelledAt,
        correlationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Updates the aggregate audit timestamp.
   *
   * This delegates the timestamp mutation to the owned entity.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.bookingCommission.setUpdatedAt(updatedAt);
  }
}

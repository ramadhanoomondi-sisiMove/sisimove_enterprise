// -----------------------------------------------------------------------------
// Journey Booking Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyBookingPublicId } from '../value-objects/journey-booking-public-id.vo';

import { JourneyBookingStatus } from '../value-objects/journey-booking-status.vo';

import type { JourneyPublicId } from '../value-objects/journey-public-id.vo';

import type { JourneyBookingPassengerPublicId } from '../value-objects/journey-booking-passenger-public-id.vo';

import type { JourneyBookingSeats } from '../value-objects/journey-booking-seats.vo';

// -----------------------------------------------------------------------------
// Child Entities
// -----------------------------------------------------------------------------

import type { JourneyBookingSnapshotEntity } from './journey-booking-snapshot.entity';

import type { JourneyBookingPricingEntity } from './journey-booking-pricing.entity';

import type { JourneyBookingPaymentEntity } from './journey-booking-payment.entity';

import type { JourneyBookingCancellationEntity } from './journey-booking-cancellation.entity';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyBookingProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: JourneyBookingPublicId;

  // ---------------------------------------------------------------------------
  // Cross-domain References
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey being booked.
   *
   * This is intentionally NOT a domain relation.
   */
  journeyPublicId: JourneyPublicId;

  /**
   * Public identity of the passenger making the booking.
   *
   * This is intentionally NOT a domain relation.
   */
  passengerPublicId: JourneyBookingPassengerPublicId;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  status: JourneyBookingStatus;

  seats: JourneyBookingSeats;

  // ---------------------------------------------------------------------------
  // Booking Components
  // ---------------------------------------------------------------------------

  /**
   * Historical journey and vehicle state captured at booking time.
   */
  snapshot?: JourneyBookingSnapshotEntity | undefined;

  /**
   * Historical pricing state captured at booking time.
   */
  pricing?: JourneyBookingPricingEntity | undefined;

  /**
   * Payment state belonging to the booking.
   */
  payment?: JourneyBookingPaymentEntity | undefined;

  /**
   * Cancellation record.
   *
   * Present only after the booking has been cancelled.
   */
  cancellation?: JourneyBookingCancellationEntity | undefined;

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  confirmedAt?: Date | undefined;

  cancelledAt?: Date | undefined;

  completedAt?: Date | undefined;

  expiredAt?: Date | undefined;

  // ---------------------------------------------------------------------------
  // Aggregate Version
  // ---------------------------------------------------------------------------

  version: number;

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
 * Root entity of the Journey Booking aggregate.
 *
 * A JourneyBooking represents a passenger's reservation against a Journey.
 *
 * The entity owns the booking lifecycle and its booking-specific components:
 *
 * - JourneyBookingSnapshot
 * - JourneyBookingPricing
 * - JourneyBookingPayment
 * - JourneyBookingCancellation
 *
 * Cross-domain references such as the Journey and passenger are represented
 * exclusively by public identity value objects and are intentionally not
 * modeled as domain relations.
 */
export class JourneyBookingEntity extends Entity<
  JourneyBookingProps,
  JourneyBookingPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneyBookingProps,
    id?: UniqueEntityId,
    publicId?: JourneyBookingPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyBookingPublicId | undefined;

    journeyPublicId: JourneyPublicId;

    passengerPublicId: JourneyBookingPassengerPublicId;

    status?: JourneyBookingStatus | undefined;

    seats: JourneyBookingSeats;

    snapshot?: JourneyBookingSnapshotEntity | undefined;

    pricing?: JourneyBookingPricingEntity | undefined;

    payment?: JourneyBookingPaymentEntity | undefined;

    cancellation?: JourneyBookingCancellationEntity | undefined;

    confirmedAt?: Date | undefined;

    cancelledAt?: Date | undefined;

    completedAt?: Date | undefined;

    expiredAt?: Date | undefined;

    version?: number | undefined;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): JourneyBookingEntity {
    const now = new Date();

    const version = props.version ?? 1;

    JourneyBookingEntity.assertVersion(version);

    const createdAt = JourneyBookingEntity.cloneDate(props.createdAt ?? now);

    const updatedAt = JourneyBookingEntity.cloneDate(props.updatedAt ?? now);

    return new JourneyBookingEntity({
      publicId: props.publicId ?? new JourneyBookingPublicId(),

      journeyPublicId: props.journeyPublicId,

      passengerPublicId: props.passengerPublicId,

      status: props.status ?? JourneyBookingStatus.pending(),

      seats: props.seats,

      ...(props.snapshot !== undefined
        ? {
            snapshot: props.snapshot,
          }
        : {}),

      ...(props.pricing !== undefined
        ? {
            pricing: props.pricing,
          }
        : {}),

      ...(props.payment !== undefined
        ? {
            payment: props.payment,
          }
        : {}),

      ...(props.cancellation !== undefined
        ? {
            cancellation: props.cancellation,
          }
        : {}),

      ...(props.confirmedAt !== undefined
        ? {
            confirmedAt: JourneyBookingEntity.cloneDate(props.confirmedAt),
          }
        : {}),

      ...(props.cancelledAt !== undefined
        ? {
            cancelledAt: JourneyBookingEntity.cloneDate(props.cancelledAt),
          }
        : {}),

      ...(props.completedAt !== undefined
        ? {
            completedAt: JourneyBookingEntity.cloneDate(props.completedAt),
          }
        : {}),

      ...(props.expiredAt !== undefined
        ? {
            expiredAt: JourneyBookingEntity.cloneDate(props.expiredAt),
          }
        : {}),

      version,

      createdAt,

      updatedAt,
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyBookingProps,
    id: UniqueEntityId,
    publicId: JourneyBookingPublicId,
  ): JourneyBookingEntity {
    JourneyBookingEntity.assertVersion(props.version);

    return new JourneyBookingEntity(
      {
        ...props,

        // Persistence public ID is authoritative during rehydration.
        publicId,

        ...(props.confirmedAt !== undefined
          ? {
              confirmedAt: JourneyBookingEntity.cloneDate(props.confirmedAt),
            }
          : {}),

        ...(props.cancelledAt !== undefined
          ? {
              cancelledAt: JourneyBookingEntity.cloneDate(props.cancelledAt),
            }
          : {}),

        ...(props.completedAt !== undefined
          ? {
              completedAt: JourneyBookingEntity.cloneDate(props.completedAt),
            }
          : {}),

        ...(props.expiredAt !== undefined
          ? {
              expiredAt: JourneyBookingEntity.cloneDate(props.expiredAt),
            }
          : {}),

        createdAt: JourneyBookingEntity.cloneDate(props.createdAt),

        updatedAt: JourneyBookingEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneyBookingPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Journey Reference
  // ---------------------------------------------------------------------------

  public get journeyPublicId(): JourneyPublicId {
    return this.props.journeyPublicId;
  }

  public setJourneyPublicId(journeyPublicId: JourneyPublicId): void {
    this.props.journeyPublicId = journeyPublicId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Passenger Reference
  // ---------------------------------------------------------------------------

  public get passengerPublicId(): JourneyBookingPassengerPublicId {
    return this.props.passengerPublicId;
  }

  public setPassengerPublicId(
    passengerPublicId: JourneyBookingPassengerPublicId,
  ): void {
    this.props.passengerPublicId = passengerPublicId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): JourneyBookingStatus {
    return this.props.status;
  }

  public setStatus(status: JourneyBookingStatus): void {
    this.props.status = status;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Seats
  // ---------------------------------------------------------------------------

  public get seats(): JourneyBookingSeats {
    return this.props.seats;
  }

  public setSeats(seats: JourneyBookingSeats): void {
    this.props.seats = seats;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Snapshot
  // ---------------------------------------------------------------------------

  public get snapshot(): JourneyBookingSnapshotEntity | undefined {
    return this.props.snapshot;
  }

  public setSnapshot(snapshot: JourneyBookingSnapshotEntity): void {
    this.props.snapshot = snapshot;
    this.touch();
  }

  public clearSnapshot(): void {
    if (this.props.snapshot === undefined) {
      return;
    }

    this.props.snapshot = undefined;
    this.touch();
  }

  public hasSnapshot(): boolean {
    return this.props.snapshot !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Pricing
  // ---------------------------------------------------------------------------

  public get pricing(): JourneyBookingPricingEntity | undefined {
    return this.props.pricing;
  }

  public setPricing(pricing: JourneyBookingPricingEntity): void {
    this.props.pricing = pricing;
    this.touch();
  }

  public clearPricing(): void {
    if (this.props.pricing === undefined) {
      return;
    }

    this.props.pricing = undefined;
    this.touch();
  }

  public hasPricing(): boolean {
    return this.props.pricing !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Payment
  // ---------------------------------------------------------------------------

  public get payment(): JourneyBookingPaymentEntity | undefined {
    return this.props.payment;
  }

  public setPayment(payment: JourneyBookingPaymentEntity): void {
    this.props.payment = payment;
    this.touch();
  }

  public clearPayment(): void {
    if (this.props.payment === undefined) {
      return;
    }

    this.props.payment = undefined;
    this.touch();
  }

  public hasPayment(): boolean {
    return this.props.payment !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Cancellation
  // ---------------------------------------------------------------------------

  public get cancellation(): JourneyBookingCancellationEntity | undefined {
    return this.props.cancellation;
  }

  public setCancellation(cancellation: JourneyBookingCancellationEntity): void {
    this.props.cancellation = cancellation;
    this.touch();
  }

  public clearCancellation(): void {
    if (this.props.cancellation === undefined) {
      return;
    }

    this.props.cancellation = undefined;
    this.touch();
  }

  public hasCancellation(): boolean {
    return this.props.cancellation !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Confirmed At
  // ---------------------------------------------------------------------------

  public get confirmedAt(): Date | undefined {
    return this.props.confirmedAt !== undefined
      ? JourneyBookingEntity.cloneDate(this.props.confirmedAt)
      : undefined;
  }

  public setConfirmedAt(confirmedAt: Date): void {
    this.props.confirmedAt = JourneyBookingEntity.cloneDate(confirmedAt);

    this.touch();
  }

  public clearConfirmedAt(): void {
    if (this.props.confirmedAt === undefined) {
      return;
    }

    this.props.confirmedAt = undefined;
    this.touch();
  }

  public hasBeenConfirmed(): boolean {
    return this.props.confirmedAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Cancelled At
  // ---------------------------------------------------------------------------

  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt !== undefined
      ? JourneyBookingEntity.cloneDate(this.props.cancelledAt)
      : undefined;
  }

  public setCancelledAt(cancelledAt: Date): void {
    this.props.cancelledAt = JourneyBookingEntity.cloneDate(cancelledAt);

    this.touch();
  }

  public clearCancelledAt(): void {
    if (this.props.cancelledAt === undefined) {
      return;
    }

    this.props.cancelledAt = undefined;
    this.touch();
  }

  public hasBeenCancelled(): boolean {
    return this.props.cancelledAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Completed At
  // ---------------------------------------------------------------------------

  public get completedAt(): Date | undefined {
    return this.props.completedAt !== undefined
      ? JourneyBookingEntity.cloneDate(this.props.completedAt)
      : undefined;
  }

  public setCompletedAt(completedAt: Date): void {
    this.props.completedAt = JourneyBookingEntity.cloneDate(completedAt);

    this.touch();
  }

  public clearCompletedAt(): void {
    if (this.props.completedAt === undefined) {
      return;
    }

    this.props.completedAt = undefined;
    this.touch();
  }

  public hasBeenCompleted(): boolean {
    return this.props.completedAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Expired At
  // ---------------------------------------------------------------------------

  public get expiredAt(): Date | undefined {
    return this.props.expiredAt !== undefined
      ? JourneyBookingEntity.cloneDate(this.props.expiredAt)
      : undefined;
  }

  public setExpiredAt(expiredAt: Date): void {
    this.props.expiredAt = JourneyBookingEntity.cloneDate(expiredAt);

    this.touch();
  }

  public clearExpiredAt(): void {
    if (this.props.expiredAt === undefined) {
      return;
    }

    this.props.expiredAt = undefined;
    this.touch();
  }

  public hasExpired(): boolean {
    return this.props.expiredAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Version
  // ---------------------------------------------------------------------------

  public get version(): number {
    return this.props.version;
  }

  /**
   * Increments the aggregate version by one.
   *
   * Version changes are intended for optimistic concurrency control.
   */
  public incrementVersion(): void {
    this.props.version += 1;
    this.touch();
  }

  /**
   * Explicitly sets the aggregate version.
   *
   * Primarily useful during persistence/rehydration workflows.
   */
  public setVersion(version: number): void {
    JourneyBookingEntity.assertVersion(version);

    this.props.version = version;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Queries
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.status.isPending();
  }

  public isConfirmed(): boolean {
    return this.status.isConfirmed();
  }

  public isCancelled(): boolean {
    return this.status.isCancelled();
  }

  public isCompleted(): boolean {
    return this.status.isCompleted();
  }

  public isExpired(): boolean {
    return this.status.isExpired();
  }

  // ---------------------------------------------------------------------------
  // Lifecycle State
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return !this.isCancelled() && !this.isCompleted() && !this.isExpired();
  }

  public isTerminal(): boolean {
    return this.isCancelled() || this.isCompleted() || this.isExpired();
  }

  public canBeConfirmed(): boolean {
    return this.isPending();
  }

  public canBeCancelled(): boolean {
    return !this.isTerminal();
  }

  public canBeCompleted(): boolean {
    return this.isConfirmed();
  }

  public canBeExpired(): boolean {
    return !this.isTerminal();
  }

  // ---------------------------------------------------------------------------
  // Component Queries
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the booking-time components required for a
   * structurally complete booking are present.
   *
   * Payment is intentionally excluded because payment has its own lifecycle.
   */
  public hasRequiredComponents(): boolean {
    return this.hasSnapshot() && this.hasPricing();
  }

  /**
   * Determines whether the booking has payment information.
   */
  public hasPaymentInformation(): boolean {
    return this.hasPayment();
  }

  /**
   * Determines whether the booking has been cancelled and contains
   * its cancellation record.
   */
  public hasCancellationInformation(): boolean {
    return this.isCancelled() && this.hasCancellation();
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Consistency
  // ---------------------------------------------------------------------------

  /**
   * Determines whether lifecycle timestamps are structurally consistent
   * with the current booking status.
   *
   * State-transition rules remain the responsibility of the aggregate.
   */
  public hasConsistentLifecycle(): boolean {
    if (this.isConfirmed() && !this.hasBeenConfirmed()) {
      return false;
    }

    if (this.isCancelled()) {
      if (!this.hasBeenCancelled()) {
        return false;
      }

      if (!this.hasCancellation()) {
        return false;
      }
    }

    if (this.isCompleted() && !this.hasBeenCompleted()) {
      return false;
    }

    if (this.isExpired() && !this.hasExpired()) {
      return false;
    }

    return true;
  }

  // ---------------------------------------------------------------------------
  // Completeness
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the entity contains the minimum structural
   * information required by the Journey Booking aggregate.
   */
  public isComplete(): boolean {
    return (
      this.hasRequiredComponents() &&
      this.hasConsistentLifecycle() &&
      this.props.version > 0
    );
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return JourneyBookingEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyBookingEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyBookingEntity.cloneDate(updatedAt);
  }

  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyBookingEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneyBookingEntity): boolean {
    if (!other) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Validation Helpers
  // ---------------------------------------------------------------------------

  private static assertVersion(version: number): void {
    if (!Number.isInteger(version)) {
      throw new Error('Journey booking aggregate version must be an integer.');
    }

    if (version < 1) {
      throw new Error(
        'Journey booking aggregate version must be greater than zero.',
      );
    }
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

export type { JourneyBookingProps };

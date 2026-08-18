// -----------------------------------------------------------------------------
// Journey Booking Cancellation Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyBookingCancellationPublicId } from '../value-objects/journey-booking-cancellation-public-id.vo';

import type { JourneyBookingCancellationReason } from '../value-objects/journey-booking-cancellation-reason.vo';

import type { JourneyBookingCancelledByPublicId } from '../value-objects/journey-booking-cancelled-by-public-id.vo';

import type { JourneyBookingCancellationReasonDescription } from '../value-objects/journey-booking-cancellation-reason-description.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyBookingCancellationProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: JourneyBookingCancellationPublicId;

  // ---------------------------------------------------------------------------
  // Cancellation
  // ---------------------------------------------------------------------------

  reason: JourneyBookingCancellationReason;

  /**
   * Public identity of the actor that initiated the cancellation.
   *
   * System-generated cancellations may not have an external actor.
   */
  cancelledByPublicId: JourneyBookingCancelledByPublicId | undefined;

  /**
   * Human-readable cancellation explanation.
   *
   * Required by the domain when the cancellation reason is OTHER.
   */
  reasonDescription: JourneyBookingCancellationReasonDescription | undefined;

  /**
   * Actual cancellation timestamp.
   */
  cancelledAt: Date;

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
 * Represents the cancellation record belonging to a Journey Booking.
 *
 * JourneyBooking owns this entity as part of its aggregate boundary.
 *
 * The entity contains the historical cancellation information and does not
 * independently control the JourneyBooking lifecycle.
 */
export class JourneyBookingCancellationEntity extends Entity<
  JourneyBookingCancellationProps,
  JourneyBookingCancellationPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneyBookingCancellationProps,
    id?: UniqueEntityId,
    publicId?: JourneyBookingCancellationPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyBookingCancellationPublicId;

    reason: JourneyBookingCancellationReason;

    cancelledByPublicId?: JourneyBookingCancelledByPublicId | undefined;

    reasonDescription?: JourneyBookingCancellationReasonDescription | undefined;

    cancelledAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;
  }): JourneyBookingCancellationEntity {
    const now = new Date();

    const cancelledAt = JourneyBookingCancellationEntity.cloneDate(
      props.cancelledAt ?? now,
    );

    const createdAt = JourneyBookingCancellationEntity.cloneDate(
      props.createdAt ?? now,
    );

    const updatedAt = JourneyBookingCancellationEntity.cloneDate(
      props.updatedAt ?? now,
    );

    return new JourneyBookingCancellationEntity({
      publicId: props.publicId ?? new JourneyBookingCancellationPublicId(),

      reason: props.reason,

      cancelledByPublicId: props.cancelledByPublicId,

      reasonDescription: props.reasonDescription,

      cancelledAt,

      createdAt,

      updatedAt,
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyBookingCancellationProps,
    id: UniqueEntityId,
    publicId: JourneyBookingCancellationPublicId,
  ): JourneyBookingCancellationEntity {
    return new JourneyBookingCancellationEntity(
      {
        publicId,

        reason: props.reason,

        cancelledByPublicId: props.cancelledByPublicId,

        reasonDescription: props.reasonDescription,

        cancelledAt: JourneyBookingCancellationEntity.cloneDate(
          props.cancelledAt,
        ),

        createdAt: JourneyBookingCancellationEntity.cloneDate(props.createdAt),

        updatedAt: JourneyBookingCancellationEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneyBookingCancellationPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Reason
  // ---------------------------------------------------------------------------

  public get reason(): JourneyBookingCancellationReason {
    return this.props.reason;
  }

  public setReason(reason: JourneyBookingCancellationReason): void {
    this.props.reason = reason;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Cancelled By
  // ---------------------------------------------------------------------------

  public get cancelledByPublicId():
    JourneyBookingCancelledByPublicId | undefined {
    return this.props.cancelledByPublicId;
  }

  public setCancelledByPublicId(
    cancelledByPublicId: JourneyBookingCancelledByPublicId,
  ): void {
    this.props.cancelledByPublicId = cancelledByPublicId;
    this.touch();
  }

  public clearCancelledByPublicId(): void {
    if (this.props.cancelledByPublicId === undefined) {
      return;
    }

    this.props.cancelledByPublicId = undefined;
    this.touch();
  }

  public hasCancelledByPublicId(): boolean {
    return this.props.cancelledByPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Reason Description
  // ---------------------------------------------------------------------------

  public get reasonDescription():
    JourneyBookingCancellationReasonDescription | undefined {
    return this.props.reasonDescription;
  }

  public setReasonDescription(
    reasonDescription: JourneyBookingCancellationReasonDescription,
  ): void {
    this.props.reasonDescription = reasonDescription;
    this.touch();
  }

  public clearReasonDescription(): void {
    if (this.props.reasonDescription === undefined) {
      return;
    }

    this.props.reasonDescription = undefined;
    this.touch();
  }

  public hasReasonDescription(): boolean {
    return this.props.reasonDescription !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Cancellation Timestamp
  // ---------------------------------------------------------------------------

  public get cancelledAt(): Date {
    return JourneyBookingCancellationEntity.cloneDate(this.props.cancelledAt);
  }

  public setCancelledAt(cancelledAt: Date): void {
    this.props.cancelledAt =
      JourneyBookingCancellationEntity.cloneDate(cancelledAt);

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return JourneyBookingCancellationEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyBookingCancellationEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt =
      JourneyBookingCancellationEntity.cloneDate(updatedAt);
  }

  /**
   * Updates the entity's modification timestamp.
   *
   * This is intentionally public because the foundation Entity contract
   * requires the concrete entity to expose the same visibility.
   */
  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyBookingCancellationEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Domain Queries
  // ---------------------------------------------------------------------------

  public isPassengerRequest(): boolean {
    return this.reason.isPassengerRequest();
  }

  public isProviderRequest(): boolean {
    return this.reason.isProviderRequest();
  }

  public isJourneyCancelled(): boolean {
    return this.reason.isJourneyCancelled();
  }

  public isNoShow(): boolean {
    return this.reason.isNoShow();
  }

  public isSystemCancellation(): boolean {
    return this.reason.isSystem();
  }

  public isOtherReason(): boolean {
    return this.reason.isOther();
  }

  // ---------------------------------------------------------------------------
  // Cancellation Classification
  // ---------------------------------------------------------------------------

  public isActorInitiated(): boolean {
    return this.isPassengerRequest() || this.isProviderRequest();
  }

  public isSystemInitiated(): boolean {
    return this.isSystemCancellation() || this.isJourneyCancelled();
  }

  // ---------------------------------------------------------------------------
  // Validation Helpers
  // ---------------------------------------------------------------------------

  /**
   * OTHER cancellations require a description.
   */
  public hasRequiredDescription(): boolean {
    if (!this.isOtherReason()) {
      return true;
    }

    return this.hasReasonDescription();
  }

  /**
   * Determines whether an actor is associated with the cancellation.
   */
  public hasActor(): boolean {
    return this.props.cancelledByPublicId !== undefined;
  }

  /**
   * Determines whether the cancellation contains the minimum
   * structurally required information.
   *
   * Aggregate-level business rules remain the responsibility
   * of JourneyBookingAggregate.
   */
  public isComplete(): boolean {
    return (
      this.props.cancelledAt instanceof Date &&
      !Number.isNaN(this.props.cancelledAt.getTime()) &&
      this.hasRequiredDescription()
    );
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneyBookingCancellationEntity): boolean {
    return other !== undefined && this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingCancellationProps };

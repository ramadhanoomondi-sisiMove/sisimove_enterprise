// -----------------------------------------------------------------------------
// Commercial Booking Commission Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionPublicId } from '../value-objects/commercial-booking-commission-public-id.vo';

import type { CommercialCommissionRulePublicId } from '../value-objects/commercial-commission-rule-public-id.vo';

import type { CommercialBookingCommissionBookingPublicId } from '../value-objects/commercial-booking-commission-booking-public-id.vo';

import type { CommercialBookingCommissionJourneyPublicId } from '../value-objects/commercial-booking-commission-journey-public-id.vo';

import type { CommercialBookingCommissionPercentage } from '../value-objects/commercial-booking-commission-percentage.vo';

import type { CommercialBookingCommissionBaseAmount } from '../value-objects/commercial-booking-commission-base-amount.vo';

import type { CommercialBookingCommissionAmount } from '../value-objects/commercial-booking-commission-amount.vo';

import type { CommercialBookingCommissionCurrency } from '../value-objects/commercial-booking-commission-currency.vo';

import { CommercialBookingCommissionStatus } from '../value-objects/commercial-booking-commission-status.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

export interface CommercialBookingCommissionProps {
  // ---------------------------------------------------------------------------
  // Commercial Policy Reference
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Commercial Commission Rule used to create
   * this assessment.
   *
   * The rule reference identifies the commercial policy that produced the
   * assessment. The percentage and monetary values below preserve the
   * historical assessment snapshot.
   */
  commissionRulePublicId: CommercialCommissionRulePublicId;

  // ---------------------------------------------------------------------------
  // Cross-Domain References
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Booking associated with this commission.
   *
   * Booking belongs to another bounded context and is therefore represented
   * by its public identity rather than a domain or Prisma relation.
   */
  bookingPublicId: CommercialBookingCommissionBookingPublicId;

  /**
   * Public identity of the Journey associated with this commission.
   *
   * Journey belongs to another bounded context and is therefore represented
   * by its public identity rather than a domain or Prisma relation.
   */
  journeyPublicId: CommercialBookingCommissionJourneyPublicId;

  // ---------------------------------------------------------------------------
  // Commission Assessment Snapshot
  // ---------------------------------------------------------------------------

  /**
   * Snapshot of the commission percentage used for this assessment.
   *
   * Immutable after creation.
   */
  percentage: CommercialBookingCommissionPercentage;

  /**
   * Snapshot of the booking amount against which the commission was assessed.
   *
   * Immutable after creation.
   */
  baseAmount: CommercialBookingCommissionBaseAmount;

  /**
   * Snapshot of the actual commission amount assessed.
   *
   * This is persisted rather than recalculated from the current Commercial
   * Commission Rule.
   *
   * Historical assessments must remain authoritative even when commercial
   * policy changes in the future.
   */
  commissionAmount: CommercialBookingCommissionAmount;

  /**
   * Currency in which the commission assessment was made.
   *
   * Immutable after creation.
   */
  currency: CommercialBookingCommissionCurrency;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current lifecycle status of the booking commission.
   */
  status: CommercialBookingCommissionStatus;

  /**
   * Time at which the commission was assessed.
   */
  assessedAt: Date | undefined;

  /**
   * Time at which the commission was cancelled.
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

/**
 * Represents a commercial commission assessed against a Booking.
 *
 * This is an ENTITY and not an Aggregate Root.
 *
 * The corresponding Aggregate Root is responsible for:
 *
 * - owning this entity;
 * - coordinating aggregate-level behavior;
 * - recording domain events.
 *
 * This entity itself is responsible for its own intrinsic state and lifecycle
 * invariants.
 *
 * The entity does not belong to:
 *
 * - CommercialCommissionRuleEntity;
 * - CommercialEarningCommissionEntity;
 * - a parent CommercialAggregate.
 *
 * The Commercial Commission Rule is referenced through its public identity.
 * The applicable percentage and monetary assessment are snapshotted locally
 * so historical commercial assessments remain stable.
 *
 * Lifecycle:
 *
 * PENDING
 *   The commission assessment exists but has not yet been formally assessed.
 *
 * ASSESSED
 *   The commission has been assessed and its financial snapshot is
 *   authoritative.
 *
 * CANCELLED
 *   The commission has been cancelled and must no longer participate in
 *   active commercial processing.
 *
 * A commission may be cancelled after assessment. In that case, assessedAt
 * is preserved because cancellation does not erase the historical fact that
 * assessment occurred.
 */
export class CommercialBookingCommissionEntity extends Entity<
  CommercialBookingCommissionProps,
  CommercialBookingCommissionPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Creates a Commercial Booking Commission entity.
   *
   * The constructor is public so that the owning aggregate can construct
   * and rehydrate the entity as required by the domain model.
   */
  constructor(
    props: CommercialBookingCommissionProps,
    id?: UniqueEntityId,
    publicId?: CommercialBookingCommissionPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Commercial Booking Commission.
   *
   * Newly created commissions always begin in PENDING state.
   *
   * Lifecycle state is intentionally not accepted from the caller.
   * Persisted lifecycle state must be restored through rehydrate().
   */
  public static create(props: {
    publicId?: CommercialBookingCommissionPublicId | undefined;

    commissionRulePublicId: CommercialCommissionRulePublicId;

    bookingPublicId: CommercialBookingCommissionBookingPublicId;

    journeyPublicId: CommercialBookingCommissionJourneyPublicId;

    percentage: CommercialBookingCommissionPercentage;

    baseAmount: CommercialBookingCommissionBaseAmount;

    commissionAmount: CommercialBookingCommissionAmount;

    currency: CommercialBookingCommissionCurrency;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): CommercialBookingCommissionEntity {
    const now = new Date();

    const publicId =
      props.publicId ?? new CommercialBookingCommissionPublicId();

    return new CommercialBookingCommissionEntity(
      {
        // ---------------------------------------------------------------------
        // Commercial Policy Reference
        // ---------------------------------------------------------------------

        commissionRulePublicId: props.commissionRulePublicId,

        // ---------------------------------------------------------------------
        // Cross-Domain References
        // ---------------------------------------------------------------------

        bookingPublicId: props.bookingPublicId,

        journeyPublicId: props.journeyPublicId,

        // ---------------------------------------------------------------------
        // Commission Assessment Snapshot
        // ---------------------------------------------------------------------

        percentage: props.percentage,

        baseAmount: props.baseAmount,

        commissionAmount: props.commissionAmount,

        currency: props.currency,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: CommercialBookingCommissionStatus.pending(),

        assessedAt: undefined,

        cancelledAt: undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: CommercialBookingCommissionEntity.cloneDate(
          props.createdAt ?? now,
        ),

        updatedAt: CommercialBookingCommissionEntity.cloneDate(
          props.updatedAt ?? now,
        ),
      },

      new UniqueEntityId(),

      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Rehydrates a Commercial Booking Commission from persistence.
   *
   * Persistence identity and lifecycle state are authoritative.
   *
   * No lifecycle transition is executed during rehydration.
   */
  public static rehydrate(
    props: CommercialBookingCommissionProps,
    id: UniqueEntityId,
    publicId: CommercialBookingCommissionPublicId,
  ): CommercialBookingCommissionEntity {
    return new CommercialBookingCommissionEntity(
      {
        ...props,

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        assessedAt:
          props.assessedAt !== undefined
            ? CommercialBookingCommissionEntity.cloneDate(props.assessedAt)
            : undefined,

        cancelledAt:
          props.cancelledAt !== undefined
            ? CommercialBookingCommissionEntity.cloneDate(props.cancelledAt)
            : undefined,

        // ---------------------------------------------------------------------
        // Audit Timestamps
        // ---------------------------------------------------------------------

        createdAt: CommercialBookingCommissionEntity.cloneDate(props.createdAt),

        updatedAt: CommercialBookingCommissionEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Returns the public identity of this Commercial Booking Commission.
   *
   * Public identity is owned by the foundation Entity and is intentionally
   * not duplicated inside the entity properties.
   */
  public override get publicId(): CommercialBookingCommissionPublicId {
    return super.publicId;
  }

  // ---------------------------------------------------------------------------
  // Commercial Policy Reference
  // ---------------------------------------------------------------------------

  public get commissionRulePublicId(): CommercialCommissionRulePublicId {
    return this.props.commissionRulePublicId;
  }

  // ---------------------------------------------------------------------------
  // Booking
  // ---------------------------------------------------------------------------

  public get bookingPublicId(): CommercialBookingCommissionBookingPublicId {
    return this.props.bookingPublicId;
  }

  // ---------------------------------------------------------------------------
  // Journey
  // ---------------------------------------------------------------------------

  public get journeyPublicId(): CommercialBookingCommissionJourneyPublicId {
    return this.props.journeyPublicId;
  }

  // ---------------------------------------------------------------------------
  // Percentage
  // ---------------------------------------------------------------------------

  public get percentage(): CommercialBookingCommissionPercentage {
    return this.props.percentage;
  }

  // ---------------------------------------------------------------------------
  // Base Amount
  // ---------------------------------------------------------------------------

  public get baseAmount(): CommercialBookingCommissionBaseAmount {
    return this.props.baseAmount;
  }

  // ---------------------------------------------------------------------------
  // Commission Amount
  // ---------------------------------------------------------------------------

  /**
   * Returns the persisted commission assessment amount.
   *
   * The amount is part of the immutable commercial assessment snapshot.
   */
  public get commissionAmount(): CommercialBookingCommissionAmount {
    return this.props.commissionAmount;
  }

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  public get currency(): CommercialBookingCommissionCurrency {
    return this.props.currency;
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): CommercialBookingCommissionStatus {
    return this.props.status;
  }

  /**
   * Determines whether the commission is awaiting assessment.
   */
  public isPending(): boolean {
    return this.props.status.isPending();
  }

  /**
   * Determines whether the commission has been assessed.
   */
  public isAssessed(): boolean {
    return this.props.status.isAssessed();
  }

  /**
   * Determines whether the commission has been cancelled.
   */
  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  /**
   * Indicates whether the commission is still active in the commercial
   * assessment workflow.
   *
   * Only PENDING commissions are considered active.
   */
  public isActive(): boolean {
    return this.isPending();
  }

  /**
   * Indicates whether the commission has reached a terminal state.
   */
  public isTerminal(): boolean {
    return this.isAssessed() || this.isCancelled();
  }

  // ---------------------------------------------------------------------------
  // Assessment Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Assesses the booking commission.
   *
   * Assessment is only permitted from PENDING state.
   *
   * The commercial assessment snapshot was established when this entity
   * was created. Assessment therefore changes lifecycle state and records
   * the assessment timestamp; it does not recalculate the commission amount.
   */
  public assess(at: Date = new Date()): void {
    if (!this.canAssess()) {
      throw new Error(
        'Commercial Booking Commission can only be assessed while pending.',
      );
    }

    const assessedAt = CommercialBookingCommissionEntity.cloneDate(at);

    this.props.status = CommercialBookingCommissionStatus.assessed();

    this.props.assessedAt = assessedAt;

    this.touch(assessedAt);
  }

  /**
   * Cancels the booking commission.
   *
   * Cancellation is permitted from PENDING or ASSESSED state.
   *
   * If the commission was already assessed, assessedAt is intentionally
   * preserved because cancellation does not erase the historical fact that
   * the commission was previously assessed.
   */
  public cancel(at: Date = new Date()): void {
    if (!this.canCancel()) {
      throw new Error(
        'Commercial Booking Commission cannot be cancelled from its current state.',
      );
    }

    const cancelledAt = CommercialBookingCommissionEntity.cloneDate(at);

    this.props.status = CommercialBookingCommissionStatus.cancelled();

    this.props.cancelledAt = cancelledAt;

    this.touch(cancelledAt);
  }

  // ---------------------------------------------------------------------------
  // Assessment State Queries
  // ---------------------------------------------------------------------------

  /**
   * Determines whether this commission can currently be assessed.
   */
  public canAssess(): boolean {
    return this.isPending();
  }

  /**
   * Determines whether this commission can currently be cancelled.
   */
  public canCancel(): boolean {
    return this.isPending() || this.isAssessed();
  }

  /**
   * Determines whether the commission has ever been assessed.
   */
  public hasBeenAssessed(): boolean {
    return this.props.assessedAt !== undefined;
  }

  /**
   * Determines whether the commission has ever been cancelled.
   */
  public hasBeenCancelled(): boolean {
    return this.props.cancelledAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  public get assessedAt(): Date | undefined {
    return this.props.assessedAt
      ? CommercialBookingCommissionEntity.cloneDate(this.props.assessedAt)
      : undefined;
  }

  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt
      ? CommercialBookingCommissionEntity.cloneDate(this.props.cancelledAt)
      : undefined;
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return CommercialBookingCommissionEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return CommercialBookingCommissionEntity.cloneDate(this.props.updatedAt);
  }

  /**
   * Allows persistence infrastructure to restore the updated timestamp.
   *
   * This does not represent a commercial domain state transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt =
      CommercialBookingCommissionEntity.cloneDate(updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  /**
   * Creates a defensive copy of a Date value.
   *
   * This prevents callers from mutating the entity's internal temporal state
   * through a shared Date reference.
   */
  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}

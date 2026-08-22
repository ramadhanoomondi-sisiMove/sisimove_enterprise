// -----------------------------------------------------------------------------
// Commercial Earning Commission Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionPublicId } from '../value-objects/commercial-earning-commission-public-id.vo';

import type { CommercialCommissionRulePublicId } from '../value-objects/commercial-commission-rule-public-id.vo';

import type { CommercialEarningCommissionJourneyPublicId } from '../value-objects/commercial-earning-commission-journey-public-id.vo';

import type { CommercialEarningCommissionSettlementPublicId } from '../value-objects/commercial-earning-commission-settlement-public-id.vo';

import type { CommercialEarningCommissionProviderPublicId } from '../value-objects/commercial-earning-commission-provider-public-id.vo';

import type { CommercialEarningCommissionPercentage } from '../value-objects/commercial-earning-commission-percentage.vo';

import type { CommercialEarningCommissionBaseAmount } from '../value-objects/commercial-earning-commission-base-amount.vo';

import type { CommercialEarningCommissionAmount } from '../value-objects/commercial-earning-commission-amount.vo';

import type { CommercialEarningCommissionNetAmount } from '../value-objects/commercial-earning-commission-net-amount.vo';

import type { CommercialEarningCommissionCurrency } from '../value-objects/commercial-earning-commission-currency.vo';

import { CommercialEarningCommissionStatus } from '../value-objects/commercial-earning-commission-status.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

export interface CommercialEarningCommissionProps {
  // ---------------------------------------------------------------------------
  // Commercial Rule Reference
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Commercial Commission Rule used to assess
   * this earning commission.
   *
   * This is a historical reference to the applicable Commercial policy.
   *
   * The percentage is also snapshotted on this entity so that subsequent
   * changes to the rule cannot alter this historical assessment.
   */
  commissionRulePublicId: CommercialCommissionRulePublicId;

  // ---------------------------------------------------------------------------
  // Cross-Domain References
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey associated with this commission.
   *
   * Journey belongs to another bounded context, therefore this is represented
   * as a public identifier rather than a domain or Prisma relation.
   */
  journeyPublicId: CommercialEarningCommissionJourneyPublicId;

  /**
   * Public identity of the Journey Settlement associated with this
   * commission.
   *
   * Settlement belongs to another bounded context, therefore this is
   * represented as a public identifier rather than a domain or Prisma
   * relation.
   */
  settlementPublicId: CommercialEarningCommissionSettlementPublicId;

  /**
   * Public identity of the provider whose earning is being assessed.
   *
   * The provider belongs to another bounded context, therefore this is
   * represented as a public identifier rather than a domain relation.
   */
  providerPublicId: CommercialEarningCommissionProviderPublicId;

  // ---------------------------------------------------------------------------
  // Commission Assessment Snapshot
  // ---------------------------------------------------------------------------

  /**
   * Snapshot of the commission percentage used for this assessment.
   *
   * This value is immutable after creation.
   */
  percentage: CommercialEarningCommissionPercentage;

  /**
   * Provider earning before the Commercial earning commission.
   *
   * This value is immutable after creation.
   */
  baseAmount: CommercialEarningCommissionBaseAmount;

  /**
   * Commission retained by the platform from the provider earning.
   *
   * This value is immutable after creation.
   */
  commissionAmount: CommercialEarningCommissionAmount;

  /**
   * Provider earning after the Commercial earning commission.
   *
   * netAmount = baseAmount - commissionAmount
   *
   * This value is immutable after creation.
   */
  netAmount: CommercialEarningCommissionNetAmount;

  /**
   * Currency in which the commission assessment was made.
   *
   * This value is immutable after creation.
   */
  currency: CommercialEarningCommissionCurrency;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current lifecycle status of the earning commission.
   */
  status: CommercialEarningCommissionStatus;

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
 * Commercial Earning Commission domain entity.
 *
 * Represents a commission retained by the platform from a provider earning.
 *
 * This entity is NOT an aggregate root.
 *
 * It is owned by CommercialEarningCommissionAggregate, which is responsible
 * for aggregate-level behavior and domain event recording.
 *
 * The entity contains the earning commission's own state and intrinsic
 * lifecycle rules.
 *
 * The Commercial Commission Rule is referenced by public ID and the
 * applicable assessment values are snapshotted on this entity.
 *
 * This guarantees that historical commission assessments remain stable even
 * when future Commercial Commission Rules change.
 *
 * Lifecycle:
 *
 * PENDING
 *   The commission assessment exists but has not yet been assessed.
 *
 * ASSESSED
 *   The commission has been assessed and the provider net amount established.
 *
 * CANCELLED
 *   The commission has been cancelled and must no longer participate in
 *   active commercial processing.
 *
 * Domain events are intentionally not recorded here. The owning aggregate
 * records domain events after invoking entity state transitions.
 */
export class CommercialEarningCommissionEntity extends Entity<
  CommercialEarningCommissionProps,
  CommercialEarningCommissionPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    props: CommercialEarningCommissionProps,
    id?: UniqueEntityId,
    publicId?: CommercialEarningCommissionPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Commercial Earning Commission.
   *
   * New commissions always begin in PENDING state.
   *
   * The commercial assessment snapshot is established at creation time.
   * Subsequent changes to the Commercial Commission Rule do not modify this
   * entity.
   */
  public static create(props: {
    publicId?: CommercialEarningCommissionPublicId | undefined;

    commissionRulePublicId: CommercialCommissionRulePublicId;

    journeyPublicId: CommercialEarningCommissionJourneyPublicId;

    settlementPublicId: CommercialEarningCommissionSettlementPublicId;

    providerPublicId: CommercialEarningCommissionProviderPublicId;

    percentage: CommercialEarningCommissionPercentage;

    baseAmount: CommercialEarningCommissionBaseAmount;

    commissionAmount: CommercialEarningCommissionAmount;

    netAmount: CommercialEarningCommissionNetAmount;

    currency: CommercialEarningCommissionCurrency;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): CommercialEarningCommissionEntity {
    const now = new Date();

    const publicId =
      props.publicId ?? new CommercialEarningCommissionPublicId();

    return new CommercialEarningCommissionEntity(
      {
        // ---------------------------------------------------------------------
        // Commercial Rule Reference
        // ---------------------------------------------------------------------

        commissionRulePublicId: props.commissionRulePublicId,

        // ---------------------------------------------------------------------
        // Cross-Domain References
        // ---------------------------------------------------------------------

        journeyPublicId: props.journeyPublicId,

        settlementPublicId: props.settlementPublicId,

        providerPublicId: props.providerPublicId,

        // ---------------------------------------------------------------------
        // Commission Assessment Snapshot
        // ---------------------------------------------------------------------

        percentage: props.percentage,

        baseAmount: props.baseAmount,

        commissionAmount: props.commissionAmount,

        netAmount: props.netAmount,

        currency: props.currency,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: CommercialEarningCommissionStatus.pending(),

        assessedAt: undefined,

        cancelledAt: undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: CommercialEarningCommissionEntity.cloneDate(
          props.createdAt ?? now,
        ),

        updatedAt: CommercialEarningCommissionEntity.cloneDate(
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
   * Rehydrates a Commercial Earning Commission from persistence.
   *
   * Persistence identity and lifecycle state are authoritative during
   * rehydration.
   *
   * No lifecycle transition is executed during rehydration.
   */
  public static rehydrate(
    props: CommercialEarningCommissionProps,
    id: UniqueEntityId,
    publicId: CommercialEarningCommissionPublicId,
  ): CommercialEarningCommissionEntity {
    return new CommercialEarningCommissionEntity(
      {
        ...props,

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        assessedAt:
          props.assessedAt !== undefined
            ? CommercialEarningCommissionEntity.cloneDate(props.assessedAt)
            : undefined,

        cancelledAt:
          props.cancelledAt !== undefined
            ? CommercialEarningCommissionEntity.cloneDate(props.cancelledAt)
            : undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: CommercialEarningCommissionEntity.cloneDate(props.createdAt),

        updatedAt: CommercialEarningCommissionEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of this entity.
   */
  public override get publicId(): CommercialEarningCommissionPublicId {
    return super.publicId;
  }

  // ---------------------------------------------------------------------------
  // Commercial Rule
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Commercial Commission Rule used for this
   * assessment.
   */
  public get commissionRulePublicId(): CommercialCommissionRulePublicId {
    return this.props.commissionRulePublicId;
  }

  // ---------------------------------------------------------------------------
  // Journey
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the associated Journey.
   */
  public get journeyPublicId(): CommercialEarningCommissionJourneyPublicId {
    return this.props.journeyPublicId;
  }

  // ---------------------------------------------------------------------------
  // Settlement
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the associated Journey Settlement.
   */
  public get settlementPublicId(): CommercialEarningCommissionSettlementPublicId {
    return this.props.settlementPublicId;
  }

  // ---------------------------------------------------------------------------
  // Provider
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the provider whose earning is being assessed.
   */
  public get providerPublicId(): CommercialEarningCommissionProviderPublicId {
    return this.props.providerPublicId;
  }

  // ---------------------------------------------------------------------------
  // Percentage
  // ---------------------------------------------------------------------------

  /**
   * Snapshotted commission percentage.
   */
  public get percentage(): CommercialEarningCommissionPercentage {
    return this.props.percentage;
  }

  // ---------------------------------------------------------------------------
  // Base Amount
  // ---------------------------------------------------------------------------

  /**
   * Provider earning before commission.
   */
  public get baseAmount(): CommercialEarningCommissionBaseAmount {
    return this.props.baseAmount;
  }

  // ---------------------------------------------------------------------------
  // Commission Amount
  // ---------------------------------------------------------------------------

  /**
   * Commission retained by the platform.
   */
  public get commissionAmount(): CommercialEarningCommissionAmount {
    return this.props.commissionAmount;
  }

  // ---------------------------------------------------------------------------
  // Net Amount
  // ---------------------------------------------------------------------------

  /**
   * Provider earning after commission.
   */
  public get netAmount(): CommercialEarningCommissionNetAmount {
    return this.props.netAmount;
  }

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  /**
   * Currency of the assessment.
   */
  public get currency(): CommercialEarningCommissionCurrency {
    return this.props.currency;
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  /**
   * Current lifecycle status.
   */
  public get status(): CommercialEarningCommissionStatus {
    return this.props.status;
  }

  /**
   * Determines whether the commission is pending.
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
   * Indicates whether the commission is still awaiting assessment.
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
   * Assesses the earning commission.
   *
   * The financial assessment snapshot was established when the entity was
   * created. This method performs only the lifecycle transition and records
   * when the assessment occurred.
   *
   * Only a PENDING commission can be assessed.
   *
   * The owning aggregate is responsible for recording the corresponding
   * domain event.
   */
  public assess(at: Date = new Date()): void {
    if (!this.canAssess()) {
      throw new Error(
        'Commercial Earning Commission can only be assessed while pending',
      );
    }

    this.props.status = CommercialEarningCommissionStatus.assessed();

    this.props.assessedAt = CommercialEarningCommissionEntity.cloneDate(at);

    this.touch(at);
  }

  /**
   * Cancels the earning commission.
   *
   * A PENDING or ASSESSED commission may be cancelled.
   *
   * If an ASSESSED commission is cancelled, assessedAt is intentionally
   * preserved because cancellation does not erase the historical fact that
   * the commission was previously assessed.
   *
   * The owning aggregate is responsible for recording the corresponding
   * domain event.
   */
  public cancel(at: Date = new Date()): void {
    if (!this.canCancel()) {
      throw new Error(
        'Commercial Earning Commission cannot be cancelled from its current state',
      );
    }

    this.props.status = CommercialEarningCommissionStatus.cancelled();

    this.props.cancelledAt = CommercialEarningCommissionEntity.cloneDate(at);

    this.touch(at);
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
   * Determines whether an assessment timestamp has been recorded.
   */
  public hasBeenAssessed(): boolean {
    return this.props.assessedAt !== undefined;
  }

  /**
   * Determines whether a cancellation timestamp has been recorded.
   */
  public hasBeenCancelled(): boolean {
    return this.props.cancelledAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Time at which the commission was assessed.
   */
  public get assessedAt(): Date | undefined {
    return this.props.assessedAt !== undefined
      ? CommercialEarningCommissionEntity.cloneDate(this.props.assessedAt)
      : undefined;
  }

  /**
   * Time at which the commission was cancelled.
   */
  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt !== undefined
      ? CommercialEarningCommissionEntity.cloneDate(this.props.cancelledAt)
      : undefined;
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Creation timestamp.
   */
  public get createdAt(): Date {
    return CommercialEarningCommissionEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Last persistence update timestamp.
   */
  public get updatedAt(): Date {
    return CommercialEarningCommissionEntity.cloneDate(this.props.updatedAt);
  }

  /**
   * Allows persistence infrastructure to restore the updated timestamp.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt =
      CommercialEarningCommissionEntity.cloneDate(updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  /**
   * Creates a defensive copy of a Date instance.
   */
  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}

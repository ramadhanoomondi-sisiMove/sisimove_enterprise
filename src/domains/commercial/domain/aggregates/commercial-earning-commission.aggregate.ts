// -----------------------------------------------------------------------------
// Commercial Earning Commission Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate root for a commercial earning commission.
//
// A Commercial Earning Commission represents the platform commission assessed
// against the provider's earning from a journey settlement.
//
// Aggregate boundary:
//
//   CommercialEarningCommissionAggregate
//              │
//              └── CommercialEarningCommissionEntity
//
// The aggregate owns:
//
// - earning commission lifecycle
// - commission assessment
// - commission cancellation
// - domain event recording
//
// Cross-domain concepts such as Journey, Settlement, Identity, Wallet, and
// Accounting remain outside this aggregate boundary and are represented by
// public identifiers.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { CommercialEarningCommissionEntity } from '../entities/commercial-earning-commission.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionAssessedEvent } from '../events/commercial-earning-commission-assessed.event';
import { CommercialEarningCommissionCancelledEvent } from '../events/commercial-earning-commission-cancelled.event';
import { CommercialEarningCommissionCreatedEvent } from '../events/commercial-earning-commission-created.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionAlreadyAssessedException } from '../exceptions/commercial-earning-commission-already-assessed.exception';
import { CommercialEarningCommissionAlreadyCancelledException } from '../exceptions/commercial-earning-commission-already-cancelled.exception';
import { CommercialEarningCommissionCannotAssessException } from '../exceptions/commercial-earning-commission-cannot-assess.exception';
import { CommercialEarningCommissionCannotCancelException } from '../exceptions/commercial-earning-commission-cannot-cancel.exception';

// -----------------------------------------------------------------------------
// Value Objects / Enums
// -----------------------------------------------------------------------------

import type { CommercialEarningCommissionStatus } from '../value-objects/commercial-earning-commission-status.vo';

// -----------------------------------------------------------------------------
// Aggregate Props
// -----------------------------------------------------------------------------

interface CommercialEarningCommissionAggregateProps {
  earningCommission: CommercialEarningCommissionEntity;
}

// -----------------------------------------------------------------------------
// Aggregate Root
// -----------------------------------------------------------------------------

/**
 * Aggregate root for a Commercial Earning Commission.
 *
 * A Commercial Earning Commission represents the platform commission assessed
 * against the provider's earning from a journey settlement.
 *
 * The earning commission is the consistency boundary.
 *
 * The aggregate owns the earning commission entity and coordinates:
 *
 * - aggregate creation
 * - commission assessment
 * - commission cancellation
 * - domain event recording
 *
 * The aggregate does not own:
 *
 * - Journey
 * - Journey Settlement
 * - Identity / Provider
 * - Wallet
 * - Treasury
 * - Accounting
 *
 * Those concepts belong to other bounded contexts and are represented here
 * only through their public identifiers.
 */
export class CommercialEarningCommissionAggregate extends AggregateRoot<CommercialEarningCommissionAggregateProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(props: CommercialEarningCommissionAggregateProps) {
    super(props);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Commercial Earning Commission aggregate.
   *
   * The supplied entity is expected to have already been created and validated
   * by the domain entity factory.
   *
   * Creation records a CommercialEarningCommissionCreatedEvent containing the
   * complete commercial snapshot captured at creation time.
   */
  public static create(
    earningCommission: CommercialEarningCommissionEntity,
    correlationId: string,
  ): CommercialEarningCommissionAggregate {
    const aggregate = new CommercialEarningCommissionAggregate({
      earningCommission,
    });

    aggregate.addDomainEvent(
      new CommercialEarningCommissionCreatedEvent(
        aggregate.id.value,
        aggregate.publicId.value,
        aggregate.journeyPublicId,
        aggregate.settlementPublicId,
        aggregate.providerPublicId,
        aggregate.commissionRulePublicId,
        aggregate.percentage,
        aggregate.baseAmount,
        aggregate.commissionAmount,
        aggregate.netAmount,
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
   * Rehydrates an existing Commercial Earning Commission aggregate.
   *
   * Rehydration restores persisted state and does not emit domain events.
   */
  public static rehydrate(
    earningCommission: CommercialEarningCommissionEntity,
  ): CommercialEarningCommissionAggregate {
    return new CommercialEarningCommissionAggregate({
      earningCommission,
    });
  }

  // ---------------------------------------------------------------------------
  // Aggregate State
  // ---------------------------------------------------------------------------

  /**
   * Returns the earning commission entity owned by this aggregate.
   */
  public get earningCommission(): CommercialEarningCommissionEntity {
    return this.props.earningCommission;
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Returns the aggregate's internal identity.
   *
   * The identity is owned by the underlying earning commission entity.
   */
  public override get id() {
    return this.earningCommission.id;
  }

  /**
   * Returns the aggregate's public identity.
   *
   * The public identity is owned by the underlying earning commission entity.
   */
  public override get publicId() {
    return this.earningCommission.publicId;
  }

  // ---------------------------------------------------------------------------
  // Domain References
  // ---------------------------------------------------------------------------

  /**
   * Commercial commission rule used to assess this commission.
   */
  public get commissionRulePublicId(): string {
    return this.earningCommission.commissionRulePublicId.value;
  }

  /**
   * Journey associated with the earning.
   *
   * Cross-domain reference to Journey.publicId.
   */
  public get journeyPublicId(): string {
    return this.earningCommission.journeyPublicId.value;
  }

  /**
   * Settlement from which the provider earning was derived.
   *
   * Cross-domain reference to JourneySettlement.publicId.
   */
  public get settlementPublicId(): string {
    return this.earningCommission.settlementPublicId.value;
  }

  /**
   * Provider whose earning is subject to the commission.
   *
   * Cross-domain reference to Identity.publicId.
   */
  public get providerPublicId(): string {
    return this.earningCommission.providerPublicId.value;
  }

  // ---------------------------------------------------------------------------
  // Financial State
  // ---------------------------------------------------------------------------

  /**
   * Commission percentage snapshot used for this assessment.
   */
  public get percentage(): string {
    return this.earningCommission.percentage.value.toString();
  }

  /**
   * Provider earning before the Commercial commission.
   */
  public get baseAmount(): number {
    return this.earningCommission.baseAmount.value;
  }

  /**
   * Commission retained by the platform.
   */
  public get commissionAmount(): number {
    return this.earningCommission.commissionAmount.value;
  }

  /**
   * Provider earning after the Commercial commission.
   */
  public get netAmount(): number {
    return this.earningCommission.netAmount.value;
  }

  /**
   * Currency in which the commission is assessed.
   */
  public get currency(): string {
    return this.earningCommission.currency.value;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle State
  // ---------------------------------------------------------------------------

  /**
   * Current earning commission lifecycle status.
   */
  public get status(): CommercialEarningCommissionStatus {
    return this.earningCommission.status;
  }

  /**
   * Timestamp at which the commission was assessed.
   */
  public get assessedAt(): Date | undefined {
    return this.earningCommission.assessedAt;
  }

  /**
   * Timestamp at which the commission was cancelled.
   */
  public get cancelledAt(): Date | undefined {
    return this.earningCommission.cancelledAt;
  }

  /**
   * Aggregate creation timestamp.
   */
  public get createdAt(): Date {
    return this.earningCommission.createdAt;
  }

  /**
   * Aggregate last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.earningCommission.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Queries
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the commission is pending assessment.
   */
  public isPending(): boolean {
    return this.earningCommission.isPending();
  }

  /**
   * Indicates whether the commission has been assessed.
   */
  public isAssessed(): boolean {
    return this.earningCommission.isAssessed();
  }

  /**
   * Indicates whether the commission has been cancelled.
   */
  public isCancelled(): boolean {
    return this.earningCommission.isCancelled();
  }

  /**
   * Indicates whether the commission is currently active.
   *
   * A pending commission is considered active.
   * An assessed or cancelled commission is no longer active.
   */
  public isActive(): boolean {
    return this.earningCommission.isActive();
  }

  /**
   * Indicates whether the commission has reached a terminal state.
   */
  public isTerminal(): boolean {
    return this.earningCommission.isTerminal();
  }

  /**
   * Indicates whether the commission can currently be assessed.
   */
  public canAssess(): boolean {
    return this.earningCommission.canAssess();
  }

  /**
   * Indicates whether the commission can currently be cancelled.
   */
  public canCancel(): boolean {
    return this.earningCommission.canCancel();
  }

  /**
   * Indicates whether assessment has occurred at any point.
   */
  public hasBeenAssessed(): boolean {
    return this.earningCommission.hasBeenAssessed();
  }

  /**
   * Indicates whether cancellation has occurred at any point.
   */
  public hasBeenCancelled(): boolean {
    return this.earningCommission.hasBeenCancelled();
  }

  // ---------------------------------------------------------------------------
  // Commission Assessment
  // ---------------------------------------------------------------------------

  /**
   * Assesses the earning commission.
   *
   * Assessment is valid only while the commission is pending.
   *
   * The entity performs the intrinsic state transition while the aggregate
   * records the resulting domain event.
   */
  public assess(assessedAt: Date, correlationId: string): void {
    if (this.isAssessed()) {
      throw new CommercialEarningCommissionAlreadyAssessedException();
    }

    if (!this.canAssess()) {
      throw new CommercialEarningCommissionCannotAssessException();
    }

    this.earningCommission.assess(assessedAt);

    this.earningCommission.setUpdatedAt(assessedAt);

    this.addDomainEvent(
      new CommercialEarningCommissionAssessedEvent(
        this.id.value,
        this.publicId.value,
        this.journeyPublicId,
        this.settlementPublicId,
        this.providerPublicId,
        this.percentage,
        this.baseAmount,
        this.commissionAmount,
        this.netAmount,
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
   * Cancels the earning commission.
   *
   * Cancellation is valid only while the commission is in a cancellable
   * lifecycle state.
   *
   * The entity performs the intrinsic state transition while the aggregate
   * records the resulting domain event.
   */
  public cancel(cancelledAt: Date, correlationId: string): void {
    if (this.isCancelled()) {
      throw new CommercialEarningCommissionAlreadyCancelledException();
    }

    if (!this.canCancel()) {
      throw new CommercialEarningCommissionCannotCancelException();
    }

    this.earningCommission.cancel(cancelledAt);

    this.earningCommission.setUpdatedAt(cancelledAt);

    this.addDomainEvent(
      new CommercialEarningCommissionCancelledEvent(
        this.id.value,
        this.publicId.value,
        this.journeyPublicId,
        this.settlementPublicId,
        this.providerPublicId,
        this.percentage,
        this.baseAmount,
        this.commissionAmount,
        this.netAmount,
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
    this.earningCommission.setUpdatedAt(updatedAt);
  }
}

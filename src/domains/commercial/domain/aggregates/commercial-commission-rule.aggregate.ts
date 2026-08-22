// -----------------------------------------------------------------------------
// Commercial Commission Rule Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate root for a Commercial Commission Rule.
//
// A Commercial Commission Rule represents the commercial policy used by the
// Commercial domain when determining commission percentages.
//
// Aggregate boundary:
//
//   CommercialCommissionRuleAggregate
//              │
//              └── CommercialCommissionRuleEntity
//
// The aggregate owns:
//
// - commission rule lifecycle
// - commission policy configuration
// - effective-period management
// - rule version management
// - activation/deactivation
// - domain event recording
//
// Cross-rule concerns such as overlap detection belong outside this aggregate
// because they require comparison against other Commercial Commission Rule
// instances.
//
// Booking commissions and earning commissions are independent aggregates and
// are NOT owned by this aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { CommercialCommissionRuleEntity } from '../entities/commercial-commission-rule.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleActivatedEvent } from '../events/commercial-commission-rule-activated.event';

import { CommercialCommissionRuleCreatedEvent } from '../events/commercial-commission-rule-created.event';

import { CommercialCommissionRuleDeactivatedEvent } from '../events/commercial-commission-rule-deactivated.event';

import { CommercialCommissionRuleUpdatedEvent } from '../events/commercial-commission-rule-updated.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleAlreadyActiveException } from '../exceptions/commercial-commission-rule-already-active.exception';

import { CommercialCommissionRuleAlreadyInactiveException } from '../exceptions/commercial-commission-rule-already-inactive.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { CommercialCommissionRuleStatus } from '../value-objects/commercial-commission-rule-status.vo';

// -----------------------------------------------------------------------------
// Aggregate Props
// -----------------------------------------------------------------------------

interface CommercialCommissionRuleAggregateProps {
  commissionRule: CommercialCommissionRuleEntity;
}

// -----------------------------------------------------------------------------
// Aggregate Root
// -----------------------------------------------------------------------------

/**
 * Aggregate root for a Commercial Commission Rule.
 *
 * A Commercial Commission Rule defines the commercial policy used when
 * determining commission percentages for the Commercial domain.
 *
 * The rule is an independent aggregate root.
 *
 * The aggregate owns the commission rule entity and coordinates:
 *
 * - aggregate creation;
 * - commission rule updates;
 * - activation;
 * - deactivation;
 * - domain event recording.
 *
 * The aggregate does NOT own:
 *
 * - Booking Commission;
 * - Earning Commission;
 * - Journey;
 * - Booking;
 * - Settlement;
 * - Identity / Provider;
 * - Wallet;
 * - Treasury;
 * - Accounting.
 *
 * Those concepts belong to other bounded contexts or independent Commercial
 * aggregates and are represented through public identifiers where required.
 *
 * Cross-rule policies such as overlapping effective periods are deliberately
 * outside this aggregate because they require knowledge of other commission
 * rules.
 */
export class CommercialCommissionRuleAggregate extends AggregateRoot<CommercialCommissionRuleAggregateProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(props: CommercialCommissionRuleAggregateProps) {
    super(props);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Commercial Commission Rule aggregate.
   *
   * The supplied entity is expected to have already been created and validated
   * by the Commercial Commission Rule entity factory.
   *
   * Creation records a CommercialCommissionRuleCreatedEvent containing the
   * complete commission rule snapshot.
   *
   * The correlation ID identifies the overall operation or business flow,
   * while the optional causation ID identifies the command or event that
   * directly caused this creation.
   */
  public static create(
    commissionRule: CommercialCommissionRuleEntity,
    correlationId: string,
    causationId?: string,
  ): CommercialCommissionRuleAggregate {
    const aggregate = new CommercialCommissionRuleAggregate({
      commissionRule,
    });

    aggregate.addDomainEvent(
      new CommercialCommissionRuleCreatedEvent(
        aggregate.id.value,
        aggregate.publicId.value,
        aggregate.type.value,
        aggregate.percentage.value.toString(),
        aggregate.status.value,
        aggregate.effectiveFrom.value,
        aggregate.effectiveTo?.value,
        aggregate.version.value,
        correlationId,
        causationId,
      ),
    );

    return aggregate;
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Rehydrates an existing Commercial Commission Rule aggregate.
   *
   * Rehydration restores persisted state and does not emit domain events.
   */
  public static rehydrate(
    commissionRule: CommercialCommissionRuleEntity,
  ): CommercialCommissionRuleAggregate {
    return new CommercialCommissionRuleAggregate({
      commissionRule,
    });
  }

  // ---------------------------------------------------------------------------
  // Aggregate State
  // ---------------------------------------------------------------------------

  /**
   * Returns the Commercial Commission Rule entity owned by this aggregate.
   */
  public get commissionRule(): CommercialCommissionRuleEntity {
    return this.props.commissionRule;
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Returns the aggregate's internal identity.
   *
   * The identity is owned by the underlying commission rule entity.
   */
  public override get id() {
    return this.commissionRule.id;
  }

  /**
   * Returns the aggregate's public identity.
   *
   * The public identity is owned by the underlying commission rule entity.
   */
  public override get publicId() {
    return this.commissionRule.publicId;
  }

  // ---------------------------------------------------------------------------
  // Commission Definition
  // ---------------------------------------------------------------------------

  /**
   * Commission type governed by this rule.
   */
  public get type() {
    return this.commissionRule.type;
  }

  /**
   * Commission percentage defined by this rule.
   */
  public get percentage() {
    return this.commissionRule.percentage;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle State
  // ---------------------------------------------------------------------------

  /**
   * Current lifecycle status of the commission rule.
   */
  public get status(): CommercialCommissionRuleStatus {
    return this.commissionRule.status;
  }

  /**
   * Indicates whether the commission rule is active.
   */
  public isActive(): boolean {
    return this.commissionRule.isActive();
  }

  /**
   * Indicates whether the commission rule is inactive.
   */
  public isInactive(): boolean {
    return this.commissionRule.isInactive();
  }

  // ---------------------------------------------------------------------------
  // Effective Period
  // ---------------------------------------------------------------------------

  /**
   * Timestamp from which the commission rule becomes effective.
   */
  public get effectiveFrom() {
    return this.commissionRule.effectiveFrom;
  }

  /**
   * Optional timestamp at which the commission rule ceases to be effective.
   *
   * Undefined represents an open-ended rule.
   */
  public get effectiveTo() {
    return this.commissionRule.effectiveTo;
  }

  /**
   * Indicates whether the rule has an effective end boundary.
   */
  public hasEffectiveTo(): boolean {
    return this.commissionRule.hasEffectiveTo();
  }

  /**
   * Indicates whether the rule is open-ended.
   */
  public isOpenEnded(): boolean {
    return this.commissionRule.isOpenEnded();
  }

  /**
   * Determines whether the rule is effective at a supplied timestamp.
   */
  public isEffectiveAt(at: Date): boolean {
    return this.commissionRule.isEffectiveAt(at);
  }

  /**
   * Determines whether the rule is both active and effective at a supplied
   * timestamp.
   */
  public isActiveAt(at: Date): boolean {
    return this.commissionRule.isActiveAt(at);
  }

  /**
   * Determines whether the rule has passed its effective end timestamp.
   */
  public hasExpired(at: Date = new Date()): boolean {
    return this.commissionRule.hasExpired(at);
  }

  /**
   * Determines whether the rule has not yet reached its effective period.
   */
  public isNotYetEffective(at: Date = new Date()): boolean {
    return this.commissionRule.isNotYetEffective(at);
  }

  /**
   * Determines whether the supplied timestamp falls inside the rule's
   * effective period.
   */
  public isWithinEffectivePeriod(at: Date = new Date()): boolean {
    return this.commissionRule.isWithinEffectivePeriod(at);
  }

  // ---------------------------------------------------------------------------
  // Version
  // ---------------------------------------------------------------------------

  /**
   * Current commercial policy version.
   */
  public get version() {
    return this.commissionRule.version;
  }

  // ---------------------------------------------------------------------------
  // Policy Queries
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the commission rule's configuration can currently be
   * modified.
   */
  public canBeModified(): boolean {
    return this.commissionRule.canBeModified();
  }

  /**
   * Determines whether the rule is available for commission assessment at the
   * supplied timestamp.
   */
  public canAssess(at: Date = new Date()): boolean {
    return this.commissionRule.canAssess(at);
  }

  // ---------------------------------------------------------------------------
  // Commission Rule Update
  // ---------------------------------------------------------------------------

  /**
   * Updates the commission rule configuration.
   *
   * All intrinsic validation is delegated to the entity.
   *
   * A single update event is emitted after the requested configuration has
   * been applied.
   *
   * The entity itself guarantees that active rules cannot be modified.
   */
  public update(
    type: Parameters<CommercialCommissionRuleEntity['setType']>[0],
    percentage: Parameters<CommercialCommissionRuleEntity['setPercentage']>[0],
    effectiveFrom: Parameters<
      CommercialCommissionRuleEntity['setEffectiveFrom']
    >[0],
    effectiveTo: Parameters<
      CommercialCommissionRuleEntity['setEffectiveTo']
    >[0],
    version: Parameters<CommercialCommissionRuleEntity['setVersion']>[0],
    updatedAt: Date,
    correlationId: string,
  ): void {
    this.commissionRule.setType(type);

    this.commissionRule.setPercentage(percentage);

    this.commissionRule.setEffectiveFrom(effectiveFrom);

    this.commissionRule.setEffectiveTo(effectiveTo);

    this.commissionRule.setVersion(version);

    this.commissionRule.setUpdatedAt(updatedAt);

    this.addDomainEvent(
      new CommercialCommissionRuleUpdatedEvent(
        this.id.value,
        this.publicId.value,
        this.type.value,
        this.percentage.value.toString(),
        this.status.value,
        this.effectiveFrom.value,
        this.effectiveTo?.value,
        this.version.value,
        correlationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Commission Rule Activation
  // ---------------------------------------------------------------------------

  /**
   * Activates the commission rule.
   *
   * The entity performs the intrinsic lifecycle transition.
   *
   * Cross-rule validation, such as checking whether another active rule of the
   * same commission type overlaps this rule's effective period, belongs to an
   * application/domain service outside this aggregate.
   */
  public activate(activatedAt: Date, correlationId: string): void {
    if (this.isActive()) {
      throw new CommercialCommissionRuleAlreadyActiveException();
    }

    this.commissionRule.activate(activatedAt);

    this.commissionRule.setUpdatedAt(activatedAt);

    this.addDomainEvent(
      new CommercialCommissionRuleActivatedEvent(
        this.id.value,
        this.publicId.value,
        this.type.value,
        this.percentage.value.toString(),
        this.effectiveFrom.value,
        this.effectiveTo?.value,
        this.version.value,
        correlationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Commission Rule Deactivation
  // ---------------------------------------------------------------------------

  /**
   * Deactivates the commission rule.
   *
   * The entity performs the intrinsic lifecycle transition while the aggregate
   * records the resulting domain event.
   */
  public deactivate(deactivatedAt: Date, correlationId: string): void {
    if (this.isInactive()) {
      throw new CommercialCommissionRuleAlreadyInactiveException();
    }

    this.commissionRule.deactivate(deactivatedAt);

    this.commissionRule.setUpdatedAt(deactivatedAt);

    this.addDomainEvent(
      new CommercialCommissionRuleDeactivatedEvent(
        this.id.value,
        this.publicId.value,
        this.type.value,
        this.percentage.value.toString(),
        this.effectiveFrom.value,
        this.effectiveTo?.value,
        this.version.value,
        correlationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Creation timestamp of the commission rule.
   */
  public get createdAt(): Date {
    return this.commissionRule.createdAt;
  }

  /**
   * Last persistence update timestamp of the commission rule.
   */
  public get updatedAt(): Date {
    return this.commissionRule.updatedAt;
  }

  /**
   * Updates the aggregate audit timestamp.
   *
   * This delegates the timestamp mutation to the owned entity.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.commissionRule.setUpdatedAt(updatedAt);
  }
}

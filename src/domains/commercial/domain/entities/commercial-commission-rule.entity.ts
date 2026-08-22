// -----------------------------------------------------------------------------
// Commercial Commission Rule Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { CommercialCommissionRulePublicId } from '../value-objects/commercial-commission-rule-public-id.vo';

import type { CommercialCommissionType } from '../value-objects/commercial-commission-type.vo';

import type { CommercialCommissionPercentage } from '../value-objects/commercial-commission-percentage.vo';

import { CommercialCommissionRuleStatus } from '../value-objects/commercial-commission-rule-status.vo';

import type { CommercialCommissionRuleEffectiveFrom } from '../value-objects/commercial-commission-rule-effective-from.vo';

import type { CommercialCommissionRuleEffectiveTo } from '../value-objects/commercial-commission-rule-effective-to.vo';

import { CommercialCommissionRuleVersion } from '../value-objects/commercial-commission-rule-version.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleInvalidPeriodException } from '../exceptions/commercial-commission-rule-invalid-period.exception';

import { CommercialCommissionRuleCannotModifyActiveException } from '../exceptions/commercial-commission-rule-cannot-modify-active.exception';

import { CommercialCommissionRuleAlreadyActiveException } from '../exceptions/commercial-commission-rule-already-active.exception';

import { CommercialCommissionRuleAlreadyInactiveException } from '../exceptions/commercial-commission-rule-already-inactive.exception';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

export interface CommercialCommissionRuleProps {
  // ---------------------------------------------------------------------------
  // Commission Definition
  // ---------------------------------------------------------------------------

  /**
   * Type of commercial commission governed by this rule.
   */
  type: CommercialCommissionType;

  /**
   * Commission percentage defined by this rule.
   */
  percentage: CommercialCommissionPercentage;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current lifecycle status of the commission rule.
   */
  status: CommercialCommissionRuleStatus;

  /**
   * Timestamp from which this rule becomes effective.
   */
  effectiveFrom: CommercialCommissionRuleEffectiveFrom;

  /**
   * Optional timestamp at which this rule ceases to be effective.
   *
   * Undefined represents an open-ended rule.
   */
  effectiveTo: CommercialCommissionRuleEffectiveTo | undefined;

  // ---------------------------------------------------------------------------
  // Version
  // ---------------------------------------------------------------------------

  /**
   * Version of the commercial commission policy.
   *
   * A new policy version should generally be created when an already-used
   * commercial rule requires different configuration.
   */
  version: CommercialCommissionRuleVersion;

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
 * Commercial Commission Rule domain entity.
 *
 * This entity represents the policy/configuration used by the Commercial
 * domain when determining commission rates.
 *
 * The entity itself does NOT own booking commissions or earning commissions.
 * Those are independent domain entities and are coordinated by their
 * respective aggregates.
 *
 * Domain events and aggregate-level orchestration belong to
 * CommercialCommissionRuleAggregate, not this entity.
 *
 * Lifecycle:
 *
 * INACTIVE
 *   The rule may be configured.
 *
 * ACTIVE
 *   The rule is enabled for commercial processing.
 *
 * Once ACTIVE, the rule's commercial configuration cannot be modified.
 * If a different policy is required, a new rule version should normally be
 * created.
 */
export class CommercialCommissionRuleEntity extends Entity<
  CommercialCommissionRuleProps,
  CommercialCommissionRulePublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    props: CommercialCommissionRuleProps,
    id?: UniqueEntityId,
    publicId?: CommercialCommissionRulePublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Commercial Commission Rule.
   *
   * New rules always start INACTIVE.
   *
   * This allows the configuration to be validated before the rule becomes
   * available for commercial processing.
   */
  public static create(props: {
    publicId?: CommercialCommissionRulePublicId | undefined;

    type: CommercialCommissionType;

    percentage: CommercialCommissionPercentage;

    effectiveFrom: CommercialCommissionRuleEffectiveFrom;

    effectiveTo?: CommercialCommissionRuleEffectiveTo | undefined;

    version?: CommercialCommissionRuleVersion | undefined;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): CommercialCommissionRuleEntity {
    const now = new Date();

    const publicId = props.publicId ?? new CommercialCommissionRulePublicId();

    const version = props.version ?? CommercialCommissionRuleVersion.create(1);

    CommercialCommissionRuleEntity.assertEffectivePeriod(
      props.effectiveFrom,
      props.effectiveTo,
    );

    return new CommercialCommissionRuleEntity(
      {
        // ---------------------------------------------------------------------
        // Commission Definition
        // ---------------------------------------------------------------------

        type: props.type,

        percentage: props.percentage,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: CommercialCommissionRuleStatus.inactive(),

        effectiveFrom: props.effectiveFrom,

        effectiveTo: props.effectiveTo,

        // ---------------------------------------------------------------------
        // Version
        // ---------------------------------------------------------------------

        version,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: CommercialCommissionRuleEntity.cloneDate(
          props.createdAt ?? now,
        ),

        updatedAt: CommercialCommissionRuleEntity.cloneDate(
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
   * Rehydrates a Commercial Commission Rule from persistence.
   *
   * Rehydration restores the persisted lifecycle state exactly as stored.
   *
   * It does not activate, deactivate, or otherwise transition the entity.
   */
  public static rehydrate(
    props: CommercialCommissionRuleProps,
    id: UniqueEntityId,
    publicId: CommercialCommissionRulePublicId,
  ): CommercialCommissionRuleEntity {
    CommercialCommissionRuleEntity.assertEffectivePeriod(
      props.effectiveFrom,
      props.effectiveTo,
    );

    return new CommercialCommissionRuleEntity(
      {
        ...props,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: CommercialCommissionRuleEntity.cloneDate(props.createdAt),

        updatedAt: CommercialCommissionRuleEntity.cloneDate(props.updatedAt),
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
  public override get publicId(): CommercialCommissionRulePublicId {
    return super.publicId;
  }

  // ---------------------------------------------------------------------------
  // Commission Type
  // ---------------------------------------------------------------------------

  /**
   * Commission type governed by this rule.
   */
  public get type(): CommercialCommissionType {
    return this.props.type;
  }

  /**
   * Changes the commission type.
   *
   * Only inactive rules may be modified.
   */
  public setType(type: CommercialCommissionType): void {
    this.assertCanModify();

    if (this.props.type.equals(type)) {
      return;
    }

    this.props.type = type;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Commission Percentage
  // ---------------------------------------------------------------------------

  /**
   * Commission percentage defined by this rule.
   */
  public get percentage(): CommercialCommissionPercentage {
    return this.props.percentage;
  }

  /**
   * Changes the commission percentage.
   *
   * Only inactive rules may be modified.
   */
  public setPercentage(percentage: CommercialCommissionPercentage): void {
    this.assertCanModify();

    if (this.props.percentage.equals(percentage)) {
      return;
    }

    this.props.percentage = percentage;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Status
  // ---------------------------------------------------------------------------

  /**
   * Current lifecycle status of the rule.
   */
  public get status(): CommercialCommissionRuleStatus {
    return this.props.status;
  }

  /**
   * Determines whether the rule is active.
   */
  public isActive(): boolean {
    return this.props.status.isActive();
  }

  /**
   * Determines whether the rule is inactive.
   */
  public isInactive(): boolean {
    return this.props.status.isInactive();
  }

  /**
   * Activates the commission rule.
   *
   * Cross-rule validation, including overlap detection against another rule
   * of the same commission type, belongs outside this entity.
   */
  public activate(at: Date = new Date()): void {
    if (this.isActive()) {
      throw new CommercialCommissionRuleAlreadyActiveException();
    }

    const nextStatus = CommercialCommissionRuleStatus.active();

    if (!this.props.status.canTransitionTo(nextStatus)) {
      return;
    }

    this.props.status = nextStatus;

    this.touch(at);
  }

  /**
   * Deactivates the commission rule.
   *
   * Deactivation does not modify the commercial policy configuration or
   * version.
   */
  public deactivate(at: Date = new Date()): void {
    if (this.isInactive()) {
      throw new CommercialCommissionRuleAlreadyInactiveException();
    }

    const nextStatus = CommercialCommissionRuleStatus.inactive();

    if (!this.props.status.canTransitionTo(nextStatus)) {
      return;
    }

    this.props.status = nextStatus;

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Effective Period
  // ---------------------------------------------------------------------------

  /**
   * Timestamp from which the rule becomes effective.
   */
  public get effectiveFrom(): CommercialCommissionRuleEffectiveFrom {
    return this.props.effectiveFrom;
  }

  /**
   * Changes the beginning of the effective period.
   *
   * Only inactive rules may be modified.
   */
  public setEffectiveFrom(
    effectiveFrom: CommercialCommissionRuleEffectiveFrom,
  ): void {
    this.assertCanModify();

    CommercialCommissionRuleEntity.assertEffectivePeriod(
      effectiveFrom,
      this.props.effectiveTo,
    );

    if (this.props.effectiveFrom.equals(effectiveFrom)) {
      return;
    }

    this.props.effectiveFrom = effectiveFrom;

    this.touch();
  }

  /**
   * Timestamp at which the rule ceases to be effective.
   *
   * Undefined means the rule is open-ended.
   */
  public get effectiveTo(): CommercialCommissionRuleEffectiveTo | undefined {
    return this.props.effectiveTo;
  }

  /**
   * Changes the end of the effective period.
   *
   * Only inactive rules may be modified.
   */
  public setEffectiveTo(
    effectiveTo: CommercialCommissionRuleEffectiveTo | undefined,
  ): void {
    this.assertCanModify();

    CommercialCommissionRuleEntity.assertEffectivePeriod(
      this.props.effectiveFrom,
      effectiveTo,
    );

    if (
      CommercialCommissionRuleEntity.areValueObjectsEqual(
        this.props.effectiveTo,
        effectiveTo,
      )
    ) {
      return;
    }

    this.props.effectiveTo = effectiveTo;

    this.touch();
  }

  /**
   * Determines whether the rule has an effective end boundary.
   */
  public hasEffectiveTo(): boolean {
    return this.props.effectiveTo !== undefined;
  }

  /**
   * Determines whether the rule is open-ended.
   */
  public isOpenEnded(): boolean {
    return this.props.effectiveTo === undefined;
  }

  /**
   * Determines whether the rule is effective at a specific timestamp.
   *
   * Both effective-period boundaries are inclusive.
   */
  public isEffectiveAt(at: Date): boolean {
    const timestamp = at.getTime();

    const effectiveFrom = this.props.effectiveFrom.value.getTime();

    if (timestamp < effectiveFrom) {
      return false;
    }

    const effectiveTo = this.props.effectiveTo?.value;

    if (effectiveTo !== undefined && timestamp > effectiveTo.getTime()) {
      return false;
    }

    return true;
  }

  /**
   * Determines whether the rule is both active and effective at the supplied
   * timestamp.
   */
  public isActiveAt(at: Date): boolean {
    return this.isActive() && this.isEffectiveAt(at);
  }

  // ---------------------------------------------------------------------------
  // Version
  // ---------------------------------------------------------------------------

  /**
   * Current policy version.
   */
  public get version(): CommercialCommissionRuleVersion {
    return this.props.version;
  }

  /**
   * Changes the rule version.
   *
   * Version changes are permitted only while the rule is inactive.
   *
   * In normal application behavior, creating a new rule version should
   * generally be preferred over mutating the version of an existing rule.
   */
  public setVersion(version: CommercialCommissionRuleVersion): void {
    this.assertCanModify();

    if (this.props.version.equals(version)) {
      return;
    }

    this.props.version = version;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Policy Queries
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the rule's configuration may currently be modified.
   */
  public canBeModified(): boolean {
    return this.isInactive();
  }

  /**
   * Determines whether the rule is available for commercial commission
   * assessment at the supplied timestamp.
   */
  public canAssess(at: Date = new Date()): boolean {
    return this.isActiveAt(at);
  }

  /**
   * Determines whether the rule has passed its effective end timestamp.
   */
  public hasExpired(at: Date = new Date()): boolean {
    const effectiveTo = this.props.effectiveTo?.value;

    if (effectiveTo === undefined) {
      return false;
    }

    return at.getTime() > effectiveTo.getTime();
  }

  /**
   * Determines whether the rule has not yet reached its effective period.
   */
  public isNotYetEffective(at: Date = new Date()): boolean {
    return at.getTime() < this.props.effectiveFrom.value.getTime();
  }

  /**
   * Determines whether the supplied timestamp falls inside the rule's
   * effective period.
   */
  public isWithinEffectivePeriod(at: Date = new Date()): boolean {
    return this.isEffectiveAt(at);
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Creation timestamp.
   */
  public get createdAt(): Date {
    return CommercialCommissionRuleEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Last persistence update timestamp.
   */
  public get updatedAt(): Date {
    return CommercialCommissionRuleEntity.cloneDate(this.props.updatedAt);
  }

  /**
   * Updates the persistence audit timestamp.
   *
   * This method exists for persistence infrastructure and does not represent
   * a commercial policy transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = CommercialCommissionRuleEntity.cloneDate(updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Ensures that the rule can only be modified while inactive.
   */
  private assertCanModify(): void {
    if (this.isActive()) {
      throw new CommercialCommissionRuleCannotModifyActiveException();
    }
  }

  /**
   * Validates the effective period.
   *
   * An open-ended rule is valid.
   *
   * When an effective end exists, it must not precede the effective start.
   */
  private static assertEffectivePeriod(
    effectiveFrom: CommercialCommissionRuleEffectiveFrom,
    effectiveTo: CommercialCommissionRuleEffectiveTo | undefined,
  ): void {
    if (effectiveTo === undefined) {
      return;
    }

    if (effectiveTo.value.getTime() < effectiveFrom.value.getTime()) {
      throw new CommercialCommissionRuleInvalidPeriodException();
    }
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  /**
   * Safely compares two optional value objects.
   */
  private static areValueObjectsEqual<
    T extends {
      equals(other: T): boolean;
    },
  >(first: T | undefined, second: T | undefined): boolean {
    if (first === undefined && second === undefined) {
      return true;
    }

    if (first === undefined || second === undefined) {
      return false;
    }

    return first.equals(second);
  }

  /**
   * Creates a defensive copy of a Date instance.
   */
  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}

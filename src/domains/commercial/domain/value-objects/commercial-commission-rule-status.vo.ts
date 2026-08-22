// src/domains/commercial/domain/value-objects/commercial-commission-rule-status.vo.ts

// -----------------------------------------------------------------------------
// Commercial Commission Rule Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const COMMERCIAL_COMMISSION_RULE_STATUSES = [
  'ACTIVE',
  'INACTIVE',
] as const;

export type CommercialCommissionRuleStatusValue =
  (typeof COMMERCIAL_COMMISSION_RULE_STATUSES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialCommissionRuleStatusProps {
  value: CommercialCommissionRuleStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Commercial Commission Rule.
 *
 * ACTIVE
 *   The rule is currently eligible for resolution and assessment.
 *
 * INACTIVE
 *   The rule is no longer eligible for new commission assessments.
 *
 * Existing commission assessments retain their own percentage snapshot
 * and are therefore not affected by subsequent rule deactivation.
 */
export class CommercialCommissionRuleStatus extends ValueObject<CommercialCommissionRuleStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: CommercialCommissionRuleStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Commercial Commission Rule Status from an external/runtime
   * value.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): CommercialCommissionRuleStatus {
    const normalized = value.trim().toUpperCase();

    if (!CommercialCommissionRuleStatus.isValid(normalized)) {
      throw new Error(`Invalid Commercial Commission Rule status: ${value}`);
    }

    return new CommercialCommissionRuleStatus(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static active(): CommercialCommissionRuleStatus {
    return new CommercialCommissionRuleStatus('ACTIVE');
  }

  public static inactive(): CommercialCommissionRuleStatus {
    return new CommercialCommissionRuleStatus('INACTIVE');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(
    value: string,
  ): value is CommercialCommissionRuleStatusValue {
    return COMMERCIAL_COMMISSION_RULE_STATUSES.includes(
      value as CommercialCommissionRuleStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return this.props.value === 'ACTIVE';
  }

  public isInactive(): boolean {
    return this.props.value === 'INACTIVE';
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the rule may be used for new commission assessments.
   */
  public isApplicable(): boolean {
    return this.isActive();
  }

  /**
   * Indicates whether the rule has been deactivated.
   */
  public isTerminal(): boolean {
    return this.isInactive();
  }

  /**
   * Indicates whether the rule may be activated.
   */
  public canActivate(): boolean {
    return this.isInactive();
  }

  /**
   * Indicates whether the rule may be deactivated.
   */
  public canDeactivate(): boolean {
    return this.isActive();
  }

  // ---------------------------------------------------------------------------
  // Status Transition
  // ---------------------------------------------------------------------------

  /**
   * Determines whether this rule may transition to the supplied status.
   *
   * Aggregate methods remain responsible for enforcing the broader business
   * invariants surrounding the transition.
   */
  public canTransitionTo(status: CommercialCommissionRuleStatus): boolean {
    if (this.equals(status)) {
      return false;
    }

    if (this.isActive()) {
      return status.isInactive();
    }

    if (this.isInactive()) {
      return status.isActive();
    }

    return false;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): CommercialCommissionRuleStatusValue {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialCommissionRuleStatusProps };

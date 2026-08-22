// src/domains/commercial/domain/value-objects/commercial-commission-rule-effective-to.vo.ts

// -----------------------------------------------------------------------------
// Commercial Commission Rule Effective To
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialCommissionRuleEffectiveToProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * End of the effective period for a Commercial Commission Rule.
 *
 * Defines the point in time after which the rule is no longer eligible for
 * resolution for new commercial commission assessments.
 *
 * The value is intentionally optional at the entity/aggregate level because
 * an active rule may have an open-ended effective period.
 *
 * When present, the effective-to value must represent a valid date.
 */
export class CommercialCommissionRuleEffectiveTo extends ValueObject<CommercialCommissionRuleEffectiveToProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: Date) {
    super({ value: new Date(value.getTime()) });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an effective-to value from a Date or ISO-compatible date string.
   */
  public static create(
    value: Date | string,
  ): CommercialCommissionRuleEffectiveTo {
    const normalized = CommercialCommissionRuleEffectiveTo.normalize(value);

    CommercialCommissionRuleEffectiveTo.validate(normalized);

    return new CommercialCommissionRuleEffectiveTo(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date | string): Date {
    return value instanceof Date ? new Date(value.getTime()) : new Date(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error(
        'Commercial Commission Rule effective-to date must be a valid date',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  /**
   * Determines whether this effective-to date occurs before the supplied
   * date.
   */
  public isBefore(value: Date): boolean {
    return this.props.value.getTime() < value.getTime();
  }

  /**
   * Determines whether this effective-to date occurs after the supplied
   * date.
   */
  public isAfter(value: Date): boolean {
    return this.props.value.getTime() > value.getTime();
  }

  /**
   * Determines whether this effective-to date is equal to the supplied date.
   */
  public isEqualTo(value: Date): boolean {
    return this.props.value.getTime() === value.getTime();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): Date {
    return new Date(this.props.value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value.toISOString();
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialCommissionRuleEffectiveToProps };

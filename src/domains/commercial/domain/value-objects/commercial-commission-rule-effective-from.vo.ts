// src/domains/commercial/domain/value-objects/commercial-commission-rule-effective-from.vo.ts

// -----------------------------------------------------------------------------
// Commercial Commission Rule Effective From
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialCommissionRuleEffectiveFromProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Start of the effective period for a Commercial Commission Rule.
 *
 * Defines the point in time from which the rule may be resolved for new
 * commercial commission assessments.
 *
 * The value is stored as an immutable Date snapshot so external mutation
 * cannot alter the value object after construction.
 */
export class CommercialCommissionRuleEffectiveFrom extends ValueObject<CommercialCommissionRuleEffectiveFromProps> {
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
   * Creates an effective-from value from a Date or ISO-compatible date string.
   */
  public static create(
    value: Date | string,
  ): CommercialCommissionRuleEffectiveFrom {
    const normalized = CommercialCommissionRuleEffectiveFrom.normalize(value);

    CommercialCommissionRuleEffectiveFrom.validate(normalized);

    return new CommercialCommissionRuleEffectiveFrom(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date | string): Date {
    const normalized =
      value instanceof Date ? new Date(value.getTime()) : new Date(value);

    return normalized;
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error(
        'Commercial Commission Rule effective-from date must be a valid date',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  /**
   * Determines whether this effective-from date occurs before the supplied
   * date.
   */
  public isBefore(value: Date): boolean {
    return this.props.value.getTime() < value.getTime();
  }

  /**
   * Determines whether this effective-from date occurs after the supplied
   * date.
   */
  public isAfter(value: Date): boolean {
    return this.props.value.getTime() > value.getTime();
  }

  /**
   * Determines whether this effective-from date is equal to the supplied
   * date.
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

export type { CommercialCommissionRuleEffectiveFromProps };

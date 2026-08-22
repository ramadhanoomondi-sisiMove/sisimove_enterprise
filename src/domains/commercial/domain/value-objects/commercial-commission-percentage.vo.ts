// src/domains/commercial/domain/value-objects/commercial-commission-percentage.vo.ts

// -----------------------------------------------------------------------------
// Commercial Commission Percentage
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialCommissionPercentageProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_PERCENTAGE = 0;
const MAX_PERCENTAGE = 100;
const DECIMAL_SCALE = 2;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Percentage applied by a Commercial Commission Rule.
 *
 * The value represents a percentage rather than a fractional multiplier.
 *
 * Examples:
 *   5.00  = 5%
 *   10.50 = 10.5%
 *   100.00 = 100%
 *
 * The value is constrained to the same two-decimal precision used by the
 * persistence model's Decimal(5, 2) representation.
 */
export class CommercialCommissionPercentage extends ValueObject<CommercialCommissionPercentageProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: number) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Commercial Commission Percentage.
   *
   * Numeric strings are accepted at the boundary and normalized into a
   * number before validation.
   */
  public static create(value: number | string): CommercialCommissionPercentage {
    const normalized = typeof value === 'string' ? Number(value.trim()) : value;

    CommercialCommissionPercentage.validate(normalized);

    return new CommercialCommissionPercentage(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        'Commercial Commission Percentage must be a finite number',
      );
    }

    if (value < MIN_PERCENTAGE) {
      throw new Error(
        `Commercial Commission Percentage must not be less than ${MIN_PERCENTAGE}`,
      );
    }

    if (value > MAX_PERCENTAGE) {
      throw new Error(
        `Commercial Commission Percentage must not exceed ${MAX_PERCENTAGE}`,
      );
    }

    const scaledValue = value * 10 ** DECIMAL_SCALE;

    if (!Number.isInteger(scaledValue)) {
      throw new Error(
        `Commercial Commission Percentage must have at most ${DECIMAL_SCALE} decimal places`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isZero(): boolean {
    return this.props.value === 0;
  }

  public isPositive(): boolean {
    return this.props.value > 0;
  }

  public isMaximum(): boolean {
    return this.props.value === MAX_PERCENTAGE;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): number {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value.toFixed(DECIMAL_SCALE);
  }
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PERCENTAGE as COMMERCIAL_COMMISSION_PERCENTAGE_MIN,
  MAX_PERCENTAGE as COMMERCIAL_COMMISSION_PERCENTAGE_MAX,
  DECIMAL_SCALE as COMMERCIAL_COMMISSION_PERCENTAGE_DECIMAL_SCALE,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialCommissionPercentageProps };

// -----------------------------------------------------------------------------
// Commercial Earning Commission Base Amount
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialEarningCommissionBaseAmountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_BASE_AMOUNT = 0;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Base monetary amount used to calculate a Commercial Earning Commission.
 *
 * Represents the provider earning before the Commercial earning commission
 * is applied.
 *
 * The amount is expressed as an integer in the smallest monetary unit
 * supported by the domain.
 *
 * For example, for KES:
 *
 * 1000 = KES 1,000
 *
 * The amount originates from the settlement domain and is captured here
 * as part of the Commercial commission assessment snapshot.
 */
export class CommercialEarningCommissionBaseAmount extends ValueObject<CommercialEarningCommissionBaseAmountProps> {
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
   * Creates an earning commission base amount.
   *
   * The amount must be a finite, non-negative integer.
   */
  public static create(value: number): CommercialEarningCommissionBaseAmount {
    CommercialEarningCommissionBaseAmount.validate(value);

    return new CommercialEarningCommissionBaseAmount(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        'Commercial Earning Commission base amount must be a finite number',
      );
    }

    if (!Number.isInteger(value)) {
      throw new Error(
        'Commercial Earning Commission base amount must be an integer',
      );
    }

    if (value < MIN_BASE_AMOUNT) {
      throw new Error(
        'Commercial Earning Commission base amount cannot be negative',
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

  public isNonNegative(): boolean {
    return this.props.value >= MIN_BASE_AMOUNT;
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
    return this.props.value.toString();
  }
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export { MIN_BASE_AMOUNT as COMMERCIAL_EARNING_COMMISSION_BASE_AMOUNT_MIN };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialEarningCommissionBaseAmountProps };

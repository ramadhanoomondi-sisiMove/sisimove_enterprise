// -----------------------------------------------------------------------------
// Commercial Earning Commission Amount
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialEarningCommissionAmountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_COMMISSION_AMOUNT = 0;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Monetary amount retained by the platform as a Commercial Earning
 * Commission.
 *
 * The amount is expressed as an integer in the smallest monetary unit
 * supported by the domain.
 *
 * For example, for KES:
 *
 * 50 = KES 50
 *
 * The commission amount is derived from the provider earning base amount
 * and the commission percentage captured in the assessment snapshot.
 */
export class CommercialEarningCommissionAmount extends ValueObject<CommercialEarningCommissionAmountProps> {
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
   * Creates an earning commission amount.
   *
   * The amount must be a finite, non-negative integer.
   */
  public static create(value: number): CommercialEarningCommissionAmount {
    CommercialEarningCommissionAmount.validate(value);

    return new CommercialEarningCommissionAmount(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        'Commercial Earning Commission amount must be a finite number',
      );
    }

    if (!Number.isInteger(value)) {
      throw new Error(
        'Commercial Earning Commission amount must be an integer',
      );
    }

    if (value < MIN_COMMISSION_AMOUNT) {
      throw new Error(
        'Commercial Earning Commission amount cannot be negative',
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
    return this.props.value >= MIN_COMMISSION_AMOUNT;
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

export { MIN_COMMISSION_AMOUNT as COMMERCIAL_EARNING_COMMISSION_AMOUNT_MIN };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialEarningCommissionAmountProps };

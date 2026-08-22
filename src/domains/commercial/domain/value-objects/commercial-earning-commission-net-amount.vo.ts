// -----------------------------------------------------------------------------
// Commercial Earning Commission Net Amount
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialEarningCommissionNetAmountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_NET_AMOUNT = 0;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Provider earning remaining after the Commercial Earning Commission
 * has been deducted.
 *
 * The net amount is calculated as:
 *
 * netAmount = baseAmount - commissionAmount
 *
 * The amount is expressed as an integer in the smallest monetary unit
 * supported by the domain.
 *
 * For example, for KES:
 *
 * baseAmount       = 1000
 * commissionAmount = 50
 * netAmount        = 950
 *
 * The net amount represents the provider's earning after the Commercial
 * commission and does not represent the final ledger posting itself.
 */
export class CommercialEarningCommissionNetAmount extends ValueObject<CommercialEarningCommissionNetAmountProps> {
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
   * Creates an earning commission net amount.
   *
   * The amount must be a finite, non-negative integer.
   */
  public static create(value: number): CommercialEarningCommissionNetAmount {
    CommercialEarningCommissionNetAmount.validate(value);

    return new CommercialEarningCommissionNetAmount(value);
  }

  // ---------------------------------------------------------------------------
  // Factory From Components
  // ---------------------------------------------------------------------------

  /**
   * Calculates the provider's net earning from the settlement base amount
   * and the Commercial commission amount.
   *
   * The resulting value must not be negative.
   */
  public static fromAmounts(
    baseAmount: number,
    commissionAmount: number,
  ): CommercialEarningCommissionNetAmount {
    CommercialEarningCommissionNetAmount.validateAmount(
      baseAmount,
      'base amount',
    );

    CommercialEarningCommissionNetAmount.validateAmount(
      commissionAmount,
      'commission amount',
    );

    const netAmount = baseAmount - commissionAmount;

    CommercialEarningCommissionNetAmount.validate(netAmount);

    return new CommercialEarningCommissionNetAmount(netAmount);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        'Commercial Earning Commission net amount must be a finite number',
      );
    }

    if (!Number.isInteger(value)) {
      throw new Error(
        'Commercial Earning Commission net amount must be an integer',
      );
    }

    if (value < MIN_NET_AMOUNT) {
      throw new Error(
        'Commercial Earning Commission net amount cannot be negative',
      );
    }
  }

  private static validateAmount(value: number, name: string): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        `Commercial Earning Commission ${name} must be a finite number`,
      );
    }

    if (!Number.isInteger(value)) {
      throw new Error(
        `Commercial Earning Commission ${name} must be an integer`,
      );
    }

    if (value < 0) {
      throw new Error(
        `Commercial Earning Commission ${name} cannot be negative`,
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
    return this.props.value >= MIN_NET_AMOUNT;
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

export { MIN_NET_AMOUNT as COMMERCIAL_EARNING_COMMISSION_NET_AMOUNT_MIN };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialEarningCommissionNetAmountProps };

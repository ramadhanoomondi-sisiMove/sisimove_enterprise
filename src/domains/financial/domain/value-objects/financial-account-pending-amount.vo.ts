// -----------------------------------------------------------------------------
// Financial Account Pending Amount
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountPendingAmountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_PENDING_AMOUNT = 0;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Amount of funds currently pending in a Financial Account.
 *
 * Pending funds represent money that has entered, or is expected to enter,
 * the Financial Account but is not yet available for ordinary financial
 * operations.
 *
 * Monetary values are represented as integers in the smallest monetary
 * unit supported by the Financial domain.
 *
 * For example, for KES:
 *
 * 1000 = KES 1,000
 */
export class FinancialAccountPendingAmount extends ValueObject<FinancialAccountPendingAmountProps> {
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
   * Creates a Financial Account pending amount.
   *
   * The amount must be a finite, non-negative integer.
   */
  public static create(value: number): FinancialAccountPendingAmount {
    FinancialAccountPendingAmount.validate(value);

    return new FinancialAccountPendingAmount(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        'Financial Account pending amount must be a finite number',
      );
    }

    if (!Number.isInteger(value)) {
      throw new Error('Financial Account pending amount must be an integer');
    }

    if (value < MIN_PENDING_AMOUNT) {
      throw new Error('Financial Account pending amount cannot be negative');
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
    return this.props.value >= MIN_PENDING_AMOUNT;
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

export { MIN_PENDING_AMOUNT as FINANCIAL_ACCOUNT_PENDING_AMOUNT_MIN };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialAccountPendingAmountProps };

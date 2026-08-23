// -----------------------------------------------------------------------------
// Financial Account Available Amount
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountAvailableAmountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_AVAILABLE_AMOUNT = 0;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Amount of funds currently available for use in a Financial Account.
 *
 * The available amount represents funds that are not pending or held and
 * may therefore participate in permitted financial operations.
 *
 * Monetary values are represented as integers in the smallest monetary
 * unit supported by the Financial domain.
 *
 * For example, for KES:
 *
 * 1000 = KES 1,000
 */
export class FinancialAccountAvailableAmount extends ValueObject<FinancialAccountAvailableAmountProps> {
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
   * Creates a Financial Account available amount.
   *
   * The amount must be a finite, non-negative integer.
   */
  public static create(value: number): FinancialAccountAvailableAmount {
    FinancialAccountAvailableAmount.validate(value);

    return new FinancialAccountAvailableAmount(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        'Financial Account available amount must be a finite number',
      );
    }

    if (!Number.isInteger(value)) {
      throw new Error('Financial Account available amount must be an integer');
    }

    if (value < MIN_AVAILABLE_AMOUNT) {
      throw new Error('Financial Account available amount cannot be negative');
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
    return this.props.value >= MIN_AVAILABLE_AMOUNT;
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

export { MIN_AVAILABLE_AMOUNT as FINANCIAL_ACCOUNT_AVAILABLE_AMOUNT_MIN };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialAccountAvailableAmountProps };

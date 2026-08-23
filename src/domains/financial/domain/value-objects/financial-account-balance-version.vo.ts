// -----------------------------------------------------------------------------
// Financial Account Balance Version
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountBalanceVersionProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_BALANCE_VERSION = 1;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Version number of a Financial Account Balance.
 *
 * The balance version is used to represent the revision of the balance
 * state and supports optimistic concurrency control when the balance
 * is modified.
 *
 * A balance starts at version 1 and is incremented whenever its persisted
 * financial state is successfully updated.
 */
export class FinancialAccountBalanceVersion extends ValueObject<FinancialAccountBalanceVersionProps> {
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
   * Creates a Financial Account Balance version.
   *
   * The version must be a finite positive integer.
   */
  public static create(value: number): FinancialAccountBalanceVersion {
    FinancialAccountBalanceVersion.validate(value);

    return new FinancialAccountBalanceVersion(value);
  }

  // ---------------------------------------------------------------------------
  // Factory — Initial Version
  // ---------------------------------------------------------------------------

  /**
   * Creates the initial Financial Account Balance version.
   */
  public static initial(): FinancialAccountBalanceVersion {
    return new FinancialAccountBalanceVersion(MIN_BALANCE_VERSION);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        'Financial Account Balance version must be a finite number',
      );
    }

    if (!Number.isInteger(value)) {
      throw new Error('Financial Account Balance version must be an integer');
    }

    if (value < MIN_BALANCE_VERSION) {
      throw new Error(
        'Financial Account Balance version must be greater than or equal to 1',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isInitial(): boolean {
    return this.props.value === MIN_BALANCE_VERSION;
  }

  public isGreaterThan(version: FinancialAccountBalanceVersion): boolean {
    return this.props.value > version.value;
  }

  public isLessThan(version: FinancialAccountBalanceVersion): boolean {
    return this.props.value < version.value;
  }

  // ---------------------------------------------------------------------------
  // Operations
  // ---------------------------------------------------------------------------

  /**
   * Returns the next balance version.
   */
  public next(): FinancialAccountBalanceVersion {
    return new FinancialAccountBalanceVersion(this.props.value + 1);
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

export { MIN_BALANCE_VERSION as FINANCIAL_ACCOUNT_BALANCE_VERSION_MIN };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialAccountBalanceVersionProps };

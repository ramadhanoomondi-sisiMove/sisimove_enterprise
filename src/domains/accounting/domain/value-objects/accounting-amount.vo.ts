// -----------------------------------------------------------------------------
// Accounting Amount
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AccountingAmountValue = number;

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface AccountingAmountProps {
  value: AccountingAmountValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Accounting Amount.
 *
 * Represents a monetary amount recorded on an Accounting Journal Line.
 *
 * AccountingAmount is always a non-negative integer because the Prisma
 * accounting schema stores amounts as Int. Debit and credit direction are
 * represented separately by AccountingJournalLineType.
 *
 * Zero is allowed at the value-object level for general monetary
 * representation, while the Accounting Journal aggregate can enforce
 * stricter posting rules where required.
 */
export class AccountingAmount extends ValueObject<AccountingAmountProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AccountingAmountValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: number): AccountingAmount {
    return new AccountingAmount(AccountingAmount.validate(value));
  }

  public static zero(): AccountingAmount {
    return new AccountingAmount(0);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): number {
    if (typeof value !== 'number') {
      throw new Error('Accounting amount must be a number.');
    }

    if (!Number.isInteger(value)) {
      throw new Error('Accounting amount must be an integer.');
    }

    if (!Number.isSafeInteger(value)) {
      throw new Error('Accounting amount must be a safe integer.');
    }

    if (value < 0) {
      throw new Error('Accounting amount cannot be negative.');
    }

    if (value > AccountingAmount.MAX_SAFE_INTEGER) {
      throw new Error('Accounting amount exceeds the maximum supported value.');
    }

    return value;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isZero(): boolean {
    return this.props.value === 0;
  }

  public isPositive(): boolean {
    return this.props.value > 0;
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  public get value(): AccountingAmountValue {
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
// Exports
// -----------------------------------------------------------------------------

export type { AccountingAmountProps };

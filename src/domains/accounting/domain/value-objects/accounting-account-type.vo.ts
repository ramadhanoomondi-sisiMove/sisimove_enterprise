// -----------------------------------------------------------------------------
// Accounting Account Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AccountingAccountTypeValue =
  'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingAccountTypeProps {
  value: AccountingAccountTypeValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the accounting classification of an Accounting Account.
 *
 * Valid account types:
 *
 * - ASSET
 * - LIABILITY
 * - EQUITY
 * - REVENUE
 * - EXPENSE
 *
 * The value object validates and narrows external string input into the
 * supported Accounting Account type domain value.
 */
export class AccountingAccountType extends ValueObject<AccountingAccountTypeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly ASSET: AccountingAccountTypeValue = 'ASSET';

  public static readonly LIABILITY: AccountingAccountTypeValue = 'LIABILITY';

  public static readonly EQUITY: AccountingAccountTypeValue = 'EQUITY';

  public static readonly REVENUE: AccountingAccountTypeValue = 'REVENUE';

  public static readonly EXPENSE: AccountingAccountTypeValue = 'EXPENSE';

  private static readonly VALID_VALUES: ReadonlySet<AccountingAccountTypeValue> =
    new Set([
      AccountingAccountType.ASSET,
      AccountingAccountType.LIABILITY,
      AccountingAccountType.EQUITY,
      AccountingAccountType.REVENUE,
      AccountingAccountType.EXPENSE,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AccountingAccountTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Accounting Account type from arbitrary input.
   */
  public static create(value: string): AccountingAccountType {
    const normalized = AccountingAccountType.validate(value);

    return new AccountingAccountType(normalized);
  }

  /**
   * Creates an Accounting Account type from an already validated domain value.
   */
  public static fromValue(
    value: AccountingAccountTypeValue,
  ): AccountingAccountType {
    return new AccountingAccountType(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): AccountingAccountTypeValue {
    if (typeof value !== 'string') {
      throw new Error('Accounting account type must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !AccountingAccountType.VALID_VALUES.has(
        normalized as AccountingAccountTypeValue,
      )
    ) {
      throw new Error(`Invalid Accounting account type: ${value}`);
    }

    return normalized as AccountingAccountTypeValue;
  }

  // ---------------------------------------------------------------------------
  // Type Checks
  // ---------------------------------------------------------------------------

  public isAsset(): boolean {
    return this.props.value === AccountingAccountType.ASSET;
  }

  public isLiability(): boolean {
    return this.props.value === AccountingAccountType.LIABILITY;
  }

  public isEquity(): boolean {
    return this.props.value === AccountingAccountType.EQUITY;
  }

  public isRevenue(): boolean {
    return this.props.value === AccountingAccountType.REVENUE;
  }

  public isExpense(): boolean {
    return this.props.value === AccountingAccountType.EXPENSE;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AccountingAccountTypeValue {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { AccountingAccountTypeProps };

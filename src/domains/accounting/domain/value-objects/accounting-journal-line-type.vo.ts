// -----------------------------------------------------------------------------
// Accounting Journal Line Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AccountingJournalLineTypeValue = 'DEBIT' | 'CREDIT';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface AccountingJournalLineTypeProps {
  value: AccountingJournalLineTypeValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Accounting Journal Line Type.
 *
 * Identifies whether an Accounting Journal Line represents a debit or credit.
 *
 * The line type is part of the accounting posting model. The Accounting
 * Journal aggregate is responsible for enforcing journal-level invariants
 * such as balanced debits and credits.
 */
export class AccountingJournalLineType extends ValueObject<AccountingJournalLineTypeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly DEBIT: AccountingJournalLineTypeValue = 'DEBIT';

  public static readonly CREDIT: AccountingJournalLineTypeValue = 'CREDIT';

  private static readonly VALID_VALUES: ReadonlySet<AccountingJournalLineTypeValue> =
    new Set([
      AccountingJournalLineType.DEBIT,
      AccountingJournalLineType.CREDIT,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AccountingJournalLineTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): AccountingJournalLineType {
    const normalized = AccountingJournalLineType.validate(value);

    return new AccountingJournalLineType(normalized);
  }

  public static fromValue(
    value: AccountingJournalLineTypeValue,
  ): AccountingJournalLineType {
    return new AccountingJournalLineType(value);
  }

  public static debit(): AccountingJournalLineType {
    return new AccountingJournalLineType(AccountingJournalLineType.DEBIT);
  }

  public static credit(): AccountingJournalLineType {
    return new AccountingJournalLineType(AccountingJournalLineType.CREDIT);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): AccountingJournalLineTypeValue {
    if (typeof value !== 'string') {
      throw new Error('Accounting journal line type must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !AccountingJournalLineType.VALID_VALUES.has(
        normalized as AccountingJournalLineTypeValue,
      )
    ) {
      throw new Error(`Invalid Accounting journal line type: ${value}`);
    }

    return normalized as AccountingJournalLineTypeValue;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isDebit(): boolean {
    return this.props.value === AccountingJournalLineType.DEBIT;
  }

  public isCredit(): boolean {
    return this.props.value === AccountingJournalLineType.CREDIT;
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  public get value(): AccountingJournalLineTypeValue {
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
// Exports
// -----------------------------------------------------------------------------

export type { AccountingJournalLineTypeProps };

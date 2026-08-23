// src/domains/financial/domain/value-objects/financial-transaction-entry-type.vo.ts

// -----------------------------------------------------------------------------
// Financial Transaction Entry Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialTransactionEntryTypeProps {
  value: FinancialTransactionEntryTypeValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Direction of a Financial Transaction Entry.
 *
 * DEBIT and CREDIT describe the movement direction of the entry within the
 * Financial domain. They are intentionally separate from the transaction
 * type and balance classification.
 */
export type FinancialTransactionEntryTypeValue = 'DEBIT' | 'CREDIT';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_TRANSACTION_ENTRY_TYPES: readonly FinancialTransactionEntryTypeValue[] =
  ['DEBIT', 'CREDIT'];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the debit or credit direction of a Financial Transaction Entry.
 */
export class FinancialTransactionEntryType extends ValueObject<FinancialTransactionEntryTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialTransactionEntryTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Transaction Entry Type.
   *
   * The supplied value is normalized to uppercase before validation.
   */
  public static create(value: string): FinancialTransactionEntryType {
    const normalized = value.trim().toUpperCase();

    FinancialTransactionEntryType.validate(normalized);

    return new FinancialTransactionEntryType(
      normalized as FinancialTransactionEntryTypeValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (
      !FINANCIAL_TRANSACTION_ENTRY_TYPES.includes(
        value as FinancialTransactionEntryTypeValue,
      )
    ) {
      throw new Error(`Invalid Financial Transaction Entry Type: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isDebit(): boolean {
    return this.props.value === 'DEBIT';
  }

  public isCredit(): boolean {
    return this.props.value === 'CREDIT';
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialTransactionEntryTypeValue {
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
// Exported Constants
// -----------------------------------------------------------------------------

export { FINANCIAL_TRANSACTION_ENTRY_TYPES };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialTransactionEntryTypeProps };

// src/domains/financial/domain/value-objects/financial-transaction-type.vo.ts

// -----------------------------------------------------------------------------
// Financial Transaction Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialTransactionTypeProps {
  value: FinancialTransactionTypeValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Types of financial transactions supported by the Financial domain.
 *
 * These values represent the business purpose of a transaction rather than
 * the accounting debit/credit direction of its entries.
 */
export type FinancialTransactionTypeValue =
  | 'PAYMENT'
  | 'TRANSFER'
  | 'HOLD'
  | 'RELEASE'
  | 'CAPTURE'
  | 'SETTLEMENT'
  | 'DISBURSEMENT'
  | 'REFUND'
  | 'REVERSAL'
  | 'ADJUSTMENT';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_TRANSACTION_TYPES: readonly FinancialTransactionTypeValue[] = [
  'PAYMENT',
  'TRANSFER',
  'HOLD',
  'RELEASE',
  'CAPTURE',
  'SETTLEMENT',
  'DISBURSEMENT',
  'REFUND',
  'REVERSAL',
  'ADJUSTMENT',
];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Describes the business classification of a Financial Transaction.
 *
 * A transaction type is immutable once created.
 */
export class FinancialTransactionType extends ValueObject<FinancialTransactionTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialTransactionTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Transaction Type.
   *
   * The supplied value is normalized to uppercase before validation.
   */
  public static create(value: string): FinancialTransactionType {
    const normalized = value.trim().toUpperCase();

    FinancialTransactionType.validate(normalized);

    return new FinancialTransactionType(
      normalized as FinancialTransactionTypeValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (
      !FINANCIAL_TRANSACTION_TYPES.includes(
        value as FinancialTransactionTypeValue,
      )
    ) {
      throw new Error(`Invalid Financial Transaction Type: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPayment(): boolean {
    return this.props.value === 'PAYMENT';
  }

  public isTransfer(): boolean {
    return this.props.value === 'TRANSFER';
  }

  public isHold(): boolean {
    return this.props.value === 'HOLD';
  }

  public isRelease(): boolean {
    return this.props.value === 'RELEASE';
  }

  public isCapture(): boolean {
    return this.props.value === 'CAPTURE';
  }

  public isSettlement(): boolean {
    return this.props.value === 'SETTLEMENT';
  }

  public isDisbursement(): boolean {
    return this.props.value === 'DISBURSEMENT';
  }

  public isRefund(): boolean {
    return this.props.value === 'REFUND';
  }

  public isReversal(): boolean {
    return this.props.value === 'REVERSAL';
  }

  public isAdjustment(): boolean {
    return this.props.value === 'ADJUSTMENT';
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialTransactionTypeValue {
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

export { FINANCIAL_TRANSACTION_TYPES };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialTransactionTypeProps };

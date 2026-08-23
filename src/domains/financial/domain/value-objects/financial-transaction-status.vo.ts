// src/domains/financial/domain/value-objects/financial-transaction-status.vo.ts

// -----------------------------------------------------------------------------
// Financial Transaction Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialTransactionStatusProps {
  value: FinancialTransactionStatusValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Lifecycle states of a Financial Transaction.
 */
export type FinancialTransactionStatusValue =
  'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED' | 'CANCELLED';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_TRANSACTION_STATUSES: readonly FinancialTransactionStatusValue[] =
  ['PENDING', 'COMPLETED', 'FAILED', 'REVERSED', 'CANCELLED'];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Financial Transaction.
 *
 * The status describes where the transaction currently stands in its
 * lifecycle and is intentionally separate from the transaction type and
 * transaction entry direction.
 */
export class FinancialTransactionStatus extends ValueObject<FinancialTransactionStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialTransactionStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Transaction Status.
   *
   * The supplied value is normalized to uppercase before validation.
   */
  public static create(value: string): FinancialTransactionStatus {
    const normalized = value.trim().toUpperCase();

    FinancialTransactionStatus.validate(normalized);

    return new FinancialTransactionStatus(
      normalized as FinancialTransactionStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (
      !FINANCIAL_TRANSACTION_STATUSES.includes(
        value as FinancialTransactionStatusValue,
      )
    ) {
      throw new Error(`Invalid Financial Transaction Status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  public isCompleted(): boolean {
    return this.props.value === 'COMPLETED';
  }

  public isFailed(): boolean {
    return this.props.value === 'FAILED';
  }

  public isReversed(): boolean {
    return this.props.value === 'REVERSED';
  }

  public isCancelled(): boolean {
    return this.props.value === 'CANCELLED';
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Predicates
  // ---------------------------------------------------------------------------

  public isTerminal(): boolean {
    return (
      this.isCompleted() ||
      this.isFailed() ||
      this.isReversed() ||
      this.isCancelled()
    );
  }

  public isSuccessful(): boolean {
    return this.isCompleted();
  }

  public canTransitionTo(nextStatus: FinancialTransactionStatus): boolean {
    if (this.isTerminal()) {
      return false;
    }

    return (
      this.isPending() &&
      (nextStatus.isCompleted() ||
        nextStatus.isFailed() ||
        nextStatus.isCancelled())
    );
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialTransactionStatusValue {
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

export { FINANCIAL_TRANSACTION_STATUSES };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialTransactionStatusProps };

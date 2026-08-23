// -----------------------------------------------------------------------------
// Financial Account Withdrawal Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export enum FinancialAccountWithdrawalStatusValue {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountWithdrawalStatusProps {
  value: FinancialAccountWithdrawalStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Financial Account Withdrawal.
 *
 * The withdrawal represents the account owner's request to move funds
 * from a Financial Account to an external disbursement destination.
 *
 * Lifecycle:
 *
 * PENDING
 *   -> PROCESSING
 *   -> CANCELLED
 *
 * PROCESSING
 *   -> COMPLETED
 *   -> FAILED
 *   -> CANCELLED
 *
 * Terminal states:
 * COMPLETED
 * FAILED
 * CANCELLED
 */
export class FinancialAccountWithdrawalStatus extends ValueObject<FinancialAccountWithdrawalStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialAccountWithdrawalStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    value: FinancialAccountWithdrawalStatusValue,
  ): FinancialAccountWithdrawalStatus {
    return new FinancialAccountWithdrawalStatus(value);
  }

  public static pending(): FinancialAccountWithdrawalStatus {
    return new FinancialAccountWithdrawalStatus(
      FinancialAccountWithdrawalStatusValue.PENDING,
    );
  }

  public static processing(): FinancialAccountWithdrawalStatus {
    return new FinancialAccountWithdrawalStatus(
      FinancialAccountWithdrawalStatusValue.PROCESSING,
    );
  }

  public static completed(): FinancialAccountWithdrawalStatus {
    return new FinancialAccountWithdrawalStatus(
      FinancialAccountWithdrawalStatusValue.COMPLETED,
    );
  }

  public static failed(): FinancialAccountWithdrawalStatus {
    return new FinancialAccountWithdrawalStatus(
      FinancialAccountWithdrawalStatusValue.FAILED,
    );
  }

  public static cancelled(): FinancialAccountWithdrawalStatus {
    return new FinancialAccountWithdrawalStatus(
      FinancialAccountWithdrawalStatusValue.CANCELLED,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === FinancialAccountWithdrawalStatusValue.PENDING;
  }

  public isProcessing(): boolean {
    return (
      this.props.value === FinancialAccountWithdrawalStatusValue.PROCESSING
    );
  }

  public isCompleted(): boolean {
    return this.props.value === FinancialAccountWithdrawalStatusValue.COMPLETED;
  }

  public isFailed(): boolean {
    return this.props.value === FinancialAccountWithdrawalStatusValue.FAILED;
  }

  public isCancelled(): boolean {
    return this.props.value === FinancialAccountWithdrawalStatusValue.CANCELLED;
  }

  public isTerminal(): boolean {
    return this.isCompleted() || this.isFailed() || this.isCancelled();
  }

  // ---------------------------------------------------------------------------
  // Transition Predicates
  // ---------------------------------------------------------------------------

  public canProcess(): boolean {
    return this.isPending();
  }

  public canComplete(): boolean {
    return this.isProcessing();
  }

  public canFail(): boolean {
    return this.isProcessing();
  }

  public canCancel(): boolean {
    return this.isPending() || this.isProcessing();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialAccountWithdrawalStatusValue {
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

export type { FinancialAccountWithdrawalStatusProps };

// -----------------------------------------------------------------------------
// Financial Disbursement Status
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// PENDING
//   -> PROCESSING
//   -> CANCELLED
//
// PROCESSING
//   -> COMPLETED
//   -> FAILED
//   -> CANCELLED
//
// Terminal:
//   - COMPLETED
//   - FAILED
//   - CANCELLED
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export enum FinancialDisbursementStatusValue {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialDisbursementStatusProps {
  value: FinancialDisbursementStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class FinancialDisbursementStatus extends ValueObject<FinancialDisbursementStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialDisbursementStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    value: FinancialDisbursementStatusValue,
  ): FinancialDisbursementStatus {
    return new FinancialDisbursementStatus(value);
  }

  public static pending(): FinancialDisbursementStatus {
    return new FinancialDisbursementStatus(
      FinancialDisbursementStatusValue.PENDING,
    );
  }

  public static processing(): FinancialDisbursementStatus {
    return new FinancialDisbursementStatus(
      FinancialDisbursementStatusValue.PROCESSING,
    );
  }

  public static completed(): FinancialDisbursementStatus {
    return new FinancialDisbursementStatus(
      FinancialDisbursementStatusValue.COMPLETED,
    );
  }

  public static failed(): FinancialDisbursementStatus {
    return new FinancialDisbursementStatus(
      FinancialDisbursementStatusValue.FAILED,
    );
  }

  public static cancelled(): FinancialDisbursementStatus {
    return new FinancialDisbursementStatus(
      FinancialDisbursementStatusValue.CANCELLED,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === FinancialDisbursementStatusValue.PENDING;
  }

  public isProcessing(): boolean {
    return this.props.value === FinancialDisbursementStatusValue.PROCESSING;
  }

  public isCompleted(): boolean {
    return this.props.value === FinancialDisbursementStatusValue.COMPLETED;
  }

  public isFailed(): boolean {
    return this.props.value === FinancialDisbursementStatusValue.FAILED;
  }

  public isCancelled(): boolean {
    return this.props.value === FinancialDisbursementStatusValue.CANCELLED;
  }

  public isTerminal(): boolean {
    return this.isCompleted() || this.isFailed() || this.isCancelled();
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public canTransitionTo(nextStatus: FinancialDisbursementStatus): boolean {
    switch (this.props.value) {
      case FinancialDisbursementStatusValue.PENDING:
        return (
          nextStatus.value === FinancialDisbursementStatusValue.PROCESSING ||
          nextStatus.value === FinancialDisbursementStatusValue.CANCELLED
        );

      case FinancialDisbursementStatusValue.PROCESSING:
        return (
          nextStatus.value === FinancialDisbursementStatusValue.COMPLETED ||
          nextStatus.value === FinancialDisbursementStatusValue.FAILED ||
          nextStatus.value === FinancialDisbursementStatusValue.CANCELLED
        );

      case FinancialDisbursementStatusValue.COMPLETED:
      case FinancialDisbursementStatusValue.FAILED:
      case FinancialDisbursementStatusValue.CANCELLED:
        return false;
    }
  }

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

  public get value(): FinancialDisbursementStatusValue {
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

export type { FinancialDisbursementStatusProps };

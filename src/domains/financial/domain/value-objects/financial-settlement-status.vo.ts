// -----------------------------------------------------------------------------
// Financial Settlement Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export enum FinancialSettlementStatusValue {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialSettlementStatusProps {
  value: FinancialSettlementStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Financial Settlement.
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
export class FinancialSettlementStatus extends ValueObject<FinancialSettlementStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialSettlementStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    value: FinancialSettlementStatusValue,
  ): FinancialSettlementStatus {
    return new FinancialSettlementStatus(value);
  }

  public static pending(): FinancialSettlementStatus {
    return new FinancialSettlementStatus(
      FinancialSettlementStatusValue.PENDING,
    );
  }

  public static processing(): FinancialSettlementStatus {
    return new FinancialSettlementStatus(
      FinancialSettlementStatusValue.PROCESSING,
    );
  }

  public static completed(): FinancialSettlementStatus {
    return new FinancialSettlementStatus(
      FinancialSettlementStatusValue.COMPLETED,
    );
  }

  public static failed(): FinancialSettlementStatus {
    return new FinancialSettlementStatus(FinancialSettlementStatusValue.FAILED);
  }

  public static cancelled(): FinancialSettlementStatus {
    return new FinancialSettlementStatus(
      FinancialSettlementStatusValue.CANCELLED,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === FinancialSettlementStatusValue.PENDING;
  }

  public isProcessing(): boolean {
    return this.props.value === FinancialSettlementStatusValue.PROCESSING;
  }

  public isCompleted(): boolean {
    return this.props.value === FinancialSettlementStatusValue.COMPLETED;
  }

  public isFailed(): boolean {
    return this.props.value === FinancialSettlementStatusValue.FAILED;
  }

  public isCancelled(): boolean {
    return this.props.value === FinancialSettlementStatusValue.CANCELLED;
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

  public get value(): FinancialSettlementStatusValue {
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

export type { FinancialSettlementStatusProps };

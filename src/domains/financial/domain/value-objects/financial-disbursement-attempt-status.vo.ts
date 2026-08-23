// -----------------------------------------------------------------------------
// Financial Disbursement Attempt Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export enum FinancialDisbursementAttemptStatusValue {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialDisbursementAttemptStatusProps {
  value: FinancialDisbursementAttemptStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Financial Disbursement Attempt.
 *
 * Represents the execution state of one attempt to process a
 * Financial Disbursement through an external financial provider.
 *
 * Lifecycle:
 *
 * PENDING
 *   -> PROCESSING
 *   -> CANCELLED
 *
 * PROCESSING
 *   -> SUCCEEDED
 *   -> FAILED
 *   -> CANCELLED
 *
 * Terminal states:
 * SUCCEEDED
 * FAILED
 * CANCELLED
 */
export class FinancialDisbursementAttemptStatus extends ValueObject<FinancialDisbursementAttemptStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialDisbursementAttemptStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    value: FinancialDisbursementAttemptStatusValue,
  ): FinancialDisbursementAttemptStatus {
    return new FinancialDisbursementAttemptStatus(value);
  }

  public static pending(): FinancialDisbursementAttemptStatus {
    return new FinancialDisbursementAttemptStatus(
      FinancialDisbursementAttemptStatusValue.PENDING,
    );
  }

  public static processing(): FinancialDisbursementAttemptStatus {
    return new FinancialDisbursementAttemptStatus(
      FinancialDisbursementAttemptStatusValue.PROCESSING,
    );
  }

  public static succeeded(): FinancialDisbursementAttemptStatus {
    return new FinancialDisbursementAttemptStatus(
      FinancialDisbursementAttemptStatusValue.SUCCEEDED,
    );
  }

  public static failed(): FinancialDisbursementAttemptStatus {
    return new FinancialDisbursementAttemptStatus(
      FinancialDisbursementAttemptStatusValue.FAILED,
    );
  }

  public static cancelled(): FinancialDisbursementAttemptStatus {
    return new FinancialDisbursementAttemptStatus(
      FinancialDisbursementAttemptStatusValue.CANCELLED,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === FinancialDisbursementAttemptStatusValue.PENDING;
  }

  public isProcessing(): boolean {
    return (
      this.props.value === FinancialDisbursementAttemptStatusValue.PROCESSING
    );
  }

  public isSucceeded(): boolean {
    return (
      this.props.value === FinancialDisbursementAttemptStatusValue.SUCCEEDED
    );
  }

  public isFailed(): boolean {
    return this.props.value === FinancialDisbursementAttemptStatusValue.FAILED;
  }

  public isCancelled(): boolean {
    return (
      this.props.value === FinancialDisbursementAttemptStatusValue.CANCELLED
    );
  }

  public isTerminal(): boolean {
    return this.isSucceeded() || this.isFailed() || this.isCancelled();
  }

  // ---------------------------------------------------------------------------
  // Transition Predicates
  // ---------------------------------------------------------------------------

  public canProcess(): boolean {
    return this.isPending();
  }

  public canSucceed(): boolean {
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

  public get value(): FinancialDisbursementAttemptStatusValue {
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

export type { FinancialDisbursementAttemptStatusProps };

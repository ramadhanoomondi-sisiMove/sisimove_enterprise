// src/domains/financial/domain/value-objects/financial-payment-status.vo.ts

// -----------------------------------------------------------------------------
// Financial Payment Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialPaymentStatusProps {
  value: FinancialPaymentStatusValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Lifecycle states of a Financial Payment.
 *
 * A payment represents an attempt to move external funds into a Financial
 * Account. Its lifecycle is intentionally separate from the lifecycle of the
 * resulting Financial Transaction.
 */
export type FinancialPaymentStatusValue =
  'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENT_STATUSES: readonly FinancialPaymentStatusValue[] = [
  'PENDING',
  'PROCESSING',
  'SUCCEEDED',
  'FAILED',
  'CANCELLED',
  'EXPIRED',
];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Financial Payment.
 */
export class FinancialPaymentStatus extends ValueObject<FinancialPaymentStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialPaymentStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Payment Status.
   *
   * The supplied value is normalized to uppercase before validation.
   */
  public static create(value: string): FinancialPaymentStatus {
    const normalized = value.trim().toUpperCase();

    FinancialPaymentStatus.validate(normalized);

    return new FinancialPaymentStatus(
      normalized as FinancialPaymentStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (
      !FINANCIAL_PAYMENT_STATUSES.includes(value as FinancialPaymentStatusValue)
    ) {
      throw new Error(`Invalid Financial Payment Status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  public isProcessing(): boolean {
    return this.props.value === 'PROCESSING';
  }

  public isSucceeded(): boolean {
    return this.props.value === 'SUCCEEDED';
  }

  public isFailed(): boolean {
    return this.props.value === 'FAILED';
  }

  public isCancelled(): boolean {
    return this.props.value === 'CANCELLED';
  }

  public isExpired(): boolean {
    return this.props.value === 'EXPIRED';
  }

  public isTerminal(): boolean {
    return (
      this.isSucceeded() ||
      this.isFailed() ||
      this.isCancelled() ||
      this.isExpired()
    );
  }

  public isSuccessful(): boolean {
    return this.isSucceeded();
  }

  public canTransitionTo(nextStatus: FinancialPaymentStatus): boolean {
    if (this.isTerminal()) {
      return false;
    }

    if (this.isPending()) {
      return (
        nextStatus.isProcessing() ||
        nextStatus.isSucceeded() ||
        nextStatus.isFailed() ||
        nextStatus.isCancelled() ||
        nextStatus.isExpired()
      );
    }

    if (this.isProcessing()) {
      return (
        nextStatus.isSucceeded() ||
        nextStatus.isFailed() ||
        nextStatus.isCancelled() ||
        nextStatus.isExpired()
      );
    }

    return false;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialPaymentStatusValue {
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

export { FINANCIAL_PAYMENT_STATUSES };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialPaymentStatusProps };

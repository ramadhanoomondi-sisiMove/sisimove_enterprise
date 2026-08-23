// src/domains/financial/domain/value-objects/financial-payment-attempt-status.vo.ts

// -----------------------------------------------------------------------------
// Financial Payment Attempt Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialPaymentAttemptStatusProps {
  value: FinancialPaymentAttemptStatusValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Lifecycle states of an individual Financial Payment Attempt.
 *
 * A Payment Attempt represents one concrete processing attempt against an
 * external payment provider. A Financial Payment may contain multiple
 * attempts.
 */
export type FinancialPaymentAttemptStatusValue =
  'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENT_ATTEMPT_STATUSES: readonly FinancialPaymentAttemptStatusValue[] =
  ['PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED'];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Financial Payment Attempt.
 */
export class FinancialPaymentAttemptStatus extends ValueObject<FinancialPaymentAttemptStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialPaymentAttemptStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Payment Attempt Status.
   *
   * The supplied value is normalized to uppercase before validation.
   */
  public static create(value: string): FinancialPaymentAttemptStatus {
    const normalized = value.trim().toUpperCase();

    FinancialPaymentAttemptStatus.validate(normalized);

    return new FinancialPaymentAttemptStatus(
      normalized as FinancialPaymentAttemptStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (
      !FINANCIAL_PAYMENT_ATTEMPT_STATUSES.includes(
        value as FinancialPaymentAttemptStatusValue,
      )
    ) {
      throw new Error(`Invalid Financial Payment Attempt Status: ${value}`);
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

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Determines whether this status may transition directly to the supplied
   * next status.
   *
   * Terminal statuses cannot transition further.
   */
  public canTransitionTo(nextStatus: FinancialPaymentAttemptStatus): boolean {
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

  public get value(): FinancialPaymentAttemptStatusValue {
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

export { FINANCIAL_PAYMENT_ATTEMPT_STATUSES };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialPaymentAttemptStatusProps };

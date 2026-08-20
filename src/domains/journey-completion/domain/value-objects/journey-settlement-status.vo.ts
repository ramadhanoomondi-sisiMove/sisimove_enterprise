// -----------------------------------------------------------------------------
// Journey Settlement Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_SETTLEMENT_STATUSES = [
  'PENDING',
  'SUBMITTED',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'HELD',
  'CANCELLED',
] as const;

export type JourneySettlementStatusValue =
  (typeof JOURNEY_SETTLEMENT_STATUSES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneySettlementStatusProps {
  value: JourneySettlementStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Journey Settlement.
 *
 * PENDING
 *   The settlement has been created but has not yet been submitted
 *   for financial processing.
 *
 * SUBMITTED
 *   The settlement has been submitted to the Financial domain.
 *
 * PROCESSING
 *   The Financial domain is actively processing the settlement.
 *
 * COMPLETED
 *   The settlement has been successfully completed.
 *
 * FAILED
 *   Processing failed and the settlement requires failure handling
 *   or retry orchestration.
 *
 * HELD
 *   The settlement has been intentionally placed on hold and must not
 *   continue processing until the hold is released or otherwise resolved.
 *
 * CANCELLED
 *   The settlement has been cancelled and may no longer proceed.
 */
export class JourneySettlementStatus extends ValueObject<JourneySettlementStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneySettlementStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a settlement status from an external/runtime string.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneySettlementStatus {
    const normalized = value.trim().toUpperCase();

    if (!JourneySettlementStatus.isValid(normalized)) {
      throw new Error(`Invalid Journey Settlement status: ${value}`);
    }

    return new JourneySettlementStatus(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static pending(): JourneySettlementStatus {
    return new JourneySettlementStatus('PENDING');
  }

  public static submitted(): JourneySettlementStatus {
    return new JourneySettlementStatus('SUBMITTED');
  }

  public static processing(): JourneySettlementStatus {
    return new JourneySettlementStatus('PROCESSING');
  }

  public static completed(): JourneySettlementStatus {
    return new JourneySettlementStatus('COMPLETED');
  }

  public static failed(): JourneySettlementStatus {
    return new JourneySettlementStatus('FAILED');
  }

  public static held(): JourneySettlementStatus {
    return new JourneySettlementStatus('HELD');
  }

  public static cancelled(): JourneySettlementStatus {
    return new JourneySettlementStatus('CANCELLED');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(value: string): value is JourneySettlementStatusValue {
    return JOURNEY_SETTLEMENT_STATUSES.includes(
      value as JourneySettlementStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  public isSubmitted(): boolean {
    return this.props.value === 'SUBMITTED';
  }

  public isProcessing(): boolean {
    return this.props.value === 'PROCESSING';
  }

  public isCompleted(): boolean {
    return this.props.value === 'COMPLETED';
  }

  public isFailed(): boolean {
    return this.props.value === 'FAILED';
  }

  public isHeld(): boolean {
    return this.props.value === 'HELD';
  }

  public isCancelled(): boolean {
    return this.props.value === 'CANCELLED';
  }

  // ---------------------------------------------------------------------------
  // Semantic Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the settlement is currently in an active processing
   * state.
   */
  public isProcessingState(): boolean {
    return this.isSubmitted() || this.isProcessing();
  }

  /**
   * Indicates whether the settlement has reached a terminal state.
   */
  public isTerminal(): boolean {
    return this.isCompleted() || this.isCancelled();
  }

  /**
   * Indicates whether the settlement can be submitted to the
   * Financial domain.
   */
  public canSubmit(): boolean {
    return this.isPending() || this.isFailed();
  }

  /**
   * Indicates whether the settlement can enter financial processing.
   */
  public canProcess(): boolean {
    return this.isSubmitted();
  }

  /**
   * Indicates whether the settlement can be marked as successfully
   * completed.
   */
  public canComplete(): boolean {
    return this.isProcessing();
  }

  /**
   * Indicates whether the settlement can be marked as failed.
   */
  public canFail(): boolean {
    return this.isSubmitted() || this.isProcessing();
  }

  /**
   * Indicates whether the settlement can be placed on hold.
   */
  public canHold(): boolean {
    return this.isPending() || this.isSubmitted() || this.isProcessing();
  }

  /**
   * Indicates whether the settlement can be cancelled.
   */
  public canCancel(): boolean {
    return (
      this.isPending() || this.isSubmitted() || this.isFailed() || this.isHeld()
    );
  }

  // ---------------------------------------------------------------------------
  // Status Transition
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the settlement may transition to the supplied status.
   *
   * The aggregate remains responsible for authorization and broader
   * settlement invariants.
   */
  public canTransitionTo(status: JourneySettlementStatus): boolean {
    if (this.equals(status)) {
      return false;
    }

    if (this.isPending()) {
      return status.isSubmitted() || status.isHeld() || status.isCancelled();
    }

    if (this.isSubmitted()) {
      return (
        status.isProcessing() ||
        status.isHeld() ||
        status.isFailed() ||
        status.isCancelled()
      );
    }

    if (this.isProcessing()) {
      return (
        status.isCompleted() ||
        status.isFailed() ||
        status.isHeld() ||
        status.isCancelled()
      );
    }

    if (this.isFailed()) {
      return status.isSubmitted() || status.isHeld() || status.isCancelled();
    }

    if (this.isHeld()) {
      return status.isPending() || status.isSubmitted() || status.isCancelled();
    }

    return false;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneySettlementStatusValue {
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

export type { JourneySettlementStatusProps };

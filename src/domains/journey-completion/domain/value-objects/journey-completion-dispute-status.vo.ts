// -----------------------------------------------------------------------------
// Journey Completion Dispute Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_COMPLETION_DISPUTE_STATUSES = [
  'OPEN',
  'UNDER_REVIEW',
  'RESOLVED',
  'REJECTED',
  'WITHDRAWN',
] as const;

export type JourneyCompletionDisputeStatusValue =
  (typeof JOURNEY_COMPLETION_DISPUTE_STATUSES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyCompletionDisputeStatusProps {
  value: JourneyCompletionDisputeStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Journey Completion dispute.
 *
 * OPEN
 *   The dispute has been raised and is awaiting review.
 *
 * UNDER_REVIEW
 *   The dispute is actively being investigated or evaluated.
 *
 * RESOLVED
 *   The dispute has been resolved in the context of the Journey
 *   Completion process.
 *
 * REJECTED
 *   The dispute was reviewed and rejected.
 *
 * WITHDRAWN
 *   The member who raised the dispute withdrew it before resolution.
 */
export class JourneyCompletionDisputeStatus extends ValueObject<JourneyCompletionDisputeStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneyCompletionDisputeStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a dispute status from an external/runtime string.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneyCompletionDisputeStatus {
    const normalized = value.trim().toUpperCase();

    if (!JourneyCompletionDisputeStatus.isValid(normalized)) {
      throw new Error(`Invalid Journey Completion dispute status: ${value}`);
    }

    return new JourneyCompletionDisputeStatus(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static open(): JourneyCompletionDisputeStatus {
    return new JourneyCompletionDisputeStatus('OPEN');
  }

  public static underReview(): JourneyCompletionDisputeStatus {
    return new JourneyCompletionDisputeStatus('UNDER_REVIEW');
  }

  public static resolved(): JourneyCompletionDisputeStatus {
    return new JourneyCompletionDisputeStatus('RESOLVED');
  }

  public static rejected(): JourneyCompletionDisputeStatus {
    return new JourneyCompletionDisputeStatus('REJECTED');
  }

  public static withdrawn(): JourneyCompletionDisputeStatus {
    return new JourneyCompletionDisputeStatus('WITHDRAWN');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(
    value: string,
  ): value is JourneyCompletionDisputeStatusValue {
    return JOURNEY_COMPLETION_DISPUTE_STATUSES.includes(
      value as JourneyCompletionDisputeStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isOpen(): boolean {
    return this.props.value === 'OPEN';
  }

  public isUnderReview(): boolean {
    return this.props.value === 'UNDER_REVIEW';
  }

  public isResolved(): boolean {
    return this.props.value === 'RESOLVED';
  }

  public isRejected(): boolean {
    return this.props.value === 'REJECTED';
  }

  public isWithdrawn(): boolean {
    return this.props.value === 'WITHDRAWN';
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates that the dispute is still actively progressing through
   * the dispute workflow.
   */
  public isActive(): boolean {
    return this.isOpen() || this.isUnderReview();
  }

  /**
   * Indicates that the dispute has reached a terminal state.
   */
  public isTerminal(): boolean {
    return this.isResolved() || this.isRejected() || this.isWithdrawn();
  }

  /**
   * Indicates whether the dispute may enter review.
   */
  public canStartReview(): boolean {
    return this.isOpen();
  }

  /**
   * Indicates whether the dispute may be resolved.
   */
  public canResolve(): boolean {
    return this.isUnderReview();
  }

  /**
   * Indicates whether the dispute may be rejected.
   */
  public canReject(): boolean {
    return this.isUnderReview();
  }

  /**
   * Indicates whether the dispute may be withdrawn.
   */
  public canWithdraw(): boolean {
    return this.isOpen() || this.isUnderReview();
  }

  // ---------------------------------------------------------------------------
  // Status Transition
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the dispute may transition to the supplied status.
   *
   * This provides a domain-level transition guard. Aggregate methods remain
   * responsible for enforcing authorization and the broader business
   * invariants surrounding each transition.
   */
  public canTransitionTo(status: JourneyCompletionDisputeStatus): boolean {
    if (this.equals(status)) {
      return false;
    }

    if (this.isOpen()) {
      return status.isUnderReview() || status.isWithdrawn();
    }

    if (this.isUnderReview()) {
      return status.isResolved() || status.isRejected() || status.isWithdrawn();
    }

    return false;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneyCompletionDisputeStatusValue {
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

export type { JourneyCompletionDisputeStatusProps };

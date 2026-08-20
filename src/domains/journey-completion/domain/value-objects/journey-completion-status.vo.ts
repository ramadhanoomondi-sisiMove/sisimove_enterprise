// -----------------------------------------------------------------------------
// Journey Completion Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_COMPLETION_STATUSES = [
  'PENDING',
  'CONFIRMATION_REQUIRED',
  'CONFIRMED',
  'DISPUTED',
  'CANCELLED',
] as const;

export type JourneyCompletionStatusValue =
  (typeof JOURNEY_COMPLETION_STATUSES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyCompletionStatusProps {
  value: JourneyCompletionStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Journey Completion.
 *
 * PENDING
 *   The Journey Completion exists but completion has not yet been
 *   requested or entered into the confirmation phase.
 *
 * CONFIRMATION_REQUIRED
 *   Completion has been requested and the required parties must
 *   confirm that the Journey was completed.
 *
 * CONFIRMED
 *   The required confirmations have been received and the Journey
 *   Completion has been confirmed.
 *
 * DISPUTED
 *   Completion has been challenged by one or more parties and is
 *   subject to dispute handling.
 *
 * CANCELLED
 *   The Journey Completion process has been cancelled and can no
 *   longer proceed through normal completion.
 */
export class JourneyCompletionStatus extends ValueObject<JourneyCompletionStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneyCompletionStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Journey Completion status from an external/runtime string.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneyCompletionStatus {
    const normalized = value.trim().toUpperCase();

    if (!JourneyCompletionStatus.isValid(normalized)) {
      throw new Error(`Invalid Journey Completion status: ${value}`);
    }

    return new JourneyCompletionStatus(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static pending(): JourneyCompletionStatus {
    return new JourneyCompletionStatus('PENDING');
  }

  public static confirmationRequired(): JourneyCompletionStatus {
    return new JourneyCompletionStatus('CONFIRMATION_REQUIRED');
  }

  public static confirmed(): JourneyCompletionStatus {
    return new JourneyCompletionStatus('CONFIRMED');
  }

  public static disputed(): JourneyCompletionStatus {
    return new JourneyCompletionStatus('DISPUTED');
  }

  public static cancelled(): JourneyCompletionStatus {
    return new JourneyCompletionStatus('CANCELLED');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(value: string): value is JourneyCompletionStatusValue {
    return JOURNEY_COMPLETION_STATUSES.includes(
      value as JourneyCompletionStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  public isConfirmationRequired(): boolean {
    return this.props.value === 'CONFIRMATION_REQUIRED';
  }

  public isConfirmed(): boolean {
    return this.props.value === 'CONFIRMED';
  }

  public isDisputed(): boolean {
    return this.props.value === 'DISPUTED';
  }

  public isCancelled(): boolean {
    return this.props.value === 'CANCELLED';
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates that the completion process can still be progressed.
   */
  public isActive(): boolean {
    return (
      this.isPending() || this.isConfirmationRequired() || this.isDisputed()
    );
  }

  /**
   * Indicates that the completion process has reached a terminal state.
   */
  public isTerminal(): boolean {
    return this.isConfirmed() || this.isCancelled();
  }

  /**
   * Indicates whether completion confirmation can be requested.
   */
  public canRequestConfirmation(): boolean {
    return this.isPending();
  }

  /**
   * Indicates whether confirmation responses can currently be recorded.
   */
  public canConfirm(): boolean {
    return this.isConfirmationRequired();
  }

  /**
   * Indicates whether the completion can enter dispute handling.
   */
  public canDispute(): boolean {
    return this.isConfirmationRequired();
  }

  /**
   * Indicates whether the completion can be cancelled.
   */
  public canCancel(): boolean {
    return this.isPending() || this.isConfirmationRequired();
  }

  /**
   * Indicates whether a settlement can be created for the completion.
   */
  public canSettle(): boolean {
    return this.isConfirmed();
  }

  // ---------------------------------------------------------------------------
  // Status Transition
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the completion may transition to the supplied status.
   *
   * This provides a domain-level transition guard. Aggregate methods remain
   * responsible for enforcing the complete business invariant surrounding
   * each transition.
   */
  public canTransitionTo(status: JourneyCompletionStatus): boolean {
    if (this.equals(status)) {
      return false;
    }

    if (this.isPending()) {
      return status.isConfirmationRequired() || status.isCancelled();
    }

    if (this.isConfirmationRequired()) {
      return (
        status.isConfirmed() || status.isDisputed() || status.isCancelled()
      );
    }

    if (this.isDisputed()) {
      return status.isConfirmed() || status.isCancelled();
    }

    return false;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneyCompletionStatusValue {
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

export type { JourneyCompletionStatusProps };

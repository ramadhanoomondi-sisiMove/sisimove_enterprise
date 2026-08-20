// -----------------------------------------------------------------------------
// Journey Completion Confirmation Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_COMPLETION_CONFIRMATION_STATUSES = [
  'CONFIRMED',
  'WITHDRAWN',
] as const;

export type JourneyCompletionConfirmationStatusValue =
  (typeof JOURNEY_COMPLETION_CONFIRMATION_STATUSES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyCompletionConfirmationStatusProps {
  value: JourneyCompletionConfirmationStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Journey Completion confirmation.
 *
 * CONFIRMED
 *   The provider or passenger has confirmed that the Journey was completed.
 *
 * WITHDRAWN
 *   The previously recorded confirmation has been withdrawn.
 */
export class JourneyCompletionConfirmationStatus extends ValueObject<JourneyCompletionConfirmationStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneyCompletionConfirmationStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a confirmation status from an external/runtime string.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneyCompletionConfirmationStatus {
    const normalized = value.trim().toUpperCase();

    if (!JourneyCompletionConfirmationStatus.isValid(normalized)) {
      throw new Error(
        `Invalid Journey Completion confirmation status: ${value}`,
      );
    }

    return new JourneyCompletionConfirmationStatus(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static confirmed(): JourneyCompletionConfirmationStatus {
    return new JourneyCompletionConfirmationStatus('CONFIRMED');
  }

  public static withdrawn(): JourneyCompletionConfirmationStatus {
    return new JourneyCompletionConfirmationStatus('WITHDRAWN');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(
    value: string,
  ): value is JourneyCompletionConfirmationStatusValue {
    return JOURNEY_COMPLETION_CONFIRMATION_STATUSES.includes(
      value as JourneyCompletionConfirmationStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isConfirmed(): boolean {
    return this.props.value === 'CONFIRMED';
  }

  public isWithdrawn(): boolean {
    return this.props.value === 'WITHDRAWN';
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the confirmation is currently active and contributes
   * to the Journey Completion confirmation count.
   */
  public isActive(): boolean {
    return this.isConfirmed();
  }

  /**
   * Indicates whether the confirmation has reached its terminal state.
   */
  public isTerminal(): boolean {
    return this.isWithdrawn();
  }

  /**
   * Indicates whether the confirmation may be withdrawn.
   */
  public canWithdraw(): boolean {
    return this.isConfirmed();
  }

  // ---------------------------------------------------------------------------
  // Status Transition
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the confirmation may transition to the supplied
   * status.
   */
  public canTransitionTo(status: JourneyCompletionConfirmationStatus): boolean {
    if (this.equals(status)) {
      return false;
    }

    return this.isConfirmed() && status.isWithdrawn();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneyCompletionConfirmationStatusValue {
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

export type { JourneyCompletionConfirmationStatusProps };

// -----------------------------------------------------------------------------
// Journey Completion Confirmation Role
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_COMPLETION_CONFIRMATION_ROLES = [
  'PROVIDER',
  'PASSENGER',
] as const;

export type JourneyCompletionConfirmationRoleValue =
  (typeof JOURNEY_COMPLETION_CONFIRMATION_ROLES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyCompletionConfirmationRoleProps {
  value: JourneyCompletionConfirmationRoleValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Role of the member providing a Journey Completion confirmation.
 *
 * PROVIDER
 *   The provider confirms that the Journey was completed.
 *
 * PASSENGER
 *   A passenger confirms that the Journey was completed.
 */
export class JourneyCompletionConfirmationRole extends ValueObject<JourneyCompletionConfirmationRoleProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneyCompletionConfirmationRoleValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a confirmation role from an external/runtime string.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneyCompletionConfirmationRole {
    const normalized = value.trim().toUpperCase();

    if (!JourneyCompletionConfirmationRole.isValid(normalized)) {
      throw new Error(`Invalid Journey Completion confirmation role: ${value}`);
    }

    return new JourneyCompletionConfirmationRole(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static provider(): JourneyCompletionConfirmationRole {
    return new JourneyCompletionConfirmationRole('PROVIDER');
  }

  public static passenger(): JourneyCompletionConfirmationRole {
    return new JourneyCompletionConfirmationRole('PASSENGER');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(
    value: string,
  ): value is JourneyCompletionConfirmationRoleValue {
    return JOURNEY_COMPLETION_CONFIRMATION_ROLES.includes(
      value as JourneyCompletionConfirmationRoleValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isProvider(): boolean {
    return this.props.value === 'PROVIDER';
  }

  public isPassenger(): boolean {
    return this.props.value === 'PASSENGER';
  }

  // ---------------------------------------------------------------------------
  // Semantic Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether this confirmation represents the provider's
   * confirmation of Journey completion.
   */
  public isProviderConfirmation(): boolean {
    return this.isProvider();
  }

  /**
   * Indicates whether this confirmation represents a passenger's
   * confirmation of Journey completion.
   */
  public isPassengerConfirmation(): boolean {
    return this.isPassenger();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneyCompletionConfirmationRoleValue {
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

export type { JourneyCompletionConfirmationRoleProps };

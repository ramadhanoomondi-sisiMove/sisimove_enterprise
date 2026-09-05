// -----------------------------------------------------------------------------
// Messaging Participant Role
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type MessagingParticipantRoleValue = 'PROVIDER' | 'PASSENGER';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface MessagingParticipantRoleProps {
  value: MessagingParticipantRoleValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the role of a participant within a Messaging Conversation.
 *
 * Valid participant roles:
 *
 * - PROVIDER  — The journey provider participating in the conversation.
 * - PASSENGER — A passenger participating in the conversation.
 *
 * The value object validates and narrows external string input into the
 * supported Messaging participant role domain value.
 */
export class MessagingParticipantRole extends ValueObject<MessagingParticipantRoleProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly PROVIDER: MessagingParticipantRoleValue = 'PROVIDER';

  public static readonly PASSENGER: MessagingParticipantRoleValue = 'PASSENGER';

  private static readonly VALID_VALUES: ReadonlySet<MessagingParticipantRoleValue> =
    new Set([
      MessagingParticipantRole.PROVIDER,
      MessagingParticipantRole.PASSENGER,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: MessagingParticipantRoleValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Messaging participant role from arbitrary input.
   */
  public static create(value: string): MessagingParticipantRole {
    const normalized = MessagingParticipantRole.validate(value);

    return new MessagingParticipantRole(normalized);
  }

  /**
   * Creates a Messaging participant role from an already validated
   * domain value.
   */
  public static fromValue(
    value: MessagingParticipantRoleValue,
  ): MessagingParticipantRole {
    return new MessagingParticipantRole(value);
  }

  /**
   * Creates a Provider participant role.
   */
  public static provider(): MessagingParticipantRole {
    return new MessagingParticipantRole(MessagingParticipantRole.PROVIDER);
  }

  /**
   * Creates a Passenger participant role.
   */
  public static passenger(): MessagingParticipantRole {
    return new MessagingParticipantRole(MessagingParticipantRole.PASSENGER);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): MessagingParticipantRoleValue {
    if (typeof value !== 'string') {
      throw new Error('Messaging participant role must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !MessagingParticipantRole.VALID_VALUES.has(
        normalized as MessagingParticipantRoleValue,
      )
    ) {
      throw new Error(`Invalid Messaging participant role: ${value}`);
    }

    return normalized as MessagingParticipantRoleValue;
  }

  // ---------------------------------------------------------------------------
  // Role Checks
  // ---------------------------------------------------------------------------

  public isProvider(): boolean {
    return this.props.value === MessagingParticipantRole.PROVIDER;
  }

  public isPassenger(): boolean {
    return this.props.value === MessagingParticipantRole.PASSENGER;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): MessagingParticipantRoleValue {
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

export type { MessagingParticipantRoleProps };

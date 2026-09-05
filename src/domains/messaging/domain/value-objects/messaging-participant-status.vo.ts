// -----------------------------------------------------------------------------
// Messaging Participant Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type MessagingParticipantStatusValue = 'ACTIVE' | 'LEFT' | 'REMOVED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface MessagingParticipantStatusProps {
  value: MessagingParticipantStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Messaging Conversation Participant.
 *
 * Valid states:
 *
 * - ACTIVE  — The participant is currently participating in the conversation.
 * - LEFT    — The participant voluntarily left the conversation.
 * - REMOVED — The participant was removed from the conversation.
 *
 * The Messaging Conversation Participant entity owns lifecycle transitions.
 * This value object is responsible only for representing and validating
 * the participant status.
 */
export class MessagingParticipantStatus extends ValueObject<MessagingParticipantStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly ACTIVE: MessagingParticipantStatusValue = 'ACTIVE';

  public static readonly LEFT: MessagingParticipantStatusValue = 'LEFT';

  public static readonly REMOVED: MessagingParticipantStatusValue = 'REMOVED';

  private static readonly VALID_VALUES: ReadonlySet<MessagingParticipantStatusValue> =
    new Set([
      MessagingParticipantStatus.ACTIVE,
      MessagingParticipantStatus.LEFT,
      MessagingParticipantStatus.REMOVED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: MessagingParticipantStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Messaging participant status from arbitrary input.
   */
  public static create(value: string): MessagingParticipantStatus {
    const normalized = MessagingParticipantStatus.validate(value);

    return new MessagingParticipantStatus(normalized);
  }

  /**
   * Creates an active participant status.
   */
  public static active(): MessagingParticipantStatus {
    return new MessagingParticipantStatus(MessagingParticipantStatus.ACTIVE);
  }

  /**
   * Creates a left participant status.
   */
  public static left(): MessagingParticipantStatus {
    return new MessagingParticipantStatus(MessagingParticipantStatus.LEFT);
  }

  /**
   * Creates a removed participant status.
   */
  public static removed(): MessagingParticipantStatus {
    return new MessagingParticipantStatus(MessagingParticipantStatus.REMOVED);
  }

  /**
   * Creates a participant status from an already validated domain value.
   */
  public static fromValue(
    value: MessagingParticipantStatusValue,
  ): MessagingParticipantStatus {
    return new MessagingParticipantStatus(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): MessagingParticipantStatusValue {
    if (typeof value !== 'string') {
      throw new Error('Messaging participant status must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !MessagingParticipantStatus.VALID_VALUES.has(
        normalized as MessagingParticipantStatusValue,
      )
    ) {
      throw new Error(`Invalid Messaging participant status: ${value}`);
    }

    return normalized as MessagingParticipantStatusValue;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return this.props.value === MessagingParticipantStatus.ACTIVE;
  }

  public hasLeft(): boolean {
    return this.props.value === MessagingParticipantStatus.LEFT;
  }

  public isRemoved(): boolean {
    return this.props.value === MessagingParticipantStatus.REMOVED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): MessagingParticipantStatusValue {
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

export type { MessagingParticipantStatusProps };

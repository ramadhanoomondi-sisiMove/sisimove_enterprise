// -----------------------------------------------------------------------------
// Messaging Conversation Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type MessagingConversationStatusValue = 'ACTIVE' | 'CLOSED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface MessagingConversationStatusProps {
  value: MessagingConversationStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Messaging Conversation.
 *
 * Valid states:
 *
 * - ACTIVE — The conversation is available for messaging activity.
 * - CLOSED — The conversation has been closed and is no longer available
 *            for normal messaging activity.
 *
 * The Messaging Conversation entity owns lifecycle transitions.
 * This value object is responsible only for representing and validating
 * the status value.
 */
export class MessagingConversationStatus extends ValueObject<MessagingConversationStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly ACTIVE: MessagingConversationStatusValue = 'ACTIVE';

  public static readonly CLOSED: MessagingConversationStatusValue = 'CLOSED';

  private static readonly VALID_VALUES: ReadonlySet<MessagingConversationStatusValue> =
    new Set([
      MessagingConversationStatus.ACTIVE,
      MessagingConversationStatus.CLOSED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: MessagingConversationStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Messaging Conversation status from arbitrary input.
   */
  public static create(value: string): MessagingConversationStatus {
    const normalized = MessagingConversationStatus.validate(value);

    return new MessagingConversationStatus(normalized);
  }

  /**
   * Creates an active Messaging Conversation status.
   */
  public static active(): MessagingConversationStatus {
    return new MessagingConversationStatus(MessagingConversationStatus.ACTIVE);
  }

  /**
   * Creates a closed Messaging Conversation status.
   */
  public static closed(): MessagingConversationStatus {
    return new MessagingConversationStatus(MessagingConversationStatus.CLOSED);
  }

  /**
   * Creates a Messaging Conversation status from an already validated
   * domain value.
   */
  public static fromValue(
    value: MessagingConversationStatusValue,
  ): MessagingConversationStatus {
    return new MessagingConversationStatus(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): MessagingConversationStatusValue {
    if (typeof value !== 'string') {
      throw new Error('Messaging conversation status must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !MessagingConversationStatus.VALID_VALUES.has(
        normalized as MessagingConversationStatusValue,
      )
    ) {
      throw new Error(`Invalid Messaging conversation status: ${value}`);
    }

    return normalized as MessagingConversationStatusValue;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return this.props.value === MessagingConversationStatus.ACTIVE;
  }

  public isClosed(): boolean {
    return this.props.value === MessagingConversationStatus.CLOSED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): MessagingConversationStatusValue {
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

export type { MessagingConversationStatusProps };

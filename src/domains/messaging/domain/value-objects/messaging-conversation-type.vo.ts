// -----------------------------------------------------------------------------
// Messaging Conversation Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type MessagingConversationTypeValue = 'JOURNEY' | 'DIRECT';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface MessagingConversationTypeProps {
  value: MessagingConversationTypeValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the type of a Messaging Conversation.
 *
 * Valid conversation types:
 *
 * - JOURNEY — A conversation associated with a Journey.
 * - DIRECT  — A direct conversation between participants.
 *
 * The value object validates and narrows external string input into the
 * supported Messaging Conversation type domain value.
 */
export class MessagingConversationType extends ValueObject<MessagingConversationTypeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly JOURNEY: MessagingConversationTypeValue = 'JOURNEY';

  public static readonly DIRECT: MessagingConversationTypeValue = 'DIRECT';

  private static readonly VALID_VALUES: ReadonlySet<MessagingConversationTypeValue> =
    new Set([
      MessagingConversationType.JOURNEY,
      MessagingConversationType.DIRECT,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: MessagingConversationTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Messaging Conversation type from arbitrary input.
   */
  public static create(value: string): MessagingConversationType {
    const normalized = MessagingConversationType.validate(value);

    return new MessagingConversationType(normalized);
  }

  /**
   * Creates a Messaging Conversation type from an already validated
   * domain value.
   */
  public static fromValue(
    value: MessagingConversationTypeValue,
  ): MessagingConversationType {
    return new MessagingConversationType(value);
  }

  /**
   * Creates a Journey conversation type.
   */
  public static journey(): MessagingConversationType {
    return new MessagingConversationType(MessagingConversationType.JOURNEY);
  }

  /**
   * Creates a Direct conversation type.
   */
  public static direct(): MessagingConversationType {
    return new MessagingConversationType(MessagingConversationType.DIRECT);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): MessagingConversationTypeValue {
    if (typeof value !== 'string') {
      throw new Error('Messaging conversation type must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !MessagingConversationType.VALID_VALUES.has(
        normalized as MessagingConversationTypeValue,
      )
    ) {
      throw new Error(`Invalid Messaging conversation type: ${value}`);
    }

    return normalized as MessagingConversationTypeValue;
  }

  // ---------------------------------------------------------------------------
  // Type Checks
  // ---------------------------------------------------------------------------

  public isJourney(): boolean {
    return this.props.value === MessagingConversationType.JOURNEY;
  }

  public isDirect(): boolean {
    return this.props.value === MessagingConversationType.DIRECT;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): MessagingConversationTypeValue {
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

export type { MessagingConversationTypeProps };

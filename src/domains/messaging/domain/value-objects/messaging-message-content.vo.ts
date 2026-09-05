// -----------------------------------------------------------------------------
// Messaging Message Content
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface MessagingMessageContentProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the textual content of a Messaging Message.
 *
 * The value object is responsible for:
 *
 * - validating the supplied value;
 * - trimming surrounding whitespace;
 * - rejecting empty content;
 * - enforcing the maximum supported content length;
 * - representing immutable message content.
 *
 * Whether content is required is determined by the Messaging Message entity
 * based on the message type.
 */
export class MessagingMessageContent extends ValueObject<MessagingMessageContentProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MIN_LENGTH = 1;

  private static readonly MAX_LENGTH = 5000;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates Messaging Message content.
   *
   * Validation and normalization remain inside the domain value object.
   */
  public static create(value: string): MessagingMessageContent {
    return new MessagingMessageContent(
      MessagingMessageContent.validateAndNormalize(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateAndNormalize(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Messaging message content must be a string.');
    }

    const normalized = value.trim();

    if (normalized.length < MessagingMessageContent.MIN_LENGTH) {
      throw new Error('Messaging message content cannot be empty.');
    }

    if (normalized.length > MessagingMessageContent.MAX_LENGTH) {
      throw new Error(
        `Messaging message content cannot exceed ${MessagingMessageContent.MAX_LENGTH} characters.`,
      );
    }

    return normalized;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): string {
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

export type { MessagingMessageContentProps };

// -----------------------------------------------------------------------------
// Messaging Message Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type MessagingMessageTypeValue = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface MessagingMessageTypeProps {
  value: MessagingMessageTypeValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the type of a Messaging Message.
 *
 * Valid message types:
 *
 * - TEXT   — A text message.
 * - IMAGE  — An image message referencing an Asset.
 * - FILE   — A file message referencing an Asset.
 * - SYSTEM — A system-generated message.
 *
 * The value object validates and narrows external string input into the
 * supported Messaging Message type domain value.
 */
export class MessagingMessageType extends ValueObject<MessagingMessageTypeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly TEXT: MessagingMessageTypeValue = 'TEXT';

  public static readonly IMAGE: MessagingMessageTypeValue = 'IMAGE';

  public static readonly FILE: MessagingMessageTypeValue = 'FILE';

  public static readonly SYSTEM: MessagingMessageTypeValue = 'SYSTEM';

  private static readonly VALID_VALUES: ReadonlySet<MessagingMessageTypeValue> =
    new Set([
      MessagingMessageType.TEXT,
      MessagingMessageType.IMAGE,
      MessagingMessageType.FILE,
      MessagingMessageType.SYSTEM,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: MessagingMessageTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Messaging Message type from arbitrary input.
   */
  public static create(value: string): MessagingMessageType {
    const normalized = MessagingMessageType.validate(value);

    return new MessagingMessageType(normalized);
  }

  /**
   * Creates a Messaging Message type from an already validated
   * domain value.
   */
  public static fromValue(
    value: MessagingMessageTypeValue,
  ): MessagingMessageType {
    return new MessagingMessageType(value);
  }

  /**
   * Creates a Text message type.
   */
  public static text(): MessagingMessageType {
    return new MessagingMessageType(MessagingMessageType.TEXT);
  }

  /**
   * Creates an Image message type.
   */
  public static image(): MessagingMessageType {
    return new MessagingMessageType(MessagingMessageType.IMAGE);
  }

  /**
   * Creates a File message type.
   */
  public static file(): MessagingMessageType {
    return new MessagingMessageType(MessagingMessageType.FILE);
  }

  /**
   * Creates a System message type.
   */
  public static system(): MessagingMessageType {
    return new MessagingMessageType(MessagingMessageType.SYSTEM);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): MessagingMessageTypeValue {
    if (typeof value !== 'string') {
      throw new Error('Messaging message type must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !MessagingMessageType.VALID_VALUES.has(
        normalized as MessagingMessageTypeValue,
      )
    ) {
      throw new Error(`Invalid Messaging message type: ${value}`);
    }

    return normalized as MessagingMessageTypeValue;
  }

  // ---------------------------------------------------------------------------
  // Type Checks
  // ---------------------------------------------------------------------------

  public isText(): boolean {
    return this.props.value === MessagingMessageType.TEXT;
  }

  public isImage(): boolean {
    return this.props.value === MessagingMessageType.IMAGE;
  }

  public isFile(): boolean {
    return this.props.value === MessagingMessageType.FILE;
  }

  public isSystem(): boolean {
    return this.props.value === MessagingMessageType.SYSTEM;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): MessagingMessageTypeValue {
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

export type { MessagingMessageTypeProps };

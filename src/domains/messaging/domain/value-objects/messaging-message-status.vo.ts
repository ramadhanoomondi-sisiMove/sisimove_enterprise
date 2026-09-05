// -----------------------------------------------------------------------------
// Messaging Message Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type MessagingMessageStatusValue =
  'SENT' | 'EDITED' | 'DELETED' | 'MODERATED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface MessagingMessageStatusProps {
  value: MessagingMessageStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Messaging Message.
 *
 * Valid states:
 *
 * - SENT      — The message has been sent.
 * - EDITED    — The message has been edited.
 * - DELETED   — The message has been deleted.
 * - MODERATED — The message has been moderated.
 *
 * The Messaging Message entity owns lifecycle transitions.
 * This value object is responsible only for representing and validating
 * the message status.
 */
export class MessagingMessageStatus extends ValueObject<MessagingMessageStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly SENT: MessagingMessageStatusValue = 'SENT';

  public static readonly EDITED: MessagingMessageStatusValue = 'EDITED';

  public static readonly DELETED: MessagingMessageStatusValue = 'DELETED';

  public static readonly MODERATED: MessagingMessageStatusValue = 'MODERATED';

  private static readonly VALID_VALUES: ReadonlySet<MessagingMessageStatusValue> =
    new Set([
      MessagingMessageStatus.SENT,
      MessagingMessageStatus.EDITED,
      MessagingMessageStatus.DELETED,
      MessagingMessageStatus.MODERATED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: MessagingMessageStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Messaging Message status from arbitrary input.
   */
  public static create(value: string): MessagingMessageStatus {
    const normalized = MessagingMessageStatus.validate(value);

    return new MessagingMessageStatus(normalized);
  }

  /**
   * Creates a sent message status.
   */
  public static sent(): MessagingMessageStatus {
    return new MessagingMessageStatus(MessagingMessageStatus.SENT);
  }

  /**
   * Creates an edited message status.
   */
  public static edited(): MessagingMessageStatus {
    return new MessagingMessageStatus(MessagingMessageStatus.EDITED);
  }

  /**
   * Creates a deleted message status.
   */
  public static deleted(): MessagingMessageStatus {
    return new MessagingMessageStatus(MessagingMessageStatus.DELETED);
  }

  /**
   * Creates a moderated message status.
   */
  public static moderated(): MessagingMessageStatus {
    return new MessagingMessageStatus(MessagingMessageStatus.MODERATED);
  }

  /**
   * Creates a Messaging Message status from an already validated
   * domain value.
   */
  public static fromValue(
    value: MessagingMessageStatusValue,
  ): MessagingMessageStatus {
    return new MessagingMessageStatus(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): MessagingMessageStatusValue {
    if (typeof value !== 'string') {
      throw new Error('Messaging message status must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !MessagingMessageStatus.VALID_VALUES.has(
        normalized as MessagingMessageStatusValue,
      )
    ) {
      throw new Error(`Invalid Messaging message status: ${value}`);
    }

    return normalized as MessagingMessageStatusValue;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isSent(): boolean {
    return this.props.value === MessagingMessageStatus.SENT;
  }

  public isEdited(): boolean {
    return this.props.value === MessagingMessageStatus.EDITED;
  }

  public isDeleted(): boolean {
    return this.props.value === MessagingMessageStatus.DELETED;
  }

  public isModerated(): boolean {
    return this.props.value === MessagingMessageStatus.MODERATED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): MessagingMessageStatusValue {
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

export type { MessagingMessageStatusProps };

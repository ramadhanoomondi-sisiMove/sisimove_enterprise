// -----------------------------------------------------------------------------
// Support Case Message Sender Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseMessageSenderPublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of the Identity member who sent a Support Case Message.
 *
 * The Identity aggregate belongs to the Identity domain.
 *
 * Support stores only the member's public identity and does not own,
 * generate, or persist the Identity aggregate.
 *
 * This is an opaque cross-domain reference.
 */
export class SupportCaseMessageSenderPublicId extends ValueObject<SupportCaseMessageSenderPublicIdProps> {
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
   * Creates a Support Case Message sender public ID reference.
   */
  public static create(value: string): SupportCaseMessageSenderPublicId {
    return new SupportCaseMessageSenderPublicId(
      SupportCaseMessageSenderPublicId.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error(
        'Support case message sender public ID must be a string.',
      );
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Support case message sender public ID cannot be empty.');
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

export type { SupportCaseMessageSenderPublicIdProps };

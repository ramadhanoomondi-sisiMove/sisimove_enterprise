// -----------------------------------------------------------------------------
// Support Case Message Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseMessageTypeProps {
  value: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the type of content carried by a Support Case Message.
 *
 * Supported message types:
 *
 * - TEXT
 * - IMAGE
 * - FILE
 * - SYSTEM
 *
 * The type determines how the message content and optional Asset reference
 * are interpreted within the Support domain.
 */
export class SupportCaseMessageType extends ValueObject<SupportCaseMessageTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: SupportCaseMessageTypeProps['value']) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Support Case Message type.
   */
  public static create(value: string): SupportCaseMessageType {
    return new SupportCaseMessageType(SupportCaseMessageType.validate(value));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): SupportCaseMessageTypeProps['value'] {
    if (typeof value !== 'string') {
      throw new Error('Support case message type must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    const allowed: SupportCaseMessageTypeProps['value'][] = [
      'TEXT',
      'IMAGE',
      'FILE',
      'SYSTEM',
    ];

    if (!allowed.includes(normalized as SupportCaseMessageTypeProps['value'])) {
      throw new Error(`Invalid support case message type: ${value}.`);
    }

    return normalized as SupportCaseMessageTypeProps['value'];
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): SupportCaseMessageTypeProps['value'] {
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

export type { SupportCaseMessageTypeProps };

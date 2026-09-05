// -----------------------------------------------------------------------------
// Messaging Asset Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface MessagingAssetPublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of an Asset referenced by the Messaging domain.
 *
 * The Asset belongs to the Identity/Asset infrastructure boundary.
 * Messaging stores only its public identity and does not own or generate it.
 */
export class MessagingAssetPublicId extends ValueObject<MessagingAssetPublicIdProps> {
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
   * Creates an Asset public ID reference.
   */
  public static create(value: string): MessagingAssetPublicId {
    return new MessagingAssetPublicId(MessagingAssetPublicId.validate(value));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Messaging asset public ID must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Messaging asset public ID cannot be empty.');
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

export type { MessagingAssetPublicIdProps };

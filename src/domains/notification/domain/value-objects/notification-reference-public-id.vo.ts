// -----------------------------------------------------------------------------
// Notification Reference Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface NotificationReferencePublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of a domain resource referenced by a Notification.
 *
 * The referenced resource belongs to another domain.
 *
 * Notification stores only its public identity and does not own,
 * generate, or persist the referenced aggregate.
 *
 * This is an opaque cross-domain reference.
 */
export class NotificationReferencePublicId extends ValueObject<NotificationReferencePublicIdProps> {
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
   * Creates a Notification reference public ID.
   */
  public static create(value: string): NotificationReferencePublicId {
    return new NotificationReferencePublicId(
      NotificationReferencePublicId.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Notification reference public ID must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Notification reference public ID cannot be empty.');
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

export type { NotificationReferencePublicIdProps };

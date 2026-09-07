// -----------------------------------------------------------------------------
// Notification Provider Reference
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface NotificationProviderReferenceProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the provider-specific reference associated with a
 * Notification Delivery.
 *
 * Examples include:
 *
 * - a push provider message identifier;
 * - an email provider message identifier;
 * - an SMS provider message identifier.
 *
 * The Notification domain does not interpret or own the provider's
 * identifier format. It only stores a validated non-empty reference.
 */
export class NotificationProviderReference extends ValueObject<NotificationProviderReferenceProps> {
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
   * Creates a Notification Provider Reference.
   */
  public static create(value: string): NotificationProviderReference {
    return new NotificationProviderReference(
      NotificationProviderReference.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Notification provider reference must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Notification provider reference cannot be empty.');
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

export type { NotificationProviderReferenceProps };

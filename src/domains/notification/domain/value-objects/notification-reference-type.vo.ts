// -----------------------------------------------------------------------------
// Notification Reference Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface NotificationReferenceTypeProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the type of domain resource referenced by a Notification.
 *
 * Examples:
 *
 * - Journey
 * - JourneyBooking
 * - JourneyCompletion
 * - JourneyCompletionDispute
 * - FinancialPayment
 * - SupportCase
 *
 * The referenced resource belongs to another domain.
 *
 * Notification does not own, validate, or create the referenced resource.
 * This value object only validates the reference type metadata.
 */
export class NotificationReferenceType extends ValueObject<NotificationReferenceTypeProps> {
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
   * Creates a Notification reference type.
   */
  public static create(value: string): NotificationReferenceType {
    return new NotificationReferenceType(
      NotificationReferenceType.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Notification reference type must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Notification reference type cannot be empty.');
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

export type { NotificationReferenceTypeProps };

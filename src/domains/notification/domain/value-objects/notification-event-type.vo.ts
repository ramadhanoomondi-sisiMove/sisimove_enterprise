// -----------------------------------------------------------------------------
// Notification Event Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface NotificationEventTypeProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the type of domain event that caused a Notification.
 *
 * Examples:
 *
 * - JourneyPublished
 * - BookingCreated
 * - BookingConfirmed
 * - PaymentCompleted
 * - WalletCredited
 * - VerificationCompleted
 * - MessageReceived
 * - SupportCaseUpdated
 *
 * The originating event belongs to another domain or bounded context.
 *
 * Notification does not own or interpret the event's domain behavior.
 * This value object only validates the event type metadata.
 */
export class NotificationEventType extends ValueObject<NotificationEventTypeProps> {
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
   * Creates a Notification event type.
   */
  public static create(value: string): NotificationEventType {
    return new NotificationEventType(NotificationEventType.validate(value));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Notification event type must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Notification event type cannot be empty.');
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

export type { NotificationEventTypeProps };

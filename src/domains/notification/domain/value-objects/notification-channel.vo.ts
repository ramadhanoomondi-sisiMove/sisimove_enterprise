// -----------------------------------------------------------------------------
// Notification Channel
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type NotificationChannelValue = 'IN_APP' | 'PUSH' | 'EMAIL' | 'SMS';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface NotificationChannelProps {
  value: NotificationChannelValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the delivery channel used for a Notification Delivery.
 *
 * Valid channels:
 *
 * - IN_APP — The notification is delivered within the application.
 * - PUSH   — The notification is delivered through push notification services.
 * - EMAIL  — The notification is delivered through email.
 * - SMS    — The notification is delivered through SMS.
 *
 * The Notification Delivery entity owns delivery lifecycle transitions.
 * This value object is responsible only for representing and validating
 * the delivery channel value.
 */
export class NotificationChannel extends ValueObject<NotificationChannelProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly IN_APP: NotificationChannelValue = 'IN_APP';

  public static readonly PUSH: NotificationChannelValue = 'PUSH';

  public static readonly EMAIL: NotificationChannelValue = 'EMAIL';

  public static readonly SMS: NotificationChannelValue = 'SMS';

  private static readonly VALID_VALUES: ReadonlySet<NotificationChannelValue> =
    new Set([
      NotificationChannel.IN_APP,
      NotificationChannel.PUSH,
      NotificationChannel.EMAIL,
      NotificationChannel.SMS,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: NotificationChannelValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Notification Channel from arbitrary input.
   */
  public static create(value: string): NotificationChannel {
    const normalized = NotificationChannel.validate(value);

    return new NotificationChannel(normalized);
  }

  /**
   * Creates a Notification Channel from an already validated domain value.
   */
  public static fromValue(
    value: NotificationChannelValue,
  ): NotificationChannel {
    return new NotificationChannel(value);
  }

  /**
   * Creates an in-app notification channel.
   */
  public static inApp(): NotificationChannel {
    return new NotificationChannel(NotificationChannel.IN_APP);
  }

  /**
   * Creates a push notification channel.
   */
  public static push(): NotificationChannel {
    return new NotificationChannel(NotificationChannel.PUSH);
  }

  /**
   * Creates an email notification channel.
   */
  public static email(): NotificationChannel {
    return new NotificationChannel(NotificationChannel.EMAIL);
  }

  /**
   * Creates an SMS notification channel.
   */
  public static sms(): NotificationChannel {
    return new NotificationChannel(NotificationChannel.SMS);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): NotificationChannelValue {
    if (typeof value !== 'string') {
      throw new Error('Notification channel must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !NotificationChannel.VALID_VALUES.has(
        normalized as NotificationChannelValue,
      )
    ) {
      throw new Error(`Invalid Notification channel: ${value}`);
    }

    return normalized as NotificationChannelValue;
  }

  // ---------------------------------------------------------------------------
  // Channel Checks
  // ---------------------------------------------------------------------------

  public isInApp(): boolean {
    return this.props.value === NotificationChannel.IN_APP;
  }

  public isPush(): boolean {
    return this.props.value === NotificationChannel.PUSH;
  }

  public isEmail(): boolean {
    return this.props.value === NotificationChannel.EMAIL;
  }

  public isSms(): boolean {
    return this.props.value === NotificationChannel.SMS;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): NotificationChannelValue {
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

export type { NotificationChannelProps };

// -----------------------------------------------------------------------------
// Notification Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type NotificationTypeValue =
  | 'JOURNEY'
  | 'BOOKING'
  | 'PAYMENT'
  | 'WALLET'
  | 'TRUST'
  | 'VERIFICATION'
  | 'MESSAGE'
  | 'SUPPORT'
  | 'SYSTEM';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface NotificationTypeProps {
  value: NotificationTypeValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the category of a Notification.
 *
 * Valid notification types:
 *
 * - JOURNEY      — Journey-related activity.
 * - BOOKING      — Booking-related activity.
 * - PAYMENT      — Payment-related activity.
 * - WALLET       — Wallet-related activity.
 * - TRUST        — Trust and reputation activity.
 * - VERIFICATION — Identity or account verification activity.
 * - MESSAGE      — Messaging activity.
 * - SUPPORT      — Support-related activity.
 * - SYSTEM       — Platform or system activity.
 *
 * This value object validates and narrows external string input into
 * the supported Notification type domain value.
 */
export class NotificationType extends ValueObject<NotificationTypeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly JOURNEY: NotificationTypeValue = 'JOURNEY';

  public static readonly BOOKING: NotificationTypeValue = 'BOOKING';

  public static readonly PAYMENT: NotificationTypeValue = 'PAYMENT';

  public static readonly WALLET: NotificationTypeValue = 'WALLET';

  public static readonly TRUST: NotificationTypeValue = 'TRUST';

  public static readonly VERIFICATION: NotificationTypeValue = 'VERIFICATION';

  public static readonly MESSAGE: NotificationTypeValue = 'MESSAGE';

  public static readonly SUPPORT: NotificationTypeValue = 'SUPPORT';

  public static readonly SYSTEM: NotificationTypeValue = 'SYSTEM';

  private static readonly VALID_VALUES: ReadonlySet<NotificationTypeValue> =
    new Set([
      NotificationType.JOURNEY,
      NotificationType.BOOKING,
      NotificationType.PAYMENT,
      NotificationType.WALLET,
      NotificationType.TRUST,
      NotificationType.VERIFICATION,
      NotificationType.MESSAGE,
      NotificationType.SUPPORT,
      NotificationType.SYSTEM,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: NotificationTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Notification type from arbitrary input.
   */
  public static create(value: string): NotificationType {
    const normalized = NotificationType.validate(value);

    return new NotificationType(normalized);
  }

  /**
   * Creates a Notification type from an already validated domain value.
   */
  public static fromValue(value: NotificationTypeValue): NotificationType {
    return new NotificationType(value);
  }

  /**
   * Creates a Journey notification type.
   */
  public static journey(): NotificationType {
    return new NotificationType(NotificationType.JOURNEY);
  }

  /**
   * Creates a Booking notification type.
   */
  public static booking(): NotificationType {
    return new NotificationType(NotificationType.BOOKING);
  }

  /**
   * Creates a Payment notification type.
   */
  public static payment(): NotificationType {
    return new NotificationType(NotificationType.PAYMENT);
  }

  /**
   * Creates a Wallet notification type.
   */
  public static wallet(): NotificationType {
    return new NotificationType(NotificationType.WALLET);
  }

  /**
   * Creates a Trust notification type.
   */
  public static trust(): NotificationType {
    return new NotificationType(NotificationType.TRUST);
  }

  /**
   * Creates a Verification notification type.
   */
  public static verification(): NotificationType {
    return new NotificationType(NotificationType.VERIFICATION);
  }

  /**
   * Creates a Message notification type.
   */
  public static message(): NotificationType {
    return new NotificationType(NotificationType.MESSAGE);
  }

  /**
   * Creates a Support notification type.
   */
  public static support(): NotificationType {
    return new NotificationType(NotificationType.SUPPORT);
  }

  /**
   * Creates a System notification type.
   */
  public static system(): NotificationType {
    return new NotificationType(NotificationType.SYSTEM);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): NotificationTypeValue {
    if (typeof value !== 'string') {
      throw new Error('Notification type must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !NotificationType.VALID_VALUES.has(normalized as NotificationTypeValue)
    ) {
      throw new Error(`Invalid Notification type: ${value}`);
    }

    return normalized as NotificationTypeValue;
  }

  // ---------------------------------------------------------------------------
  // Type Checks
  // ---------------------------------------------------------------------------

  public isJourney(): boolean {
    return this.props.value === NotificationType.JOURNEY;
  }

  public isBooking(): boolean {
    return this.props.value === NotificationType.BOOKING;
  }

  public isPayment(): boolean {
    return this.props.value === NotificationType.PAYMENT;
  }

  public isWallet(): boolean {
    return this.props.value === NotificationType.WALLET;
  }

  public isTrust(): boolean {
    return this.props.value === NotificationType.TRUST;
  }

  public isVerification(): boolean {
    return this.props.value === NotificationType.VERIFICATION;
  }

  public isMessage(): boolean {
    return this.props.value === NotificationType.MESSAGE;
  }

  public isSupport(): boolean {
    return this.props.value === NotificationType.SUPPORT;
  }

  public isSystem(): boolean {
    return this.props.value === NotificationType.SYSTEM;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): NotificationTypeValue {
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

export type { NotificationTypeProps };

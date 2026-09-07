// -----------------------------------------------------------------------------
// Notification Delivery Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type NotificationDeliveryStatusValue =
  'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface NotificationDeliveryStatusProps {
  value: NotificationDeliveryStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Notification Delivery.
 *
 * Valid states:
 *
 * - PENDING   — The delivery has been created but has not yet been sent.
 * - SENT      — The notification has been submitted to the delivery channel.
 * - DELIVERED — Delivery has been confirmed.
 * - FAILED    — Delivery could not be completed.
 * - CANCELLED — Delivery was cancelled before completion.
 *
 * The Notification Delivery entity owns lifecycle transitions.
 * This value object is responsible only for representing and validating
 * the status value.
 */
export class NotificationDeliveryStatus extends ValueObject<NotificationDeliveryStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly PENDING: NotificationDeliveryStatusValue = 'PENDING';

  public static readonly SENT: NotificationDeliveryStatusValue = 'SENT';

  public static readonly DELIVERED: NotificationDeliveryStatusValue =
    'DELIVERED';

  public static readonly FAILED: NotificationDeliveryStatusValue = 'FAILED';

  public static readonly CANCELLED: NotificationDeliveryStatusValue =
    'CANCELLED';

  private static readonly VALID_VALUES: ReadonlySet<NotificationDeliveryStatusValue> =
    new Set([
      NotificationDeliveryStatus.PENDING,
      NotificationDeliveryStatus.SENT,
      NotificationDeliveryStatus.DELIVERED,
      NotificationDeliveryStatus.FAILED,
      NotificationDeliveryStatus.CANCELLED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: NotificationDeliveryStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Notification Delivery status from arbitrary input.
   */
  public static create(value: string): NotificationDeliveryStatus {
    const normalized = NotificationDeliveryStatus.validate(value);

    return new NotificationDeliveryStatus(normalized);
  }

  /**
   * Creates a Notification Delivery status from an already validated
   * domain value.
   */
  public static fromValue(
    value: NotificationDeliveryStatusValue,
  ): NotificationDeliveryStatus {
    return new NotificationDeliveryStatus(value);
  }

  /**
   * Creates a pending Notification Delivery status.
   */
  public static pending(): NotificationDeliveryStatus {
    return new NotificationDeliveryStatus(NotificationDeliveryStatus.PENDING);
  }

  /**
   * Creates a sent Notification Delivery status.
   */
  public static sent(): NotificationDeliveryStatus {
    return new NotificationDeliveryStatus(NotificationDeliveryStatus.SENT);
  }

  /**
   * Creates a delivered Notification Delivery status.
   */
  public static delivered(): NotificationDeliveryStatus {
    return new NotificationDeliveryStatus(NotificationDeliveryStatus.DELIVERED);
  }

  /**
   * Creates a failed Notification Delivery status.
   */
  public static failed(): NotificationDeliveryStatus {
    return new NotificationDeliveryStatus(NotificationDeliveryStatus.FAILED);
  }

  /**
   * Creates a cancelled Notification Delivery status.
   */
  public static cancelled(): NotificationDeliveryStatus {
    return new NotificationDeliveryStatus(NotificationDeliveryStatus.CANCELLED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): NotificationDeliveryStatusValue {
    if (typeof value !== 'string') {
      throw new Error('Notification delivery status must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !NotificationDeliveryStatus.VALID_VALUES.has(
        normalized as NotificationDeliveryStatusValue,
      )
    ) {
      throw new Error(`Invalid Notification delivery status: ${value}`);
    }

    return normalized as NotificationDeliveryStatusValue;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === NotificationDeliveryStatus.PENDING;
  }

  public isSent(): boolean {
    return this.props.value === NotificationDeliveryStatus.SENT;
  }

  public isDelivered(): boolean {
    return this.props.value === NotificationDeliveryStatus.DELIVERED;
  }

  public isFailed(): boolean {
    return this.props.value === NotificationDeliveryStatus.FAILED;
  }

  public isCancelled(): boolean {
    return this.props.value === NotificationDeliveryStatus.CANCELLED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): NotificationDeliveryStatusValue {
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

export type { NotificationDeliveryStatusProps };

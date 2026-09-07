// -----------------------------------------------------------------------------
// Notification Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type NotificationStatusValue =
  'PENDING' | 'SENT' | 'READ' | 'FAILED' | 'CANCELLED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface NotificationStatusProps {
  value: NotificationStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Notification.
 *
 * Valid states:
 *
 * - PENDING   — The notification has been created but has not completed sending.
 * - SENT      — The notification has been sent.
 * - READ      — The recipient has read the notification.
 * - FAILED    — Notification processing or delivery has failed.
 * - CANCELLED — The notification has been cancelled.
 *
 * The Notification entity owns lifecycle transitions.
 * This value object is responsible only for representing and validating
 * the status value.
 */
export class NotificationStatus extends ValueObject<NotificationStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly PENDING: NotificationStatusValue = 'PENDING';

  public static readonly SENT: NotificationStatusValue = 'SENT';

  public static readonly READ: NotificationStatusValue = 'READ';

  public static readonly FAILED: NotificationStatusValue = 'FAILED';

  public static readonly CANCELLED: NotificationStatusValue = 'CANCELLED';

  private static readonly VALID_VALUES: ReadonlySet<NotificationStatusValue> =
    new Set([
      NotificationStatus.PENDING,
      NotificationStatus.SENT,
      NotificationStatus.READ,
      NotificationStatus.FAILED,
      NotificationStatus.CANCELLED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: NotificationStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Notification status from arbitrary input.
   */
  public static create(value: string): NotificationStatus {
    const normalized = NotificationStatus.validate(value);

    return new NotificationStatus(normalized);
  }

  /**
   * Creates a Notification status from an already validated domain value.
   */
  public static fromValue(value: NotificationStatusValue): NotificationStatus {
    return new NotificationStatus(value);
  }

  /**
   * Creates a pending Notification status.
   */
  public static pending(): NotificationStatus {
    return new NotificationStatus(NotificationStatus.PENDING);
  }

  /**
   * Creates a sent Notification status.
   */
  public static sent(): NotificationStatus {
    return new NotificationStatus(NotificationStatus.SENT);
  }

  /**
   * Creates a read Notification status.
   */
  public static read(): NotificationStatus {
    return new NotificationStatus(NotificationStatus.READ);
  }

  /**
   * Creates a failed Notification status.
   */
  public static failed(): NotificationStatus {
    return new NotificationStatus(NotificationStatus.FAILED);
  }

  /**
   * Creates a cancelled Notification status.
   */
  public static cancelled(): NotificationStatus {
    return new NotificationStatus(NotificationStatus.CANCELLED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): NotificationStatusValue {
    if (typeof value !== 'string') {
      throw new Error('Notification status must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !NotificationStatus.VALID_VALUES.has(
        normalized as NotificationStatusValue,
      )
    ) {
      throw new Error(`Invalid Notification status: ${value}`);
    }

    return normalized as NotificationStatusValue;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === NotificationStatus.PENDING;
  }

  public isSent(): boolean {
    return this.props.value === NotificationStatus.SENT;
  }

  public isRead(): boolean {
    return this.props.value === NotificationStatus.READ;
  }

  public isFailed(): boolean {
    return this.props.value === NotificationStatus.FAILED;
  }

  public isCancelled(): boolean {
    return this.props.value === NotificationStatus.CANCELLED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): NotificationStatusValue {
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

export type { NotificationStatusProps };

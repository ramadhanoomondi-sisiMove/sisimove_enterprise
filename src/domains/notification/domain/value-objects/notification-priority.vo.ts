// -----------------------------------------------------------------------------
// Notification Priority
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type NotificationPriorityValue = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface NotificationPriorityProps {
  value: NotificationPriorityValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the priority of a Notification.
 *
 * Valid priorities:
 *
 * - LOW      — Low-priority informational notification.
 * - NORMAL   — Standard notification priority.
 * - HIGH     — Important notification requiring increased visibility.
 * - CRITICAL — Critical notification requiring immediate attention.
 *
 * The value object validates and represents the priority value.
 * Notification delivery and presentation policies remain outside
 * this value object.
 */
export class NotificationPriority extends ValueObject<NotificationPriorityProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly LOW: NotificationPriorityValue = 'LOW';

  public static readonly NORMAL: NotificationPriorityValue = 'NORMAL';

  public static readonly HIGH: NotificationPriorityValue = 'HIGH';

  public static readonly CRITICAL: NotificationPriorityValue = 'CRITICAL';

  private static readonly VALID_VALUES: ReadonlySet<NotificationPriorityValue> =
    new Set([
      NotificationPriority.LOW,
      NotificationPriority.NORMAL,
      NotificationPriority.HIGH,
      NotificationPriority.CRITICAL,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: NotificationPriorityValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Notification priority from arbitrary input.
   */
  public static create(value: string): NotificationPriority {
    const normalized = NotificationPriority.validate(value);

    return new NotificationPriority(normalized);
  }

  /**
   * Creates a Notification priority from an already validated domain value.
   */
  public static fromValue(
    value: NotificationPriorityValue,
  ): NotificationPriority {
    return new NotificationPriority(value);
  }

  /**
   * Creates a low-priority Notification.
   */
  public static low(): NotificationPriority {
    return new NotificationPriority(NotificationPriority.LOW);
  }

  /**
   * Creates a normal-priority Notification.
   */
  public static normal(): NotificationPriority {
    return new NotificationPriority(NotificationPriority.NORMAL);
  }

  /**
   * Creates a high-priority Notification.
   */
  public static high(): NotificationPriority {
    return new NotificationPriority(NotificationPriority.HIGH);
  }

  /**
   * Creates a critical-priority Notification.
   */
  public static critical(): NotificationPriority {
    return new NotificationPriority(NotificationPriority.CRITICAL);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): NotificationPriorityValue {
    if (typeof value !== 'string') {
      throw new Error('Notification priority must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !NotificationPriority.VALID_VALUES.has(
        normalized as NotificationPriorityValue,
      )
    ) {
      throw new Error(`Invalid Notification priority: ${value}`);
    }

    return normalized as NotificationPriorityValue;
  }

  // ---------------------------------------------------------------------------
  // Priority Checks
  // ---------------------------------------------------------------------------

  public isLow(): boolean {
    return this.props.value === NotificationPriority.LOW;
  }

  public isNormal(): boolean {
    return this.props.value === NotificationPriority.NORMAL;
  }

  public isHigh(): boolean {
    return this.props.value === NotificationPriority.HIGH;
  }

  public isCritical(): boolean {
    return this.props.value === NotificationPriority.CRITICAL;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): NotificationPriorityValue {
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

export type { NotificationPriorityProps };

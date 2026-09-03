// -----------------------------------------------------------------------------
// Recovery Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type RecoveryStatusValue =
  'PENDING' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface RecoveryStatusProps {
  value: RecoveryStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Recovery.
 *
 * Valid states:
 *
 * - PENDING   — Recovery has been requested and remains available for
 *              completion.
 * - COMPLETED — Recovery has been successfully completed.
 * - CANCELLED — Recovery was explicitly cancelled before completion.
 * - EXPIRED   — Recovery passed its expiration time before completion.
 *
 * Recovery lifecycle transitions are governed by the Recovery aggregate.
 */
export class RecoveryStatus extends ValueObject<RecoveryStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly PENDING = 'PENDING' as const;

  public static readonly COMPLETED = 'COMPLETED' as const;

  public static readonly CANCELLED = 'CANCELLED' as const;

  public static readonly EXPIRED = 'EXPIRED' as const;

  private static readonly VALID_VALUES: ReadonlySet<RecoveryStatusValue> =
    new Set([
      RecoveryStatus.PENDING,
      RecoveryStatus.COMPLETED,
      RecoveryStatus.CANCELLED,
      RecoveryStatus.EXPIRED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: RecoveryStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Recovery status value object.
   */
  public static create(value: RecoveryStatusValue): RecoveryStatus {
    RecoveryStatus.validate(value);

    return new RecoveryStatus(value);
  }

  /**
   * Creates a pending Recovery status.
   */
  public static pending(): RecoveryStatus {
    return new RecoveryStatus(RecoveryStatus.PENDING);
  }

  /**
   * Creates a completed Recovery status.
   */
  public static completed(): RecoveryStatus {
    return new RecoveryStatus(RecoveryStatus.COMPLETED);
  }

  /**
   * Creates a cancelled Recovery status.
   */
  public static cancelled(): RecoveryStatus {
    return new RecoveryStatus(RecoveryStatus.CANCELLED);
  }

  /**
   * Creates an expired Recovery status.
   */
  public static expired(): RecoveryStatus {
    return new RecoveryStatus(RecoveryStatus.EXPIRED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): asserts value is RecoveryStatusValue {
    if (!RecoveryStatus.VALID_VALUES.has(value as RecoveryStatusValue)) {
      throw new Error(`Invalid Recovery status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === RecoveryStatus.PENDING;
  }

  public isCompleted(): boolean {
    return this.props.value === RecoveryStatus.COMPLETED;
  }

  public isCancelled(): boolean {
    return this.props.value === RecoveryStatus.CANCELLED;
  }

  public isExpired(): boolean {
    return this.props.value === RecoveryStatus.EXPIRED;
  }

  public isTerminal(): boolean {
    return this.isCompleted() || this.isCancelled() || this.isExpired();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): RecoveryStatusValue {
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

export type { RecoveryStatusProps };

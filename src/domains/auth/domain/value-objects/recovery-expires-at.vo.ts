// -----------------------------------------------------------------------------
// Recovery Expires At
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface RecoveryExpiresAtProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Timestamp representing when a Recovery expires.
 *
 * The expiration timestamp defines the point in time after which a pending
 * Recovery can no longer be completed.
 *
 * The value is mandatory for a Recovery and must represent a concrete,
 * valid point in time.
 */
export class RecoveryExpiresAt extends ValueObject<RecoveryExpiresAtProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: Date) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Recovery expiration timestamp value object.
   *
   * A defensive Date copy is created so callers cannot mutate the value object
   * through the original Date instance.
   */
  public static create(value: Date): RecoveryExpiresAt {
    const normalized = RecoveryExpiresAt.normalize(value);

    RecoveryExpiresAt.validate(normalized);

    return new RecoveryExpiresAt(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date): Date {
    if (!(value instanceof Date)) {
      throw new Error('Recovery expires at must be a Date.');
    }

    return new Date(value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Recovery expires at must be a valid date.');
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the Recovery has reached or passed its expiration
   * timestamp.
   */
  public isExpired(referenceDate: Date = new Date()): boolean {
    if (Number.isNaN(referenceDate.getTime())) {
      throw new Error('Reference date must be a valid date.');
    }

    return this.props.value.getTime() <= referenceDate.getTime();
  }

  /**
   * Determines whether the Recovery has not yet reached its expiration
   * timestamp.
   */
  public isActive(referenceDate: Date = new Date()): boolean {
    return !this.isExpired(referenceDate);
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  /**
   * Returns a defensive copy of the expiration timestamp.
   */
  public get value(): Date {
    return new Date(this.props.value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value.toISOString();
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { RecoveryExpiresAtProps };

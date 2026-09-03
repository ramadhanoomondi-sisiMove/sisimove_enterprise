// -----------------------------------------------------------------------------
// Recovery Requested At
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface RecoveryRequestedAtProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Timestamp representing when a Recovery was requested.
 *
 * The value is mandatory for a Recovery and represents the point in time at
 * which the recovery workflow was initiated.
 */
export class RecoveryRequestedAt extends ValueObject<RecoveryRequestedAtProps> {
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
   * Creates a Recovery requested-at value object.
   *
   * A defensive Date copy is created so callers cannot mutate the value object
   * through the original Date instance.
   */
  public static create(value: Date): RecoveryRequestedAt {
    const normalized = RecoveryRequestedAt.normalize(value);

    RecoveryRequestedAt.validate(normalized);

    return new RecoveryRequestedAt(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date): Date {
    if (!(value instanceof Date)) {
      throw new Error('Recovery requested at must be a Date.');
    }

    return new Date(value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Recovery requested at must be a valid date.');
    }
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  /**
   * Returns a defensive copy of the request timestamp.
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

export type { RecoveryRequestedAtProps };

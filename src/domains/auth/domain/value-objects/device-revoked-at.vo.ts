// -----------------------------------------------------------------------------
// Device Revoked At
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface DeviceRevokedAtProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Timestamp representing when a Device was revoked.
 *
 * The value is optional at the Device aggregate level because an active
 * Device has not been revoked.
 *
 * The value object itself always represents a concrete, valid timestamp.
 */
export class DeviceRevokedAt extends ValueObject<DeviceRevokedAtProps> {
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
   * Creates a Device revoked-at value object.
   *
   * A defensive Date copy is created so callers cannot mutate the value object
   * through the original Date instance.
   */
  public static create(value: Date): DeviceRevokedAt {
    const normalized = DeviceRevokedAt.normalize(value);

    DeviceRevokedAt.validate(normalized);

    return new DeviceRevokedAt(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date): Date {
    if (!(value instanceof Date)) {
      throw new Error('Device revoked at must be a Date.');
    }

    return new Date(value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Device revoked at must be a valid date.');
    }
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  /**
   * Returns a defensive copy of the revocation timestamp.
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

export type { DeviceRevokedAtProps };

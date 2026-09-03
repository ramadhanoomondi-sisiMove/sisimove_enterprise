// -----------------------------------------------------------------------------
// Device Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type DeviceStatusValue = 'ACTIVE' | 'REVOKED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface DeviceStatusProps {
  value: DeviceStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Device.
 *
 * Valid states:
 *
 * - ACTIVE  — Device is currently recognized and may be used.
 * - REVOKED — Device has been explicitly revoked and must no longer be
 *             trusted for authentication.
 *
 * Device status is distinct from Device trust level. Status determines
 * whether the Device remains valid, while trust level describes the degree
 * of trust assigned to an active Device.
 */
export class DeviceStatus extends ValueObject<DeviceStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly ACTIVE = 'ACTIVE' as const;

  public static readonly REVOKED = 'REVOKED' as const;

  private static readonly VALID_VALUES: ReadonlySet<DeviceStatusValue> =
    new Set([DeviceStatus.ACTIVE, DeviceStatus.REVOKED]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: DeviceStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Device status value object.
   */
  public static create(value: DeviceStatusValue): DeviceStatus {
    DeviceStatus.validate(value);

    return new DeviceStatus(value);
  }

  /**
   * Creates an active Device status.
   */
  public static active(): DeviceStatus {
    return new DeviceStatus(DeviceStatus.ACTIVE);
  }

  /**
   * Creates a revoked Device status.
   */
  public static revoked(): DeviceStatus {
    return new DeviceStatus(DeviceStatus.REVOKED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): asserts value is DeviceStatusValue {
    if (!DeviceStatus.VALID_VALUES.has(value as DeviceStatusValue)) {
      throw new Error(`Invalid Device status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return this.props.value === DeviceStatus.ACTIVE;
  }

  public isRevoked(): boolean {
    return this.props.value === DeviceStatus.REVOKED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): DeviceStatusValue {
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

export type { DeviceStatusProps };

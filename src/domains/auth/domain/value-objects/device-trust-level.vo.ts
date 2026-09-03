// -----------------------------------------------------------------------------
// Device Trust Level
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type DeviceTrustLevelValue = 'LOW' | 'TRUSTED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface DeviceTrustLevelProps {
  value: DeviceTrustLevelValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the trust level assigned to a Device.
 *
 * Valid levels:
 *
 * - LOW     — Device has limited or unestablished trust.
 * - TRUSTED — Device has been explicitly or sufficiently established as
 *             trusted by the Authentication domain's security policies.
 *
 * Trust level is distinct from Device status. Status determines whether the
 * Device is valid, while trust level describes the degree of trust assigned
 * to a valid Device.
 */
export class DeviceTrustLevel extends ValueObject<DeviceTrustLevelProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly LOW = 'LOW' as const;

  public static readonly TRUSTED = 'TRUSTED' as const;

  private static readonly VALID_VALUES: ReadonlySet<DeviceTrustLevelValue> =
    new Set([DeviceTrustLevel.LOW, DeviceTrustLevel.TRUSTED]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: DeviceTrustLevelValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Device trust-level value object.
   */
  public static create(value: DeviceTrustLevelValue): DeviceTrustLevel {
    DeviceTrustLevel.validate(value);

    return new DeviceTrustLevel(value);
  }

  /**
   * Creates a low-trust Device value.
   */
  public static low(): DeviceTrustLevel {
    return new DeviceTrustLevel(DeviceTrustLevel.LOW);
  }

  /**
   * Creates a trusted Device value.
   */
  public static trusted(): DeviceTrustLevel {
    return new DeviceTrustLevel(DeviceTrustLevel.TRUSTED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(
    value: string,
  ): asserts value is DeviceTrustLevelValue {
    if (!DeviceTrustLevel.VALID_VALUES.has(value as DeviceTrustLevelValue)) {
      throw new Error(`Invalid Device trust level: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isLow(): boolean {
    return this.props.value === DeviceTrustLevel.LOW;
  }

  public isTrusted(): boolean {
    return this.props.value === DeviceTrustLevel.TRUSTED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): DeviceTrustLevelValue {
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

export type { DeviceTrustLevelProps };

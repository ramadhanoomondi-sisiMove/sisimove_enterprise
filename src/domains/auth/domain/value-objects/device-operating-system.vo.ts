// -----------------------------------------------------------------------------
// Device — Operating System Value Object
// -----------------------------------------------------------------------------
//
// Represents the operating system associated with a Device.
//
// Examples:
//
//     iOS
//     Android
//     Windows
//     macOS
//     Linux
//     ChromeOS
//
// The value is intentionally kept as an opaque string rather than an enum.
// Device operating systems evolve independently of the Device domain.
//
// Responsibilities:
//
// - normalize the operating-system name;
// - enforce string invariants;
// - prevent empty values;
// - prevent control characters;
// - expose an immutable value.
//
// This value object does NOT:
//
// - detect the operating system;
// - inspect user-agent strings;
// - identify a device;
// - validate browser compatibility;
// - access infrastructure;
// - access Prisma.
//
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_VALUE_LENGTH = 1;
const MAX_VALUE_LENGTH = 128;

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface DeviceOperatingSystemProps {
  readonly value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class DeviceOperatingSystem extends ValueObject<DeviceOperatingSystemProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(value: string) {
    super({
      value,
    });
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(value: string): DeviceOperatingSystem {
    const normalizedValue = value.trim();

    DeviceOperatingSystem.validate(normalizedValue);

    return new DeviceOperatingSystem(normalizedValue);
  }

  // ===========================================================================
  // Accessor
  // ===========================================================================

  public get value(): string {
    return this.props.value;
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  private static validate(value: string): void {
    if (typeof value !== 'string') {
      throw new Error('Device operating system must be a string.');
    }

    if (value.length < MIN_VALUE_LENGTH) {
      throw new Error('Device operating system must not be empty.');
    }

    if (value.length > MAX_VALUE_LENGTH) {
      throw new Error(
        `Device operating system must not exceed ${MAX_VALUE_LENGTH} characters.`,
      );
    }

    for (const character of value) {
      const codePoint = character.codePointAt(0);

      if (
        codePoint !== undefined &&
        ((codePoint >= 0 && codePoint <= 31) || codePoint === 127)
      ) {
        throw new Error(
          'Device operating system must not contain control characters.',
        );
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_VALUE_LENGTH as DEVICE_OPERATING_SYSTEM_MIN_LENGTH,
  MAX_VALUE_LENGTH as DEVICE_OPERATING_SYSTEM_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DeviceOperatingSystem;

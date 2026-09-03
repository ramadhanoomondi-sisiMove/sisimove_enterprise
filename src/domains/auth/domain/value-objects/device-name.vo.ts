// -----------------------------------------------------------------------------
// Device Name
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface DeviceNameProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Human-readable name assigned to a Device.
 *
 * Represents an optional descriptive name for a Device, such as:
 *
 * - "My Phone"
 * - "Office Laptop"
 * - "Chrome on Windows"
 *
 * Device identification, discovery, and automatic naming are application or
 * infrastructure concerns. This value object only represents a valid device
 * name.
 */
export class DeviceName extends ValueObject<DeviceNameProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_LENGTH = 100;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Device name value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): DeviceName {
    const normalized = value.trim();

    DeviceName.validate(normalized);

    return new DeviceName(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Device name is required.');
    }

    if (value.length > DeviceName.MAX_LENGTH) {
      throw new Error(
        `Device name must not exceed ${DeviceName.MAX_LENGTH} characters.`,
      );
    }

    if (DeviceName.containsControlCharacter(value)) {
      throw new Error('Device name contains invalid control characters.');
    }
  }

  /**
   * Determines whether the supplied value contains ASCII control characters.
   *
   * This avoids regular expressions containing control characters and remains
   * compatible with ESLint's no-control-regex rule.
   */
  private static containsControlCharacter(value: string): boolean {
    for (const character of value) {
      const codePoint = character.codePointAt(0);

      if (codePoint === undefined) {
        continue;
      }

      if ((codePoint >= 0 && codePoint <= 31) || codePoint === 127) {
        return true;
      }
    }

    return false;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): string {
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

export type { DeviceNameProps };

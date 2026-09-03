// -----------------------------------------------------------------------------
// Device Operating System Version
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface DeviceOperatingSystemVersionProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Operating system version associated with a Device.
 *
 * Represents client-reported operating system version metadata.
 *
 * Examples:
 *
 * - "17.5.1"
 * - "14"
 * - "Windows 11"
 * - "6.8.0"
 *
 * The value is intentionally treated as opaque metadata. Version parsing,
 * semantic-version comparison, platform-specific interpretation, and
 * operating-system compatibility rules belong to application or
 * infrastructure services.
 */
export class DeviceOperatingSystemVersion extends ValueObject<DeviceOperatingSystemVersionProps> {
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
   * Creates a Device operating-system version value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): DeviceOperatingSystemVersion {
    const normalized = value.trim();

    DeviceOperatingSystemVersion.validate(normalized);

    return new DeviceOperatingSystemVersion(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Device operating system version is required.');
    }

    if (value.length > DeviceOperatingSystemVersion.MAX_LENGTH) {
      throw new Error(
        `Device operating system version must not exceed ${DeviceOperatingSystemVersion.MAX_LENGTH} characters.`,
      );
    }

    if (DeviceOperatingSystemVersion.containsControlCharacter(value)) {
      throw new Error(
        'Device operating system version contains invalid control characters.',
      );
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

export type { DeviceOperatingSystemVersionProps };

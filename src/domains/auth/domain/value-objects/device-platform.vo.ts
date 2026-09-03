// -----------------------------------------------------------------------------
// Device Platform
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface DevicePlatformProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Platform associated with a Device.
 *
 * Represents client-reported platform metadata, such as a platform or runtime
 * identifier supplied by the client.
 *
 * Examples:
 *
 * - "Web"
 * - "iOS"
 * - "Android"
 * - "Windows"
 * - "macOS"
 *
 * The value is treated as opaque metadata. Platform detection, normalization
 * against a platform registry, and client capability detection belong to
 * application or infrastructure services.
 */
export class DevicePlatform extends ValueObject<DevicePlatformProps> {
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
   * Creates a Device platform value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): DevicePlatform {
    const normalized = value.trim();

    DevicePlatform.validate(normalized);

    return new DevicePlatform(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Device platform is required.');
    }

    if (value.length > DevicePlatform.MAX_LENGTH) {
      throw new Error(
        `Device platform must not exceed ${DevicePlatform.MAX_LENGTH} characters.`,
      );
    }

    if (DevicePlatform.containsControlCharacter(value)) {
      throw new Error('Device platform contains invalid control characters.');
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

export type { DevicePlatformProps };

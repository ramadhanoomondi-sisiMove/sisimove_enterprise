// -----------------------------------------------------------------------------
// Device Browser Version
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface DeviceBrowserVersionProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Browser version associated with a Device.
 *
 * Represents client-reported browser version metadata.
 *
 * Examples:
 *
 * - "128.0.6613.84"
 * - "17.5"
 * - "126"
 *
 * The value is intentionally treated as opaque metadata. Version parsing,
 * semantic-version comparison, browser compatibility, and User-Agent
 * interpretation belong to application or infrastructure services.
 */
export class DeviceBrowserVersion extends ValueObject<DeviceBrowserVersionProps> {
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
   * Creates a Device browser-version value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): DeviceBrowserVersion {
    const normalized = value.trim();

    DeviceBrowserVersion.validate(normalized);

    return new DeviceBrowserVersion(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Device browser version is required.');
    }

    if (value.length > DeviceBrowserVersion.MAX_LENGTH) {
      throw new Error(
        `Device browser version must not exceed ${DeviceBrowserVersion.MAX_LENGTH} characters.`,
      );
    }

    if (DeviceBrowserVersion.containsControlCharacter(value)) {
      throw new Error(
        'Device browser version contains invalid control characters.',
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

export type { DeviceBrowserVersionProps };

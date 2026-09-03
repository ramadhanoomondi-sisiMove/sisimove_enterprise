// -----------------------------------------------------------------------------
// Device Browser
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface DeviceBrowserProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Browser associated with a Device.
 *
 * Represents client-reported browser metadata.
 *
 * Examples:
 *
 * - "Chrome"
 * - "Firefox"
 * - "Safari"
 * - "Edge"
 *
 * The value is intentionally treated as opaque metadata. Browser detection,
 * User-Agent parsing, browser normalization, and compatibility rules belong
 * to application or infrastructure services.
 */
export class DeviceBrowser extends ValueObject<DeviceBrowserProps> {
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
   * Creates a Device browser value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): DeviceBrowser {
    const normalized = value.trim();

    DeviceBrowser.validate(normalized);

    return new DeviceBrowser(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Device browser is required.');
    }

    if (value.length > DeviceBrowser.MAX_LENGTH) {
      throw new Error(
        `Device browser must not exceed ${DeviceBrowser.MAX_LENGTH} characters.`,
      );
    }

    if (DeviceBrowser.containsControlCharacter(value)) {
      throw new Error('Device browser contains invalid control characters.');
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

export type { DeviceBrowserProps };

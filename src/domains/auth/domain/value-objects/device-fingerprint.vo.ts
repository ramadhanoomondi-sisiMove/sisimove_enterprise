// -----------------------------------------------------------------------------
// Device Fingerprint
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface DeviceFingerprintProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Fingerprint identifying a Device within the Authentication domain.
 *
 * Represents an opaque, normalized device fingerprint used to recognize a
 * device across authentication sessions.
 *
 * The fingerprint must not contain raw authentication credentials or other
 * secrets. Fingerprint generation, cryptographic hashing, browser/device
 * signal collection, and fingerprinting algorithms are infrastructure
 * concerns and do not belong in this value object.
 */
export class DeviceFingerprint extends ValueObject<DeviceFingerprintProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MIN_LENGTH = 16;

  private static readonly MAX_LENGTH = 255;

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
   * Creates a Device fingerprint value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): DeviceFingerprint {
    const normalized = value.trim();

    DeviceFingerprint.validate(normalized);

    return new DeviceFingerprint(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Device fingerprint is required.');
    }

    if (value.length < DeviceFingerprint.MIN_LENGTH) {
      throw new Error(
        `Device fingerprint must contain at least ${DeviceFingerprint.MIN_LENGTH} characters.`,
      );
    }

    if (value.length > DeviceFingerprint.MAX_LENGTH) {
      throw new Error(
        `Device fingerprint must not exceed ${DeviceFingerprint.MAX_LENGTH} characters.`,
      );
    }

    if (DeviceFingerprint.containsControlCharacter(value)) {
      throw new Error(
        'Device fingerprint contains invalid control characters.',
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

export type { DeviceFingerprintProps };

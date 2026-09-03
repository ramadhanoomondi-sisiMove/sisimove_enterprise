// -----------------------------------------------------------------------------
// OTP Challenge OTP Hash
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface OtpChallengeOtpHashProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Cryptographic hash of the OTP issued for an OTP Challenge.
 *
 * Represents the persisted, non-reversible representation of the OTP.
 *
 * The plaintext OTP must never be persisted. OTP generation, hashing, and
 * constant-time verification belong to the Authentication security
 * infrastructure.
 *
 * The value object intentionally does not prescribe a specific hashing
 * algorithm. The resulting hash is treated as an opaque security value.
 */
export class OtpChallengeOtpHash extends ValueObject<OtpChallengeOtpHashProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_LENGTH = 512;

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
   * Creates an OTP Challenge OTP hash value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): OtpChallengeOtpHash {
    const normalized = value.trim();

    OtpChallengeOtpHash.validate(normalized);

    return new OtpChallengeOtpHash(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('OTP Challenge OTP hash is required.');
    }

    if (value.length > OtpChallengeOtpHash.MAX_LENGTH) {
      throw new Error(
        `OTP Challenge OTP hash must not exceed ${OtpChallengeOtpHash.MAX_LENGTH} characters.`,
      );
    }

    if (OtpChallengeOtpHash.containsControlCharacter(value)) {
      throw new Error(
        'OTP Challenge OTP hash contains invalid control characters.',
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

  /**
   * Returns the persisted OTP hash.
   */
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

export type { OtpChallengeOtpHashProps };

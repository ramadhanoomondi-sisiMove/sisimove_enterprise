// -----------------------------------------------------------------------------
// OTP Challenge Hash
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface OtpChallengeHashProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Cryptographic hash of an OTP.
 *
 * Represents the persisted, non-reversible representation of the OTP issued
 * for an OTP Challenge.
 *
 * The plaintext OTP must never be persisted. OTP generation, hashing, and
 * constant-time verification belong to the Authentication security
 * infrastructure.
 *
 * The value object intentionally does not prescribe a specific hashing
 * algorithm. The resulting hash is treated as an opaque security value.
 */
export class OtpChallengeHash extends ValueObject<OtpChallengeHashProps> {
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
   * Creates an OTP Challenge hash value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): OtpChallengeHash {
    const normalized = value.trim();

    OtpChallengeHash.validate(normalized);

    return new OtpChallengeHash(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('OTP Challenge hash is required.');
    }

    if (value.length > OtpChallengeHash.MAX_LENGTH) {
      throw new Error(
        `OTP Challenge hash must not exceed ${OtpChallengeHash.MAX_LENGTH} characters.`,
      );
    }

    if (OtpChallengeHash.containsControlCharacter(value)) {
      throw new Error(
        'OTP Challenge hash contains invalid control characters.',
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

export type { OtpChallengeHashProps };

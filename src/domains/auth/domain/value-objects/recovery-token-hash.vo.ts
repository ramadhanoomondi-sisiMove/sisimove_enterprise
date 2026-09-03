// -----------------------------------------------------------------------------
// Recovery Token Hash
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface RecoveryTokenHashProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Cryptographic hash of a Recovery token.
 *
 * Represents the persisted, non-reversible representation of a recovery
 * token.
 *
 * Raw recovery tokens must never be persisted. The plaintext token is issued
 * and handled by the application/security infrastructure, while only its
 * cryptographic hash is stored by the Recovery aggregate.
 *
 * The value object intentionally does not prescribe a specific hashing
 * algorithm. Hashing and verification belong to the Authentication security
 * infrastructure.
 */
export class RecoveryTokenHash extends ValueObject<RecoveryTokenHashProps> {
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
   * Creates a Recovery token-hash value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): RecoveryTokenHash {
    const normalized = value.trim();

    RecoveryTokenHash.validate(normalized);

    return new RecoveryTokenHash(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Recovery token hash is required.');
    }

    if (value.length > RecoveryTokenHash.MAX_LENGTH) {
      throw new Error(
        `Recovery token hash must not exceed ${RecoveryTokenHash.MAX_LENGTH} characters.`,
      );
    }

    if (RecoveryTokenHash.containsControlCharacter(value)) {
      throw new Error(
        'Recovery token hash contains invalid control characters.',
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

export type { RecoveryTokenHashProps };

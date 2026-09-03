// -----------------------------------------------------------------------------
// OTP Challenge Destination
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface OtpChallengeDestinationProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Destination snapshot associated with an OTP Challenge.
 *
 * Represents the email address or phone number to which the OTP challenge
 * was issued.
 *
 * The destination is stored as a snapshot so that the OTP Challenge remains
 * bound to the destination that was challenged at the time it was created.
 *
 * This value object does not determine whether the destination is an email
 * address or phone number. Destination-specific validation belongs to the
 * corresponding Identity value objects and verification workflows.
 */
export class OtpChallengeDestination extends ValueObject<OtpChallengeDestinationProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_LENGTH = 254;

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
   * Creates an OTP Challenge destination value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): OtpChallengeDestination {
    const normalized = value.trim();

    OtpChallengeDestination.validate(normalized);

    return new OtpChallengeDestination(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('OTP Challenge destination is required.');
    }

    if (value.length > OtpChallengeDestination.MAX_LENGTH) {
      throw new Error(
        `OTP Challenge destination must not exceed ${OtpChallengeDestination.MAX_LENGTH} characters.`,
      );
    }

    if (OtpChallengeDestination.containsControlCharacter(value)) {
      throw new Error(
        'OTP Challenge destination contains invalid control characters.',
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

export type { OtpChallengeDestinationProps };

// -----------------------------------------------------------------------------
// Identity Phone Number
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface IdentityPhoneNumberProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Phone number associated with an Identity.
 *
 * Represents the normalized phone number used as a contact and identity
 * attribute within the Identity domain.
 *
 * Phone numbers are stored in international E.164-compatible format:
 *
 *   +254712345678
 *
 * The value object does not attempt to determine whether the number is
 * actually assigned or reachable. Such concerns belong to verification
 * and external telephony services.
 */
export class IdentityPhoneNumber extends ValueObject<IdentityPhoneNumberProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_LENGTH = 15;

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
   * Creates an Identity phone number value object.
   *
   * The supplied value is normalized by:
   *
   * - trimming surrounding whitespace;
   * - removing common formatting characters;
   * - preserving the leading international `+`.
   */
  public static create(value: string): IdentityPhoneNumber {
    const normalized = IdentityPhoneNumber.normalize(value);

    IdentityPhoneNumber.validate(normalized);

    return new IdentityPhoneNumber(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: string): string {
    return value.trim().replace(/[\s().-]/g, '');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Identity phone number is required.');
    }

    if (!value.startsWith('+')) {
      throw new Error(
        'Identity phone number must use international format with a leading +.',
      );
    }

    if (value.length < 8 || value.length > IdentityPhoneNumber.MAX_LENGTH + 1) {
      throw new Error('Invalid Identity phone number length.');
    }

    if (!IdentityPhoneNumber.isValid(value)) {
      throw new Error(`Invalid Identity phone number: ${value}`);
    }
  }

  /**
   * Performs structural validation for an E.164-compatible phone number.
   *
   * Format:
   *
   *   +[country code][subscriber number]
   *
   * Only digits are permitted after the leading `+`.
   */
  public static isValid(value: string): boolean {
    return /^\+[1-9]\d{7,14}$/.test(value);
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

export type { IdentityPhoneNumberProps };

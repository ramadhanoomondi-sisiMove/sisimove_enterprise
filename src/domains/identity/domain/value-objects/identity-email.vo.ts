// -----------------------------------------------------------------------------
// Identity Email
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface IdentityEmailProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Email address associated with an Identity.
 *
 * Represents the normalized email address used as a contact and identity
 * attribute within the Identity domain.
 */
export class IdentityEmail extends ValueObject<IdentityEmailProps> {
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
   * Creates an Identity email value object.
   *
   * The email is normalized by trimming surrounding whitespace and converting
   * the address to lowercase before validation.
   */
  public static create(value: string): IdentityEmail {
    const normalized = value.trim().toLowerCase();

    IdentityEmail.validate(normalized);

    return new IdentityEmail(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Identity email is required.');
    }

    if (value.length > 254) {
      throw new Error('Identity email must not exceed 254 characters.');
    }

    if (!IdentityEmail.isValid(value)) {
      throw new Error(`Invalid Identity email: ${value}`);
    }
  }

  /**
   * Validates the basic structure of an email address.
   *
   * This intentionally performs domain-level structural validation rather
   * than attempting full RFC email validation.
   */
  public static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

export type { IdentityEmailProps };

// -----------------------------------------------------------------------------
// Session Country Code
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SessionCountryCodeProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * ISO 3166-1 alpha-2 country code associated with a Session.
 *
 * Represents the two-letter country code observed or resolved for the
 * Session's network context.
 *
 * The value object validates the structural format only. IP geolocation,
 * country resolution, proxy detection, VPN detection, and location
 * intelligence are infrastructure concerns.
 *
 * Examples:
 *
 * - KE
 * - US
 * - GB
 * - DE
 */
export class SessionCountryCode extends ValueObject<SessionCountryCodeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly LENGTH = 2;

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
   * Creates a Session country-code value object.
   *
   * Surrounding whitespace is removed and the country code is normalized
   * to uppercase before validation.
   */
  public static create(value: string): SessionCountryCode {
    const normalized = value.trim().toUpperCase();

    SessionCountryCode.validate(normalized);

    return new SessionCountryCode(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Session country code is required.');
    }

    if (value.length !== SessionCountryCode.LENGTH) {
      throw new Error(
        'Session country code must contain exactly 2 characters.',
      );
    }

    if (!SessionCountryCode.isValid(value)) {
      throw new Error(`Invalid Session country code: ${value}`);
    }
  }

  /**
   * Performs structural validation for an ISO 3166-1 alpha-2-style code.
   *
   * This validates the two-letter uppercase format but does not maintain a
   * country-code registry. Country-code lookup belongs to infrastructure or
   * application services.
   */
  public static isValid(value: string): boolean {
    if (value.length !== SessionCountryCode.LENGTH) {
      return false;
    }

    const first = value.charCodeAt(0);
    const second = value.charCodeAt(1);

    return (
      SessionCountryCode.isUppercaseAsciiLetter(first) &&
      SessionCountryCode.isUppercaseAsciiLetter(second)
    );
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private static isUppercaseAsciiLetter(codePoint: number): boolean {
    return codePoint >= 65 && codePoint <= 90;
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

export type { SessionCountryCodeProps };

// -----------------------------------------------------------------------------
// Session City
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SessionCityProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * City associated with a Session.
 *
 * Represents the city resolved or observed for the Session's network context.
 *
 * The value object treats the city as descriptive location metadata. IP
 * geolocation, reverse geocoding, location intelligence, and geographic
 * verification are infrastructure concerns.
 */
export class SessionCity extends ValueObject<SessionCityProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_LENGTH = 200;

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
   * Creates a Session city value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): SessionCity {
    const normalized = value.trim();

    SessionCity.validate(normalized);

    return new SessionCity(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Session city is required.');
    }

    if (value.length > SessionCity.MAX_LENGTH) {
      throw new Error(
        `Session city must not exceed ${SessionCity.MAX_LENGTH} characters.`,
      );
    }

    if (SessionCity.containsControlCharacter(value)) {
      throw new Error('Session city contains invalid control characters.');
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

export type { SessionCityProps };

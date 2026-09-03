// -----------------------------------------------------------------------------
// Session User Agent
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SessionUserAgentProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * User-Agent associated with a Session.
 *
 * Represents the client-provided User-Agent string observed during
 * authentication or Session activity.
 *
 * The value is treated as opaque client metadata. Browser, operating system,
 * device parsing, bot detection, and client classification are infrastructure
 * concerns and do not belong in this value object.
 */
export class SessionUserAgent extends ValueObject<SessionUserAgentProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_LENGTH = 1024;

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
   * Creates a Session User-Agent value object.
   *
   * Surrounding whitespace is removed before validation.
   */
  public static create(value: string): SessionUserAgent {
    const normalized = value.trim();

    SessionUserAgent.validate(normalized);

    return new SessionUserAgent(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Session User-Agent is required.');
    }

    if (value.length > SessionUserAgent.MAX_LENGTH) {
      throw new Error(
        `Session User-Agent must not exceed ${SessionUserAgent.MAX_LENGTH} characters.`,
      );
    }

    if (SessionUserAgent.containsControlCharacter(value)) {
      throw new Error(
        'Session User-Agent contains invalid control characters.',
      );
    }
  }

  /**
   * Determines whether the supplied value contains ASCII control characters.
   *
   * This intentionally avoids a regular expression containing control
   * characters so the implementation remains compatible with ESLint's
   * no-control-regex rule.
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

export type { SessionUserAgentProps };

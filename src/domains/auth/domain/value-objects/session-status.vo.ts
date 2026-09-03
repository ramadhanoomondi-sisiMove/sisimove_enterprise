// -----------------------------------------------------------------------------
// Session Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type SessionStatusValue = 'ACTIVE' | 'EXPIRED' | 'REVOKED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SessionStatusProps {
  value: SessionStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Session.
 *
 * Valid states:
 *
 * - ACTIVE  — Session is currently valid and may be used.
 * - EXPIRED — Session reached its expiration time.
 * - REVOKED — Session was explicitly invalidated.
 *
 * Session status is distinct from Authentication status. Authentication
 * represents the account's authentication state, while Session represents
 * the lifecycle of an individual authenticated session.
 */
export class SessionStatus extends ValueObject<SessionStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly ACTIVE = 'ACTIVE' as const;

  public static readonly EXPIRED = 'EXPIRED' as const;

  public static readonly REVOKED = 'REVOKED' as const;

  private static readonly VALID_VALUES: ReadonlySet<SessionStatusValue> =
    new Set([
      SessionStatus.ACTIVE,
      SessionStatus.EXPIRED,
      SessionStatus.REVOKED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: SessionStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Session status value object.
   */
  public static create(value: SessionStatusValue): SessionStatus {
    SessionStatus.validate(value);

    return new SessionStatus(value);
  }

  /**
   * Creates an active Session status.
   */
  public static active(): SessionStatus {
    return new SessionStatus(SessionStatus.ACTIVE);
  }

  /**
   * Creates an expired Session status.
   */
  public static expired(): SessionStatus {
    return new SessionStatus(SessionStatus.EXPIRED);
  }

  /**
   * Creates a revoked Session status.
   */
  public static revoked(): SessionStatus {
    return new SessionStatus(SessionStatus.REVOKED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): asserts value is SessionStatusValue {
    if (!SessionStatus.VALID_VALUES.has(value as SessionStatusValue)) {
      throw new Error(`Invalid Session status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return this.props.value === SessionStatus.ACTIVE;
  }

  public isExpired(): boolean {
    return this.props.value === SessionStatus.EXPIRED;
  }

  public isRevoked(): boolean {
    return this.props.value === SessionStatus.REVOKED;
  }

  /**
   * Determines whether the Session is no longer usable.
   */
  public isInactive(): boolean {
    return (
      this.props.value === SessionStatus.EXPIRED ||
      this.props.value === SessionStatus.REVOKED
    );
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): SessionStatusValue {
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

export type { SessionStatusProps };

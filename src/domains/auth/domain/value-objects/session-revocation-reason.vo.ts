// -----------------------------------------------------------------------------
// Session Revocation Reason
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type SessionRevocationReasonValue =
  | 'USER_LOGOUT'
  | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_DISABLED'
  | 'DEVICE_REVOKED'
  | 'TOKEN_REUSE'
  | 'SESSION_EXPIRED'
  | 'SYSTEM';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SessionRevocationReasonProps {
  value: SessionRevocationReasonValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Describes why a Session was revoked.
 *
 * The reason provides an explicit domain-level explanation for Session
 * invalidation.
 *
 * Valid reasons:
 *
 * - USER_LOGOUT
 * - PASSWORD_CHANGED
 * - PASSWORD_RESET
 * - ACCOUNT_LOCKED
 * - ACCOUNT_DISABLED
 * - DEVICE_REVOKED
 * - TOKEN_REUSE
 * - SESSION_EXPIRED
 * - SYSTEM
 */
export class SessionRevocationReason extends ValueObject<SessionRevocationReasonProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly USER_LOGOUT = 'USER_LOGOUT' as const;

  public static readonly PASSWORD_CHANGED = 'PASSWORD_CHANGED' as const;

  public static readonly PASSWORD_RESET = 'PASSWORD_RESET' as const;

  public static readonly ACCOUNT_LOCKED = 'ACCOUNT_LOCKED' as const;

  public static readonly ACCOUNT_DISABLED = 'ACCOUNT_DISABLED' as const;

  public static readonly DEVICE_REVOKED = 'DEVICE_REVOKED' as const;

  public static readonly TOKEN_REUSE = 'TOKEN_REUSE' as const;

  public static readonly SESSION_EXPIRED = 'SESSION_EXPIRED' as const;

  public static readonly SYSTEM = 'SYSTEM' as const;

  private static readonly VALID_VALUES: ReadonlySet<SessionRevocationReasonValue> =
    new Set([
      SessionRevocationReason.USER_LOGOUT,
      SessionRevocationReason.PASSWORD_CHANGED,
      SessionRevocationReason.PASSWORD_RESET,
      SessionRevocationReason.ACCOUNT_LOCKED,
      SessionRevocationReason.ACCOUNT_DISABLED,
      SessionRevocationReason.DEVICE_REVOKED,
      SessionRevocationReason.TOKEN_REUSE,
      SessionRevocationReason.SESSION_EXPIRED,
      SessionRevocationReason.SYSTEM,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: SessionRevocationReasonValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Session revocation reason value object.
   */
  public static create(
    value: SessionRevocationReasonValue,
  ): SessionRevocationReason {
    SessionRevocationReason.validate(value);

    return new SessionRevocationReason(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(
    value: string,
  ): asserts value is SessionRevocationReasonValue {
    if (
      !SessionRevocationReason.VALID_VALUES.has(
        value as SessionRevocationReasonValue,
      )
    ) {
      throw new Error(`Invalid Session revocation reason: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isUserLogout(): boolean {
    return this.props.value === SessionRevocationReason.USER_LOGOUT;
  }

  public isPasswordChanged(): boolean {
    return this.props.value === SessionRevocationReason.PASSWORD_CHANGED;
  }

  public isPasswordReset(): boolean {
    return this.props.value === SessionRevocationReason.PASSWORD_RESET;
  }

  public isAccountLocked(): boolean {
    return this.props.value === SessionRevocationReason.ACCOUNT_LOCKED;
  }

  public isAccountDisabled(): boolean {
    return this.props.value === SessionRevocationReason.ACCOUNT_DISABLED;
  }

  public isDeviceRevoked(): boolean {
    return this.props.value === SessionRevocationReason.DEVICE_REVOKED;
  }

  public isTokenReuse(): boolean {
    return this.props.value === SessionRevocationReason.TOKEN_REUSE;
  }

  public isSessionExpired(): boolean {
    return this.props.value === SessionRevocationReason.SESSION_EXPIRED;
  }

  public isSystem(): boolean {
    return this.props.value === SessionRevocationReason.SYSTEM;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): SessionRevocationReasonValue {
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

export type { SessionRevocationReasonProps };

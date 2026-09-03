// -----------------------------------------------------------------------------
// Authentication Failure Reason
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AuthenticationFailureReasonValue =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_DISABLED'
  | 'IDENTITY_NOT_ACTIVE'
  | 'TOO_MANY_ATTEMPTS'
  | 'PASSWORD_CHANGE_REQUIRED'
  | 'PASSWORD_RESET_REQUIRED'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'RATE_LIMITED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AuthenticationFailureReasonProps {
  value: AuthenticationFailureReasonValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the reason an authentication attempt or authentication workflow
 * failed.
 *
 * The reason is an explicit domain classification used for authentication
 * decisions, auditing, lockout handling, and security workflows.
 *
 * Transport/application input may arrive as a plain string.
 *
 * The value object is responsible for:
 *
 * - validating the supplied value;
 * - narrowing the value to AuthenticationFailureReasonValue;
 * - representing the validated domain value.
 *
 * Therefore:
 *
 *     string
 *       │
 *       ▼
 * AuthenticationFailureReason.create(...)
 *       │
 *       ▼
 * AuthenticationFailureReasonValue
 *
 * This keeps transport concerns outside the domain while preserving strong
 * typing inside the domain model.
 *
 * This value object contains no sensitive authentication material.
 */
export class AuthenticationFailureReason extends ValueObject<AuthenticationFailureReasonProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly INVALID_CREDENTIALS = 'INVALID_CREDENTIALS' as const;

  public static readonly ACCOUNT_LOCKED = 'ACCOUNT_LOCKED' as const;

  public static readonly ACCOUNT_DISABLED = 'ACCOUNT_DISABLED' as const;

  public static readonly IDENTITY_NOT_ACTIVE = 'IDENTITY_NOT_ACTIVE' as const;

  public static readonly TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS' as const;

  public static readonly PASSWORD_CHANGE_REQUIRED =
    'PASSWORD_CHANGE_REQUIRED' as const;

  public static readonly PASSWORD_RESET_REQUIRED =
    'PASSWORD_RESET_REQUIRED' as const;

  public static readonly INVALID_OTP = 'INVALID_OTP' as const;

  public static readonly OTP_EXPIRED = 'OTP_EXPIRED' as const;

  public static readonly RATE_LIMITED = 'RATE_LIMITED' as const;

  // ---------------------------------------------------------------------------
  // Valid Values
  // ---------------------------------------------------------------------------

  private static readonly VALID_VALUES: ReadonlySet<AuthenticationFailureReasonValue> =
    new Set<AuthenticationFailureReasonValue>([
      AuthenticationFailureReason.INVALID_CREDENTIALS,
      AuthenticationFailureReason.ACCOUNT_LOCKED,
      AuthenticationFailureReason.ACCOUNT_DISABLED,
      AuthenticationFailureReason.IDENTITY_NOT_ACTIVE,
      AuthenticationFailureReason.TOO_MANY_ATTEMPTS,
      AuthenticationFailureReason.PASSWORD_CHANGE_REQUIRED,
      AuthenticationFailureReason.PASSWORD_RESET_REQUIRED,
      AuthenticationFailureReason.INVALID_OTP,
      AuthenticationFailureReason.OTP_EXPIRED,
      AuthenticationFailureReason.RATE_LIMITED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AuthenticationFailureReasonValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Authentication failure-reason value object from transport or
   * application input.
   *
   * The input intentionally accepts `string`.
   *
   * This allows presentation/application boundaries to perform:
   *
   *     string → AuthenticationFailureReason
   *
   * while keeping validation inside the domain value object.
   *
   * Invalid values throw a domain error.
   */
  public static create(value: string): AuthenticationFailureReason {
    const normalized = AuthenticationFailureReason.validate(value);

    return new AuthenticationFailureReason(normalized);
  }

  /**
   * Creates an Authentication failure-reason value object from an already
   * validated domain value.
   *
   * This is useful inside the domain where the value is already typed as
   * AuthenticationFailureReasonValue.
   */
  public static fromValue(
    value: AuthenticationFailureReasonValue,
  ): AuthenticationFailureReason {
    return new AuthenticationFailureReason(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Validates and narrows an arbitrary string into the supported domain value.
   *
   * The assertion/narrowing happens here rather than in the controller or DTO.
   */
  private static validate(value: string): AuthenticationFailureReasonValue {
    if (typeof value !== 'string') {
      throw new Error('Authentication failure reason must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !AuthenticationFailureReason.VALID_VALUES.has(
        normalized as AuthenticationFailureReasonValue,
      )
    ) {
      throw new Error(`Invalid Authentication failure reason: ${value}`);
    }

    return normalized as AuthenticationFailureReasonValue;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isInvalidCredentials(): boolean {
    return this.props.value === AuthenticationFailureReason.INVALID_CREDENTIALS;
  }

  public isAccountLocked(): boolean {
    return this.props.value === AuthenticationFailureReason.ACCOUNT_LOCKED;
  }

  public isAccountDisabled(): boolean {
    return this.props.value === AuthenticationFailureReason.ACCOUNT_DISABLED;
  }

  public isIdentityNotActive(): boolean {
    return this.props.value === AuthenticationFailureReason.IDENTITY_NOT_ACTIVE;
  }

  public isTooManyAttempts(): boolean {
    return this.props.value === AuthenticationFailureReason.TOO_MANY_ATTEMPTS;
  }

  public isPasswordChangeRequired(): boolean {
    return (
      this.props.value === AuthenticationFailureReason.PASSWORD_CHANGE_REQUIRED
    );
  }

  public isPasswordResetRequired(): boolean {
    return (
      this.props.value === AuthenticationFailureReason.PASSWORD_RESET_REQUIRED
    );
  }

  public isInvalidOtp(): boolean {
    return this.props.value === AuthenticationFailureReason.INVALID_OTP;
  }

  public isOtpExpired(): boolean {
    return this.props.value === AuthenticationFailureReason.OTP_EXPIRED;
  }

  public isRateLimited(): boolean {
    return this.props.value === AuthenticationFailureReason.RATE_LIMITED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AuthenticationFailureReasonValue {
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

export type { AuthenticationFailureReasonProps };

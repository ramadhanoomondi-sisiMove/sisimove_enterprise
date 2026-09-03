// -----------------------------------------------------------------------------
// OTP Challenge Purpose
// -----------------------------------------------------------------------------
//
// Domain Value Object representing the business purpose of an OTP Challenge.
//
// Transport/application boundaries may receive the purpose as a primitive
// string. Use:
//
//     OtpChallengePurpose.fromString(value)
//
// to validate and convert that primitive into this Value Object.
//
// Domain code that already possesses the strongly typed
// OtpChallengePurposeValue may use:
//
//     OtpChallengePurpose.create(value)
//
// -----------------------------------------------------------------------------
//
// Valid purposes:
//
// - EMAIL_VERIFICATION
// - PHONE_VERIFICATION
// - PASSWORD_RESET
// - ACCOUNT_RECOVERY
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type OtpChallengePurposeValue =
  | 'EMAIL_VERIFICATION'
  | 'PHONE_VERIFICATION'
  | 'PASSWORD_RESET'
  | 'ACCOUNT_RECOVERY';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface OtpChallengePurposeProps {
  value: OtpChallengePurposeValue;
}

// =============================================================================
// Value Object
// =============================================================================

/**
 * Represents the business purpose for which an OTP Challenge was issued.
 *
 * The Value Object represents only the valid business purpose.
 *
 * Security workflow orchestration belongs to the application layer.
 */
export class OtpChallengePurpose extends ValueObject<OtpChallengePurposeProps> {
  // ===========================================================================
  // Constants
  // ===========================================================================

  public static readonly EMAIL_VERIFICATION = 'EMAIL_VERIFICATION' as const;

  public static readonly PHONE_VERIFICATION = 'PHONE_VERIFICATION' as const;

  public static readonly PASSWORD_RESET = 'PASSWORD_RESET' as const;

  public static readonly ACCOUNT_RECOVERY = 'ACCOUNT_RECOVERY' as const;

  // ===========================================================================
  // Valid Values
  // ===========================================================================

  private static readonly VALID_VALUES: ReadonlySet<OtpChallengePurposeValue> =
    new Set<OtpChallengePurposeValue>([
      OtpChallengePurpose.EMAIL_VERIFICATION,
      OtpChallengePurpose.PHONE_VERIFICATION,
      OtpChallengePurpose.PASSWORD_RESET,
      OtpChallengePurpose.ACCOUNT_RECOVERY,
    ]);

  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(value: OtpChallengePurposeValue) {
    super({ value });
  }

  // ===========================================================================
  // Factories
  // ===========================================================================

  /**
   * Creates an OTP Challenge purpose from an already validated domain value.
   *
   * This method accepts only the strongly typed domain value.
   */
  public static create(value: OtpChallengePurposeValue): OtpChallengePurpose {
    return new OtpChallengePurpose(value);
  }

  /**
   * Creates an OTP Challenge purpose from a primitive string.
   *
   * This factory is intended for presentation/application boundaries where
   * incoming transport data is typed as `string`.
   *
   * Example:
   *
   *     OtpChallengePurpose.fromString(dto.purpose)
   *
   * The value is trimmed, validated, and narrowed to
   * OtpChallengePurposeValue before construction.
   */
  public static fromString(value: string): OtpChallengePurpose {
    const normalizedValue = value.trim();

    if (!OtpChallengePurpose.isValid(normalizedValue)) {
      throw new Error(`Invalid OTP Challenge purpose: ${normalizedValue}`);
    }

    return new OtpChallengePurpose(normalizedValue);
  }

  // ===========================================================================
  // Named Factories
  // ===========================================================================

  /**
   * Creates an EMAIL_VERIFICATION purpose.
   */
  public static emailVerification(): OtpChallengePurpose {
    return new OtpChallengePurpose(OtpChallengePurpose.EMAIL_VERIFICATION);
  }

  /**
   * Creates a PHONE_VERIFICATION purpose.
   */
  public static phoneVerification(): OtpChallengePurpose {
    return new OtpChallengePurpose(OtpChallengePurpose.PHONE_VERIFICATION);
  }

  /**
   * Creates a PASSWORD_RESET purpose.
   */
  public static passwordReset(): OtpChallengePurpose {
    return new OtpChallengePurpose(OtpChallengePurpose.PASSWORD_RESET);
  }

  /**
   * Creates an ACCOUNT_RECOVERY purpose.
   */
  public static accountRecovery(): OtpChallengePurpose {
    return new OtpChallengePurpose(OtpChallengePurpose.ACCOUNT_RECOVERY);
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Determines whether a primitive string is a valid OTP Challenge purpose.
   *
   * The type predicate narrows the string to OtpChallengePurposeValue when
   * the method returns true.
   */
  public static isValid(value: string): value is OtpChallengePurposeValue {
    return OtpChallengePurpose.VALID_VALUES.has(
      value as OtpChallengePurposeValue,
    );
  }

  // ===========================================================================
  // State Checks
  // ===========================================================================

  /**
   * Determines whether this purpose is EMAIL_VERIFICATION.
   */
  public isEmailVerification(): boolean {
    return this.props.value === OtpChallengePurpose.EMAIL_VERIFICATION;
  }

  /**
   * Determines whether this purpose is PHONE_VERIFICATION.
   */
  public isPhoneVerification(): boolean {
    return this.props.value === OtpChallengePurpose.PHONE_VERIFICATION;
  }

  /**
   * Determines whether this purpose is PASSWORD_RESET.
   */
  public isPasswordReset(): boolean {
    return this.props.value === OtpChallengePurpose.PASSWORD_RESET;
  }

  /**
   * Determines whether this purpose is ACCOUNT_RECOVERY.
   */
  public isAccountRecovery(): boolean {
    return this.props.value === OtpChallengePurpose.ACCOUNT_RECOVERY;
  }

  // ===========================================================================
  // Accessor
  // ===========================================================================

  /**
   * Returns the strongly typed purpose value.
   */
  public get value(): OtpChallengePurposeValue {
    return this.props.value;
  }

  // ===========================================================================
  // Serialization
  // ===========================================================================

  /**
   * Returns the primitive purpose value.
   */
  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { OtpChallengePurposeProps };

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default OtpChallengePurpose;

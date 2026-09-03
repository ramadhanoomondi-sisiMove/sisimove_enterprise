// -----------------------------------------------------------------------------
// OTP Challenge Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type OtpChallengeStatusValue =
  'PENDING' | 'VERIFIED' | 'EXPIRED' | 'CANCELLED' | 'FAILED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface OtpChallengeStatusProps {
  value: OtpChallengeStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of an OTP Challenge.
 *
 * Valid states:
 *
 * - PENDING   — OTP Challenge has been issued and can still be verified.
 * - VERIFIED  — OTP Challenge was successfully verified.
 * - EXPIRED   — OTP Challenge passed its expiration time without verification.
 * - CANCELLED — OTP Challenge was explicitly cancelled.
 * - FAILED    — OTP Challenge failed verification and can no longer be used.
 *
 * OTP lifecycle transitions are governed by the OTP Challenge aggregate.
 */
export class OtpChallengeStatus extends ValueObject<OtpChallengeStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly PENDING = 'PENDING' as const;

  public static readonly VERIFIED = 'VERIFIED' as const;

  public static readonly EXPIRED = 'EXPIRED' as const;

  public static readonly CANCELLED = 'CANCELLED' as const;

  public static readonly FAILED = 'FAILED' as const;

  private static readonly VALID_VALUES: ReadonlySet<OtpChallengeStatusValue> =
    new Set([
      OtpChallengeStatus.PENDING,
      OtpChallengeStatus.VERIFIED,
      OtpChallengeStatus.EXPIRED,
      OtpChallengeStatus.CANCELLED,
      OtpChallengeStatus.FAILED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: OtpChallengeStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an OTP Challenge status value object.
   */
  public static create(value: OtpChallengeStatusValue): OtpChallengeStatus {
    OtpChallengeStatus.validate(value);

    return new OtpChallengeStatus(value);
  }

  public static pending(): OtpChallengeStatus {
    return new OtpChallengeStatus(OtpChallengeStatus.PENDING);
  }

  public static verified(): OtpChallengeStatus {
    return new OtpChallengeStatus(OtpChallengeStatus.VERIFIED);
  }

  public static expired(): OtpChallengeStatus {
    return new OtpChallengeStatus(OtpChallengeStatus.EXPIRED);
  }

  public static cancelled(): OtpChallengeStatus {
    return new OtpChallengeStatus(OtpChallengeStatus.CANCELLED);
  }

  public static failed(): OtpChallengeStatus {
    return new OtpChallengeStatus(OtpChallengeStatus.FAILED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(
    value: string,
  ): asserts value is OtpChallengeStatusValue {
    if (
      !OtpChallengeStatus.VALID_VALUES.has(value as OtpChallengeStatusValue)
    ) {
      throw new Error(`Invalid OTP Challenge status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === OtpChallengeStatus.PENDING;
  }

  public isVerified(): boolean {
    return this.props.value === OtpChallengeStatus.VERIFIED;
  }

  public isExpired(): boolean {
    return this.props.value === OtpChallengeStatus.EXPIRED;
  }

  public isCancelled(): boolean {
    return this.props.value === OtpChallengeStatus.CANCELLED;
  }

  public isFailed(): boolean {
    return this.props.value === OtpChallengeStatus.FAILED;
  }

  public isTerminal(): boolean {
    return (
      this.isVerified() ||
      this.isExpired() ||
      this.isCancelled() ||
      this.isFailed()
    );
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): OtpChallengeStatusValue {
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

export type { OtpChallengeStatusProps };

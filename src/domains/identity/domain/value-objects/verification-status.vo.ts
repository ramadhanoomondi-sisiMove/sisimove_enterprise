// -----------------------------------------------------------------------------
// Verification Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface VerificationStatusProps {
  value: VerificationStatusValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Lifecycle states of a Verification.
 *
 * PENDING
 *   Verification has been created and is awaiting review or completion.
 *
 * VERIFIED
 *   Verification has been successfully completed and approved.
 *
 * REJECTED
 *   Verification was reviewed and did not satisfy the required criteria.
 *
 * EXPIRED
 *   A previously valid verification is no longer valid because its
 *   validity period has elapsed.
 *
 * REVOKED
 *   A previously valid verification has been explicitly invalidated.
 */
export type VerificationStatusValue =
  'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED' | 'REVOKED';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const VERIFICATION_STATUSES: readonly VerificationStatusValue[] = [
  'PENDING',
  'VERIFIED',
  'REJECTED',
  'EXPIRED',
  'REVOKED',
];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Defines the lifecycle status of a Verification.
 *
 * Lifecycle:
 *
 * PENDING
 *   -> VERIFIED
 *   -> REJECTED
 *   -> CANCELLED
 *
 * VERIFIED
 *   -> EXPIRED
 *   -> REVOKED
 *
 * REJECTED
 *   -> PENDING
 *
 * EXPIRED
 *   -> PENDING
 *
 * REVOKED
 *   Terminal state.
 */
export class VerificationStatus extends ValueObject<VerificationStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: VerificationStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Verification Status.
   *
   * The supplied value is normalized to uppercase and validated before
   * entering the domain.
   */
  public static create(value: string): VerificationStatus {
    const normalized = value.trim().toUpperCase();

    VerificationStatus.validate(normalized);

    return new VerificationStatus(normalized as VerificationStatusValue);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!VerificationStatus.isValid(value)) {
      throw new Error(`Invalid Verification status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Static Predicates
  // ---------------------------------------------------------------------------

  public static isValid(value: string): value is VerificationStatusValue {
    return VERIFICATION_STATUSES.includes(value as VerificationStatusValue);
  }

  // ---------------------------------------------------------------------------
  // Instance Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  public isVerified(): boolean {
    return this.props.value === 'VERIFIED';
  }

  public isRejected(): boolean {
    return this.props.value === 'REJECTED';
  }

  public isExpired(): boolean {
    return this.props.value === 'EXPIRED';
  }

  public isRevoked(): boolean {
    return this.props.value === 'REVOKED';
  }

  public isTerminal(): boolean {
    return this.isRevoked();
  }

  // ---------------------------------------------------------------------------
  // Transition Predicates
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the Verification can be approved.
   *
   * Only a pending verification can transition to VERIFIED.
   */
  public canVerify(): boolean {
    return this.isPending();
  }

  /**
   * Determines whether the Verification can be rejected.
   *
   * Only a pending verification can transition to REJECTED.
   */
  public canReject(): boolean {
    return this.isPending();
  }

  /**
   * Determines whether the Verification can be resubmitted.
   *
   * Rejected and expired verifications may return to PENDING when a new
   * verification request is submitted.
   */
  public canResubmit(): boolean {
    return this.isRejected() || this.isExpired();
  }

  /**
   * Determines whether the Verification can expire.
   *
   * Only a verified verification can expire.
   */
  public canExpire(): boolean {
    return this.isVerified();
  }

  /**
   * Determines whether the Verification can be revoked.
   *
   * Only a verified verification can be revoked.
   */
  public canRevoke(): boolean {
    return this.isVerified();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): VerificationStatusValue {
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

export type { VerificationStatusProps };

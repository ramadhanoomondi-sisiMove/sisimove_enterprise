// -----------------------------------------------------------------------------
// Verification Request Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface VerificationRequestStatusProps {
  value: VerificationRequestStatusValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Lifecycle states of a Verification Request.
 *
 * PENDING
 *   Request has been submitted and is awaiting review.
 *
 * APPROVED
 *   Request has been reviewed and the submitted evidence has been accepted.
 *
 * REJECTED
 *   Request has been reviewed and the submitted evidence has been rejected.
 *
 * CANCELLED
 *   Request has been cancelled before completion.
 */
export type VerificationRequestStatusValue =
  'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const VERIFICATION_REQUEST_STATUSES: readonly VerificationRequestStatusValue[] =
  ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Defines the lifecycle status of a Verification Request.
 *
 * Lifecycle:
 *
 * PENDING
 *   -> APPROVED
 *   -> REJECTED
 *   -> CANCELLED
 *
 * APPROVED
 *   Terminal state.
 *
 * REJECTED
 *   Terminal state.
 *
 * CANCELLED
 *   Terminal state.
 */
export class VerificationRequestStatus extends ValueObject<VerificationRequestStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: VerificationRequestStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Verification Request Status.
   *
   * The supplied value is normalized to uppercase and validated before
   * entering the domain.
   */
  public static create(value: string): VerificationRequestStatus {
    const normalized = value.trim().toUpperCase();

    VerificationRequestStatus.validate(normalized);

    return new VerificationRequestStatus(
      normalized as VerificationRequestStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!VerificationRequestStatus.isValid(value)) {
      throw new Error(`Invalid Verification Request status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Static Predicates
  // ---------------------------------------------------------------------------

  public static isValid(
    value: string,
  ): value is VerificationRequestStatusValue {
    return VERIFICATION_REQUEST_STATUSES.includes(
      value as VerificationRequestStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Instance Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  public isApproved(): boolean {
    return this.props.value === 'APPROVED';
  }

  public isRejected(): boolean {
    return this.props.value === 'REJECTED';
  }

  public isCancelled(): boolean {
    return this.props.value === 'CANCELLED';
  }

  public isTerminal(): boolean {
    return this.isApproved() || this.isRejected() || this.isCancelled();
  }

  // ---------------------------------------------------------------------------
  // Transition Predicates
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the request can be approved.
   */
  public canApprove(): boolean {
    return this.isPending();
  }

  /**
   * Determines whether the request can be rejected.
   */
  public canReject(): boolean {
    return this.isPending();
  }

  /**
   * Determines whether the request can be cancelled.
   */
  public canCancel(): boolean {
    return this.isPending();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): VerificationRequestStatusValue {
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

export type { VerificationRequestStatusProps };

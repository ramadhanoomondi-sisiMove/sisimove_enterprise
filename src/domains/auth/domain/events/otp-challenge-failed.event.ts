// -----------------------------------------------------------------------------
// OTP Challenge — Failed Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an OTP verification attempt fails.
//
// The event records a security-safe failed verification attempt associated with
// an OtpChallenge aggregate.
//
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// -----------------------------------------------------------------------------
//
// Safe event data:
//
// - OTP Challenge public identity;
// - Identity public identity;
// - challenge type;
// - challenge status;
// - failed-at timestamp;
// - current attempt count, when explicitly approved by the domain.
//
// Aggregate internal identity remains in DomainEvent.metadata.
//
// -----------------------------------------------------------------------------
//
// Security boundary:
//
// This event intentionally excludes:
//
// - raw OTP values;
// - OTP hashes;
// - passwords;
// - password hashes;
// - access tokens;
// - refresh tokens;
// - refresh-token hashes;
// - recovery tokens;
// - recovery-token hashes;
// - session credentials;
// - cryptographic secrets;
// - private keys;
// - device secrets;
// - authentication credentials;
// - submitted OTP values;
// - other security-sensitive material.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// OTP Challenge
// -----------------------------------------------------------------------------

import { OtpChallengeDomainEvent } from './otp-challenge-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when an OTP verification attempt fails.
 *
 * The event records the failed verification using only security-approved,
 * non-secret event data.
 */
export class OtpChallengeFailedEvent extends OtpChallengeDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    otpChallengeId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly type: string,
    public readonly status: string,
    public readonly failedAt: Date,
    public readonly attemptCount: number,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      otpChallengeId,
      'OtpChallenge',
      'OtpChallengeFailed',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  /**
   * Returns the event-specific payload.
   *
   * OTP Challenge aggregate identity remains in DomainEvent.metadata and is
   * therefore not duplicated in the event payload.
   *
   * Raw OTP values, OTP hashes, authentication credentials, and other
   * security-sensitive material are intentionally excluded.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      type: this.type,
      status: this.status,
      failedAt: this.failedAt,
      attemptCount: this.attemptCount,
    };
  }
}

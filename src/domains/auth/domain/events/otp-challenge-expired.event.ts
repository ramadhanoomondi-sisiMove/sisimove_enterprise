// -----------------------------------------------------------------------------
// OTP Challenge — Expired Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an OtpChallenge aggregate expires.
//
// The event records the OTP Challenge lifecycle transition to EXPIRED without
// exposing the OTP itself, its hash, or any other authentication-sensitive
// material.
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
// - expiry timestamp.
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
 * Raised when an OtpChallenge aggregate expires.
 *
 * The event records the OTP Challenge expiration using only security-approved,
 * non-secret event data.
 */
export class OtpChallengeExpiredEvent extends OtpChallengeDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    otpChallengeId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly type: string,
    public readonly status: string,
    public readonly expiresAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      otpChallengeId,
      'OtpChallenge',
      'OtpChallengeExpired',
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
      expiresAt: this.expiresAt,
    };
  }
}

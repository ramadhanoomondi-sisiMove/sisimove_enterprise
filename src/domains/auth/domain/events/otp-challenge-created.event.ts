// -----------------------------------------------------------------------------
// OTP Challenge — Created Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an OtpChallenge aggregate is created.
//
// The event records the establishment of a new OTP Challenge using only
// information that is safe to distribute to downstream domain/application
// consumers.
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
// Event data:
//
// - OTP Challenge public identity;
// - associated Identity public identity;
// - OTP Challenge purpose;
// - OTP Challenge status;
// - request timestamp;
// - expiry timestamp;
// - creation timestamp.
//
// -----------------------------------------------------------------------------
//
// Security boundary:
//
// The OtpChallengeDestination value object is part of the aggregate state,
// but its underlying value may contain an email address or phone number.
//
// Therefore, the actual destination is intentionally NOT published by this
// event.
//
// This event also excludes:
//
// - raw OTP values;
// - OTP hashes;
// - email addresses;
// - phone numbers;
// - challenged destinations;
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
// - other authentication secrets.
//
// Aggregate internal identity remains in DomainEvent.metadata.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// OTP Challenge
// -----------------------------------------------------------------------------

import { OtpChallengeDomainEvent } from './otp-challenge-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when an OtpChallenge aggregate is created.
 *
 * The event contains only security-approved, non-secret information.
 *
 * The challenged destination is deliberately excluded even though it exists
 * as an OtpChallengeDestination value object inside the aggregate.
 */
export class OtpChallengeCreatedEvent extends OtpChallengeDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    otpChallengeId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly purpose: string,
    public readonly status: string,
    public readonly requestedAt: Date,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      otpChallengeId,
      'OtpChallenge',
      'OtpChallengeCreated',
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
   * The aggregate internal identity remains in DomainEvent.metadata and is
   * therefore not duplicated in the event payload.
   *
   * OtpChallengeDestination is intentionally excluded because its value may
   * contain personally identifiable destination data such as an email address
   * or phone number.
   */
  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      identityPublicId: this.identityPublicId,

      purpose: this.purpose,

      status: this.status,

      requestedAt: OtpChallengeCreatedEvent.cloneDate(this.requestedAt),

      expiresAt: OtpChallengeCreatedEvent.cloneDate(this.expiresAt),

      createdAt: OtpChallengeCreatedEvent.cloneDate(this.createdAt),
    };
  }

  // ===========================================================================
  // Date Safety
  // ===========================================================================

  /**
   * Creates a defensive copy of a Date.
   */
  private static cloneDate(value: Date): Date {
    return new Date(value.getTime());
  }
}

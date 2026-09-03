// -----------------------------------------------------------------------------
// Session — Token Reuse Detected Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a previously used or invalidated refresh-token family is
// presented again.
//
// This event represents a security-relevant Session aggregate event.
//
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// -----------------------------------------------------------------------------
//
// Security boundary:
//
// This event intentionally excludes:
//
// - raw refresh tokens;
// - refreshTokenHash;
// - access tokens;
// - token-family secrets;
// - authentication credentials;
// - token values;
// - token hashes.
//
// The event identifies the affected Session and token family only through
// opaque public identifiers.
//
// -----------------------------------------------------------------------------
//
// Event data:
//
// - Session public identity;
// - Identity public identity;
// - token-family public identity;
// - Session status;
// - detection timestamp.
//
// Aggregate internal identity remains in DomainEvent.metadata.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

import { SessionDomainEvent } from './session-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when refresh-token reuse is detected for a Session.
 *
 * The event records the security-relevant detection without exposing the
 * reused token, its hash, or any other authentication secret.
 */
export class SessionTokenReuseDetectedEvent extends SessionDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    sessionId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly tokenFamilyPublicId: string,
    public readonly status: string,
    public readonly detectedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      sessionId,
      'Session',
      'SessionTokenReuseDetected',
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
   * Session aggregate identity remains in DomainEvent.metadata and is
   * therefore not duplicated in the event payload.
   *
   * Refresh-token material and authentication secrets are intentionally
   * excluded.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      tokenFamilyPublicId: this.tokenFamilyPublicId,
      status: this.status,
      detectedAt: this.detectedAt,
    };
  }
}

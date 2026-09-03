// -----------------------------------------------------------------------------
// Session — Expired Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Session aggregate reaches its expiration boundary.
//
// The event records the Session lifecycle transition to EXPIRED.
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
// - other security-sensitive authentication material.
//
// -----------------------------------------------------------------------------
//
// Event data:
//
// - Session public identity;
// - Identity public identity;
// - Session status;
// - expiration timestamp.
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
 * Raised when a Session aggregate expires.
 *
 * The event records the Session expiration transition without exposing
 * refresh-token material or other authentication secrets.
 */
export class SessionExpiredEvent extends SessionDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    sessionId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly status: string,
    public readonly expiresAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(sessionId, 'Session', 'SessionExpired', correlationId, causationId);

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
   * Security-sensitive session credentials are intentionally excluded.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      status: this.status,
      expiresAt: this.expiresAt,
    };
  }
}

// -----------------------------------------------------------------------------
// Session — Refreshed Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Session successfully refreshes its authentication session.
//
// The event records the successful refresh and the resulting Session state.
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
// Token rotation is represented only through safe public identifiers.
//
// -----------------------------------------------------------------------------
//
// Event data:
//
// - Session public identity;
// - Identity public identity;
// - Session status;
// - lastActivityAt;
// - expiresAt;
// - replacedBySessionPublicId, when applicable.
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
 * Raised when a Session aggregate is successfully refreshed.
 *
 * The event records the resulting Session activity and expiration state
 * without exposing refresh-token material or authentication secrets.
 */
export class SessionRefreshedEvent extends SessionDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    sessionId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly status: string,
    public readonly lastActivityAt: Date,
    public readonly expiresAt: Date,
    public readonly replacedBySessionPublicId: string | undefined,
    correlationId: string,
    causationId?: string,
  ) {
    super(sessionId, 'Session', 'SessionRefreshed', correlationId, causationId);

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
   * Refresh-token material and other authentication secrets are intentionally
   * excluded.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      status: this.status,
      lastActivityAt: this.lastActivityAt,
      expiresAt: this.expiresAt,
      replacedBySessionPublicId: this.replacedBySessionPublicId,
    };
  }
}

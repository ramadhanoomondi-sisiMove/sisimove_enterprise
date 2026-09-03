// -----------------------------------------------------------------------------
// Session — Revoked Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Session aggregate is revoked.
//
// The event records the Session lifecycle transition to REVOKED together with
// the domain-level revocation reason and revocation timestamp.
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
// - revocation reason;
// - revokedAt.
//
// Aggregate internal identity remains in DomainEvent.metadata.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

import { SessionDomainEvent } from './session-domain.event';

import type { SessionRevocationReason } from '../value-objects/session-revocation-reason.vo';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when a Session aggregate is revoked.
 *
 * The event records the Session revocation transition without exposing
 * refresh-token material or other authentication secrets.
 */
export class SessionRevokedEvent extends SessionDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    sessionId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly status: string,
    public readonly revokedAt: Date,
    public readonly revokedReason: SessionRevocationReason,
    correlationId: string,
    causationId?: string,
  ) {
    super(sessionId, 'Session', 'SessionRevoked', correlationId, causationId);

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
      revokedAt: this.revokedAt,
      revokedReason: this.revokedReason,
    };
  }
}

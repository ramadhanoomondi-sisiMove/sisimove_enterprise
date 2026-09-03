// -----------------------------------------------------------------------------
// Session — Created Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Session aggregate is created.
//
// The event records the establishment of a new Session associated with an
// Identity and, optionally, a Device.
//
// Security-sensitive session material is intentionally excluded from the
// event payload.
//
// In particular:
//
// - refreshTokenHash is never published;
// - raw refresh tokens are never published;
// - authentication credentials are never published;
// - token-family secrets are never published.
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
// Safe event data:
//
// - Session public identity;
// - Identity public identity;
// - optional Device public identity;
// - Session status;
// - authenticatedAt;
// - expiresAt.
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
 * Raised when a Session aggregate is created.
 *
 * The event records the creation of a Session without exposing refresh-token
 * material or other authentication secrets.
 */
export class SessionCreatedEvent extends SessionDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    sessionId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly devicePublicId: string | undefined,
    public readonly status: string,
    public readonly authenticatedAt: Date,
    public readonly expiresAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(sessionId, 'Session', 'SessionCreated', correlationId, causationId);

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
      devicePublicId: this.devicePublicId,
      status: this.status,
      authenticatedAt: this.authenticatedAt,
      expiresAt: this.expiresAt,
    };
  }
}

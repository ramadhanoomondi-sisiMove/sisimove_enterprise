// -----------------------------------------------------------------------------
// Authentication — Authenticated Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import { AuthenticationDomainEvent } from './authentication-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when an Authentication aggregate successfully authenticates.
 *
 * The event records the successful authentication transition and the
 * associated authentication timestamp.
 *
 * Credentials, passwords, password hashes, raw tokens, and other sensitive
 * authentication material are intentionally excluded from the event payload.
 */
export class AuthenticationAuthenticatedEvent extends AuthenticationDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    authenticationId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly authenticatedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationAuthenticated',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  /**
   * Returns the event-specific payload.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      authenticatedAt: this.authenticatedAt,
    };
  }
}

// -----------------------------------------------------------------------------
// Authentication — Password Changed Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import { AuthenticationDomainEvent } from './authentication-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when the password associated with an Authentication aggregate
 * is changed.
 *
 * The event records the password lifecycle transition without exposing the
 * password or password hash.
 *
 * Consumers may use this event to invalidate sessions, revoke refresh-token
 * families, clear password-change requirements, or trigger security auditing.
 */
export class AuthenticationPasswordChangedEvent extends AuthenticationDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    authenticationId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly passwordVersion: number,
    public readonly passwordChangedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationPasswordChanged',
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
   * Password credentials and password hashes are intentionally excluded.
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      passwordVersion: this.passwordVersion,
      passwordChangedAt: this.passwordChangedAt,
    };
  }
}

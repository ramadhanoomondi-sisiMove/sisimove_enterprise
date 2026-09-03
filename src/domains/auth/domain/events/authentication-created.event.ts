// -----------------------------------------------------------------------------
// Authentication — Created Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import { AuthenticationDomainEvent } from './authentication-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when an Authentication aggregate is created.
 *
 * Security-sensitive authentication credentials are intentionally excluded
 * from the event payload.
 *
 * In particular:
 *
 * - passwordHash is never published;
 * - raw credentials are never published;
 * - authentication secrets are never published.
 */
export class AuthenticationCreatedEvent extends AuthenticationDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    authenticationId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly status: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationCreated',
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
   * Aggregate identity is already available through metadata and is therefore
   * not duplicated here.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      status: this.status,
    };
  }
}

// -----------------------------------------------------------------------------
// Authentication — Activated Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import { AuthenticationDomainEvent } from './authentication-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when an Authentication aggregate is activated.
 *
 * This event records the Authentication lifecycle transition from a
 * non-active state to ACTIVE.
 *
 * Security-sensitive authentication credentials are intentionally excluded
 * from the event payload.
 */
export class AuthenticationActivatedEvent extends AuthenticationDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    authenticationId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationActivated',
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
    };
  }
}

// -----------------------------------------------------------------------------
// Authentication — Failed Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import { AuthenticationDomainEvent } from './authentication-domain.event';

import type { AuthenticationFailureReason } from '../value-objects/authentication-failure-reason.vo';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when an authentication attempt fails.
 *
 * The event records the domain-level failure reason and the resulting
 * authentication failure count.
 *
 * Sensitive authentication material is intentionally excluded.
 *
 * This event does not expose:
 *
 * - passwords;
 * - password hashes;
 * - raw credentials;
 * - OTP values;
 * - authentication tokens.
 */
export class AuthenticationFailedEvent extends AuthenticationDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    authenticationId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly reason: AuthenticationFailureReason,
    public readonly failedAuthenticationCount: number,
    public readonly failedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationFailed',
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
      reason: this.reason,
      failedAuthenticationCount: this.failedAuthenticationCount,
      failedAt: this.failedAt,
    };
  }
}

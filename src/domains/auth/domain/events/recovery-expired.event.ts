// -----------------------------------------------------------------------------
// Recovery — Expired Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Recovery aggregate expires.
//
// The event records the Recovery lifecycle transition to EXPIRED.
//
// Security-sensitive recovery material is intentionally excluded from the
// event payload.
//
// In particular:
//
// - raw recovery tokens are never published;
// - recovery-token hashes are never published;
// - passwords are never published;
// - password hashes are never published;
// - access tokens are never published;
// - refresh tokens are never published;
// - OTP values are never published;
// - OTP hashes are never published;
// - authentication credentials are never published;
// - cryptographic secrets are never published;
// - other security-sensitive material is never published.
//
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// -----------------------------------------------------------------------------
//
// Safe event data:
//
// - Recovery public identity;
// - Identity public identity;
// - Recovery type;
// - Recovery status;
// - expiresAt timestamp.
//
// Aggregate internal identity remains in DomainEvent.metadata.
//
// -----------------------------------------------------------------------------
//
// Event name:
//
// RecoveryExpired
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Recovery
// -----------------------------------------------------------------------------

import { RecoveryDomainEvent } from './recovery-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when a Recovery aggregate expires.
 *
 * The event records the Recovery expiration transition without exposing
 * recovery tokens, token hashes, credentials, or other security-sensitive
 * material.
 */
export class RecoveryExpiredEvent extends RecoveryDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    recoveryId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly type: string,
    public readonly status: string,
    public readonly expiresAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      recoveryId,
      'Recovery',
      'RecoveryExpired',
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
   * Recovery aggregate identity remains in DomainEvent.metadata and is
   * therefore not duplicated in the event payload.
   *
   * Recovery-token hashes and other security-sensitive material are
   * intentionally excluded.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      type: this.type,
      status: this.status,
      expiresAt: this.expiresAt,
    };
  }
}

// -----------------------------------------------------------------------------
// Recovery — Created Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Recovery aggregate is created.
//
// The event records the establishment of a new Recovery associated with an
// Identity.
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
// - authentication credentials are never published;
// - cryptographic secrets are never published;
// - other security-sensitive recovery material is never published.
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
// - requestedAt timestamp;
// - expiresAt timestamp;
// - creation timestamp.
//
// Aggregate internal identity remains in DomainEvent.metadata.
//
// -----------------------------------------------------------------------------
//
// Event name:
//
// RecoveryCreated
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
 * Raised when a Recovery aggregate is created.
 *
 * The event records the creation of a Recovery without exposing the recovery
 * token, recovery-token hash, credentials, or other security-sensitive
 * material.
 */
export class RecoveryCreatedEvent extends RecoveryDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    recoveryId: string,
    public readonly publicId: string,
    public readonly identityPublicId: string,
    public readonly type: string,
    public readonly status: string,
    public readonly requestedAt: Date,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      recoveryId,
      'Recovery',
      'RecoveryCreated',
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
   * The recovery-token hash and all other security-sensitive recovery material
   * are intentionally excluded.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      identityPublicId: this.identityPublicId,
      type: this.type,
      status: this.status,
      requestedAt: this.requestedAt,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
    };
  }
}

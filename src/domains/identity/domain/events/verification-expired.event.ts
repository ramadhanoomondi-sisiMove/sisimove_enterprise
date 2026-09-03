// -----------------------------------------------------------------------------
// Verification Expired Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when an existing Verification expires.
//
// Aggregate:
// - Verification
//
// Aggregate identity:
// - DomainEvent.metadata.aggregateId
//
// This event does NOT:
// - Delete the Verification;
// - Close or suspend the Identity;
// - Revoke Roles;
// - Delete verification evidence;
// - Perform a new verification request.
//
// It records that the Verification has reached its expiration boundary and
// is no longer considered valid.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------

import { IdentityDomainEvent } from './identity-domain.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  IdentityPublicId,
  VerificationLevel,
  VerificationPublicId,
  VerificationStatus,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Verification expires.
 *
 * The Verification aggregate identity is stored in:
 *
 * - DomainEvent.metadata.aggregateId
 *
 * The externally meaningful public identities of the Verification and
 * associated Identity are included in the event payload.
 */
export class VerificationExpiredEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: VerificationPublicId | PublicEntityId,
    identityPublicId: IdentityPublicId | PublicEntityId,
    status: VerificationStatus,
    level: VerificationLevel,
    expiredAt: Date,
    expiresAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Verification',
      'VerificationExpired',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.identityPublicId = identityPublicId;
    this.status = status;
    this.level = level;
    this.expiredAt = expiredAt;
    this.expiresAt = expiresAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Verification.
   */
  public readonly publicId: VerificationPublicId | PublicEntityId;

  /**
   * Public identity of the Identity whose Verification expired.
   */
  public readonly identityPublicId: IdentityPublicId | PublicEntityId;

  /**
   * Verification lifecycle status after expiration.
   */
  public readonly status: VerificationStatus;

  /**
   * Verification level at the time of expiration.
   */
  public readonly level: VerificationLevel;

  /**
   * Timestamp at which the Verification was determined to have expired.
   */
  public readonly expiredAt: Date;

  /**
   * Original expiration boundary of the Verification.
   */
  public readonly expiresAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      identityPublicId: this.identityPublicId.toString(),

      status: this.status.toString(),

      level: this.level.toString(),

      expiredAt: this.expiredAt,

      expiresAt: this.expiresAt,
    };
  }
}

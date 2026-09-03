// -----------------------------------------------------------------------------
// Verification Request Created Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Verification Request is created.
//
// Aggregate:
// - Verification
//
// Aggregate identity:
// - DomainEvent.metadata.aggregateId
//
// This event does NOT:
// - Approve the Verification Request;
// - Reject the Verification Request;
// - Verify the submitted Asset;
// - Change the Identity status.
//
// It records the creation of a verification request and the evidence
// submitted for the requested verification type.
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
  VerificationPublicId,
  VerificationRequestPublicId,
  VerificationRequestStatus,
  VerificationRequestType,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Verification Request is created.
 *
 * The Verification aggregate identity is stored in:
 *
 * - DomainEvent.metadata.aggregateId
 *
 * The externally meaningful public identities of the Verification,
 * Verification Request, Identity, and Asset are included in the event
 * payload.
 */
export class VerificationRequestCreatedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: VerificationRequestPublicId | PublicEntityId,
    verificationPublicId: VerificationPublicId | PublicEntityId,
    identityPublicId: IdentityPublicId | PublicEntityId,
    assetPublicId: PublicEntityId,
    type: VerificationRequestType,
    status: VerificationRequestStatus,
    submittedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'VerificationRequest',
      'VerificationRequestCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.verificationPublicId = verificationPublicId;
    this.identityPublicId = identityPublicId;
    this.assetPublicId = assetPublicId;
    this.type = type;
    this.status = status;
    this.submittedAt = submittedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Verification Request.
   */
  public readonly publicId: VerificationRequestPublicId | PublicEntityId;

  /**
   * Public identity of the Verification aggregate owning the request.
   */
  public readonly verificationPublicId: VerificationPublicId | PublicEntityId;

  /**
   * Public identity of the Identity requesting verification.
   */
  public readonly identityPublicId: IdentityPublicId | PublicEntityId;

  /**
   * Public identity of the Asset submitted as verification evidence.
   *
   * Asset identity is represented as an opaque cross-aggregate reference.
   */
  public readonly assetPublicId: PublicEntityId;

  /**
   * Type of verification requested.
   */
  public readonly type: VerificationRequestType;

  /**
   * Initial lifecycle status of the Verification Request.
   */
  public readonly status: VerificationRequestStatus;

  /**
   * Timestamp at which the Verification Request was submitted.
   */
  public readonly submittedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      verificationPublicId: this.verificationPublicId.toString(),

      identityPublicId: this.identityPublicId.toString(),

      assetPublicId: this.assetPublicId.toString(),

      type: this.type.toString(),

      status: this.status.toString(),

      submittedAt: this.submittedAt,
    };
  }
}

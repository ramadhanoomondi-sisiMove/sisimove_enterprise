// -----------------------------------------------------------------------------
// Verification Request Submitted Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Verification Request is submitted for review.
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
// - Perform verification;
// - Modify the Identity status;
// - Guarantee that the submitted Asset is valid.
//
// It records the transition of a Verification Request into the review
// workflow.
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
 * Emitted when a Verification Request is submitted for review.
 *
 * The Verification aggregate identity is stored in:
 *
 * - DomainEvent.metadata.aggregateId
 *
 * The externally meaningful public identities of the Verification Request,
 * Verification, Identity, and submitted Asset are included in the event
 * payload.
 */
export class VerificationRequestSubmittedEvent extends IdentityDomainEvent {
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
      'VerificationRequestSubmitted',
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
   * Public identity of the Identity submitting the request.
   */
  public readonly identityPublicId: IdentityPublicId | PublicEntityId;

  /**
   * Public identity of the Asset submitted as verification evidence.
   *
   * Asset identity remains an opaque reference to the Asset boundary.
   */
  public readonly assetPublicId: PublicEntityId;

  /**
   * Type of verification requested.
   */
  public readonly type: VerificationRequestType;

  /**
   * Lifecycle status of the Verification Request after submission.
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

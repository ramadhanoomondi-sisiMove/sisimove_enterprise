// -----------------------------------------------------------------------------
// Verification Request Approved Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Verification Request is approved.
//
// Aggregate:
// - VerificationAggregate
//
// Aggregate Root:
// - VerificationEntity
//
// The aggregate identity is stored in:
// - DomainEvent.metadata.aggregateId
//
// This event represents the successful approval of a specific verification
// request. It does NOT itself perform identity activation, verification-level
// calculation, or any external asset processing.
//
// Those responsibilities belong to the appropriate application/domain
// boundaries.
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
  VerificationRequestStatus,
  VerificationRequestType,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Verification Request is approved.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The verification request public identity is included in the payload because
 * it is the externally meaningful identity of the approved request.
 */
export class VerificationRequestApprovedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    verificationId: PublicEntityId,
    identityId: PublicEntityId,
    type: VerificationRequestType,
    status: VerificationRequestStatus,
    reviewedById: PublicEntityId | undefined,
    reviewedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'VerificationRequest',
      'VerificationRequestApproved',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.verificationId = verificationId;
    this.identityId = identityId;
    this.type = type;
    this.status = status;
    this.reviewedById = reviewedById;
    this.reviewedAt = reviewedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Verification Request.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Public identity of the Verification aggregate associated with the request.
   */
  public readonly verificationId: PublicEntityId;

  /**
   * Public identity of the Identity being verified.
   */
  public readonly identityId: PublicEntityId;

  /**
   * Type of verification that was approved.
   */
  public readonly type: VerificationRequestType;

  /**
   * Resulting status of the Verification Request.
   */
  public readonly status: VerificationRequestStatus;

  /**
   * Public identity of the identity that approved the request.
   *
   * Undefined when the approval was performed by a system process rather than
   * another Identity.
   */
  public readonly reviewedById: PublicEntityId | undefined;

  /**
   * Timestamp at which the Verification Request was approved.
   */
  public readonly reviewedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      verificationId: this.verificationId.toString(),

      identityId: this.identityId.toString(),

      type: this.type.toString(),

      status: this.status.toString(),

      reviewedById:
        this.reviewedById !== undefined
          ? this.reviewedById.toString()
          : undefined,

      reviewedAt: this.reviewedAt,
    };
  }
}

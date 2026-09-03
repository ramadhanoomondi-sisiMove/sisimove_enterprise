// -----------------------------------------------------------------------------
// Verification Request Rejected Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Verification Request is rejected.
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
// This event represents the rejection of a specific verification request.
// It does NOT itself change the parent Identity status or perform any external
// notification.
//
// Those responsibilities belong to the appropriate application and
// integration boundaries.
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
 * Emitted when a Verification Request is rejected.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The verification request public identity is included in the payload because
 * it is the externally meaningful identity of the rejected request.
 */
export class VerificationRequestRejectedEvent extends IdentityDomainEvent {
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
    rejectionReason: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'VerificationRequest',
      'VerificationRequestRejected',
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
    this.rejectionReason = rejectionReason;
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
   * Public identity of the Identity associated with the request.
   */
  public readonly identityId: PublicEntityId;

  /**
   * Type of verification that was rejected.
   */
  public readonly type: VerificationRequestType;

  /**
   * Resulting status of the Verification Request.
   */
  public readonly status: VerificationRequestStatus;

  /**
   * Public identity of the Identity that rejected the request.
   *
   * Undefined when the rejection was performed by a system process.
   */
  public readonly reviewedById: PublicEntityId | undefined;

  /**
   * Timestamp at which the Verification Request was rejected.
   */
  public readonly reviewedAt: Date;

  /**
   * Reason supplied for the rejection.
   */
  public readonly rejectionReason: string | undefined;

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

      rejectionReason: this.rejectionReason,
    };
  }
}

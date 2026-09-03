// -----------------------------------------------------------------------------
// Verification Request Cancelled Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Verification Request is cancelled.
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
// This event represents the cancellation of a specific Verification Request.
// It does NOT itself modify the parent Identity status, delete submitted
// assets, or perform external notifications.
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
 * Emitted when a Verification Request is cancelled.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The verification request public identity is included in the payload because
 * it is the externally meaningful identity of the cancelled request.
 */
export class VerificationRequestCancelledEvent extends IdentityDomainEvent {
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
    cancelledAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'VerificationRequest',
      'VerificationRequestCancelled',
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
    this.cancelledAt = cancelledAt;
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
   * Type of verification that was cancelled.
   */
  public readonly type: VerificationRequestType;

  /**
   * Resulting status of the Verification Request.
   */
  public readonly status: VerificationRequestStatus;

  /**
   * Timestamp at which the Verification Request was cancelled.
   */
  public readonly cancelledAt: Date;

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

      cancelledAt: this.cancelledAt,
    };
  }
}

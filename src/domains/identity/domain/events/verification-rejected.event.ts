// -----------------------------------------------------------------------------
// Verification Rejected Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Verification Request is rejected.
//
// Aggregate:
// - Verification
//
// Aggregate identity:
// - DomainEvent.metadata.aggregateId
//
// This event does NOT:
// - Close or suspend the Identity;
// - Revoke previously granted Roles;
// - Delete the submitted Asset;
// - Perform another verification attempt.
//
// It records the rejection of verification evidence and the resulting
// verification state.
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
  VerificationRequestPublicId,
  VerificationRequestType,
  VerificationStatus,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Verification Request is rejected.
 *
 * The Verification aggregate identity is stored in:
 *
 * - DomainEvent.metadata.aggregateId
 *
 * The externally meaningful public identities of the Verification,
 * Verification Request, Identity, and reviewing Identity are included in
 * the event payload.
 */
export class VerificationRejectedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: VerificationPublicId | PublicEntityId,
    identityPublicId: IdentityPublicId | PublicEntityId,
    requestPublicId: VerificationRequestPublicId | PublicEntityId,
    requestType: VerificationRequestType,
    status: VerificationStatus,
    level: VerificationLevel,
    rejectedAt: Date,
    rejectionReason: string,
    reviewedByPublicId: IdentityPublicId | PublicEntityId | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Verification',
      'VerificationRejected',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.identityPublicId = identityPublicId;
    this.requestPublicId = requestPublicId;
    this.requestType = requestType;
    this.status = status;
    this.level = level;
    this.rejectedAt = rejectedAt;
    this.rejectionReason = rejectionReason;
    this.reviewedByPublicId = reviewedByPublicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Verification.
   */
  public readonly publicId: VerificationPublicId | PublicEntityId;

  /**
   * Public identity of the Identity whose verification was rejected.
   */
  public readonly identityPublicId: IdentityPublicId | PublicEntityId;

  /**
   * Public identity of the rejected Verification Request.
   */
  public readonly requestPublicId: VerificationRequestPublicId | PublicEntityId;

  /**
   * Type of verification evidence that was rejected.
   */
  public readonly requestType: VerificationRequestType;

  /**
   * Verification lifecycle status after rejection.
   */
  public readonly status: VerificationStatus;

  /**
   * Verification level after rejection.
   */
  public readonly level: VerificationLevel;

  /**
   * Timestamp at which the verification request was rejected.
   */
  public readonly rejectedAt: Date;

  /**
   * Business reason supplied for the rejection.
   */
  public readonly rejectionReason: string;

  /**
   * Public identity of the reviewer who rejected the request.
   *
   * Undefined when the rejection was performed automatically by the system.
   */
  public readonly reviewedByPublicId:
    IdentityPublicId | PublicEntityId | undefined;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      identityPublicId: this.identityPublicId.toString(),

      requestPublicId: this.requestPublicId.toString(),

      requestType: this.requestType.toString(),

      status: this.status.toString(),

      level: this.level.toString(),

      rejectedAt: this.rejectedAt,

      rejectionReason: this.rejectionReason,

      reviewedByPublicId:
        this.reviewedByPublicId !== undefined
          ? this.reviewedByPublicId.toString()
          : undefined,
    };
  }
}

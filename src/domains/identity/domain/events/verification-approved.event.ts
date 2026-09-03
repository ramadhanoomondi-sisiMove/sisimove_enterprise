// -----------------------------------------------------------------------------
// Verification Approved Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Verification Request is approved.
//
// Aggregate:
// - Verification
//
// Aggregate identity:
// - DomainEvent.metadata.aggregateId
//
// This event does NOT:
// - Authenticate the Identity;
// - Modify the Identity's authentication state;
// - Assign an authorization Role;
// - Perform external provider operations.
//
// It records the successful approval of verification evidence and the
// resulting verification state.
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
 * Emitted when a Verification Request is approved.
 *
 * The Verification aggregate identity is stored in:
 *
 * - DomainEvent.metadata.aggregateId
 *
 * The externally meaningful public identities of the Verification,
 * Verification Request, Identity, and reviewing Identity are included in
 * the event payload.
 */
export class VerificationApprovedEvent extends IdentityDomainEvent {
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
    approvedAt: Date,
    reviewedByPublicId: IdentityPublicId | PublicEntityId | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Verification',
      'VerificationApproved',
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
    this.approvedAt = approvedAt;
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
   * Public identity of the Identity whose verification was approved.
   */
  public readonly identityPublicId: IdentityPublicId | PublicEntityId;

  /**
   * Public identity of the approved Verification Request.
   */
  public readonly requestPublicId: VerificationRequestPublicId | PublicEntityId;

  /**
   * Type of verification evidence that was approved.
   */
  public readonly requestType: VerificationRequestType;

  /**
   * Verification lifecycle status after approval.
   */
  public readonly status: VerificationStatus;

  /**
   * Verification level after the approval.
   */
  public readonly level: VerificationLevel;

  /**
   * Timestamp at which the verification request was approved.
   */
  public readonly approvedAt: Date;

  /**
   * Public identity of the reviewer who approved the request.
   *
   * Undefined when the approval was performed automatically by the system.
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

      approvedAt: this.approvedAt,

      reviewedByPublicId:
        this.reviewedByPublicId !== undefined
          ? this.reviewedByPublicId.toString()
          : undefined,
    };
  }
}

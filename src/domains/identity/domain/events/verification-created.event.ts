// -----------------------------------------------------------------------------
// Verification Created Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Verification aggregate is created for an Identity.
//
// Aggregate:
// - VerificationAggregate
//
// Aggregate Root:
// - VerificationEntity
//
// Aggregate identity:
// - DomainEvent.metadata.aggregateId
//
// The externally meaningful Verification and Identity public identities are
// included in the event payload.
//
// This event does NOT:
//
// - Verify the Identity.
// - Create a VerificationRequest.
// - Approve or reject verification evidence.
// - Modify Identity status.
// - Verify documents or assets.
// - Perform external side effects.
//
// Those responsibilities belong to the Verification aggregate lifecycle,
// application handlers, verification workflows, or integration boundaries.
//
// -----------------------------------------------------------------------------

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
 * Emitted when a Verification aggregate is created for an Identity.
 *
 * The Verification aggregate identity is stored in:
 *
 * - DomainEvent.metadata.aggregateId
 *
 * The Verification public identity and owning Identity public identity are
 * included in the event payload because they are the externally meaningful
 * identifiers consumed across bounded contexts and application boundaries.
 *
 * A newly created Verification starts with its initial lifecycle status and
 * verification level.
 */
export class VerificationCreatedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: VerificationPublicId,
    identityPublicId: IdentityPublicId,
    status: VerificationStatus,
    level: VerificationLevel,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Verification',
      'VerificationCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.identityPublicId = identityPublicId;
    this.status = status;
    this.level = level;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the created Verification.
   */
  public readonly publicId: VerificationPublicId;

  /**
   * Public identity of the Identity that owns the Verification.
   */
  public readonly identityPublicId: IdentityPublicId;

  /**
   * Initial lifecycle status of the Verification.
   */
  public readonly status: VerificationStatus;

  /**
   * Initial verification level of the Verification.
   */
  public readonly level: VerificationLevel;

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
    };
  }
}

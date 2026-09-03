// -----------------------------------------------------------------------------
// Identity Created Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when an Identity is created.
//
// Aggregate:
// - IdentityAggregate
//
// Aggregate Root:
// - IdentityEntity
//
// The aggregate identity is stored in:
// - DomainEvent.metadata.aggregateId
//
// The externally meaningful Identity public identity is included in the event
// payload.
//
// This event does NOT:
//
// - Create authentication credentials.
// - Authenticate the Identity.
// - Assign roles.
// - Create a Verification.
// - Send notifications.
// - Create assets.
// - Perform external side effects.
//
// Those responsibilities belong to their respective aggregates, application
// handlers, domain event consumers, or integration boundaries.
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

import type { IdentityStatus } from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when an Identity is created.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The Identity public identity is included in the payload because it is the
 * externally meaningful identity that may be safely consumed by other bounded
 * contexts, application components, and event consumers.
 */
export class IdentityCreatedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    status: IdentityStatus,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Identity',
      'IdentityCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.status = status;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the newly created Identity.
   *
   * This is the externally meaningful identifier and is safe to expose across
   * bounded contexts and application boundaries.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Initial lifecycle status of the newly created Identity.
   *
   * A newly created Identity begins in the PENDING state.
   */
  public readonly status: IdentityStatus;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      status: this.status.toString(),
    };
  }
}

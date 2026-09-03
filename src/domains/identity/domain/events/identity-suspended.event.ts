// -----------------------------------------------------------------------------
// Identity Suspended Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when an Identity is suspended.
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
// - Close the Identity.
// - Revoke authentication sessions directly.
// - Lock authentication credentials.
// - Revoke assigned roles.
// - Send notifications.
// - Perform external side effects.
//
// Those responsibilities belong to their respective aggregates, application
// handlers, domain event consumers, or integration boundaries.
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
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when an Identity transitions into the SUSPENDED lifecycle state.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The Identity public identity is included in the payload because it is the
 * externally meaningful identifier that may be safely consumed across bounded
 * contexts and application boundaries.
 */
export class IdentitySuspendedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    suspendedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Identity',
      'IdentitySuspended',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.suspendedAt = suspendedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the suspended Identity.
   *
   * This is the externally meaningful identifier and is safe to expose across
   * bounded contexts and application boundaries.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Timestamp at which the Identity entered the SUSPENDED lifecycle state.
   */
  public readonly suspendedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      suspendedAt: this.suspendedAt.toISOString(),
    };
  }
}

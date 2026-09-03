// -----------------------------------------------------------------------------
// Identity Closed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when an Identity is closed.
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
// - Delete the Identity record.
// - Revoke authentication sessions directly.
// - Delete authentication credentials.
// - Remove role assignments.
// - Delete verification records.
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
 * Emitted when an Identity transitions into the CLOSED lifecycle state.
 *
 * Closing an Identity represents a terminal lifecycle transition. The Identity
 * aggregate remains identifiable for historical, audit, and domain integrity
 * purposes unless an explicit data-retention policy defines otherwise.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The Identity public identity is included in the payload because it is the
 * externally meaningful identifier that may be safely consumed across bounded
 * contexts and application boundaries.
 */
export class IdentityClosedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    closedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Identity',
      'IdentityClosed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.closedAt = closedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the closed Identity.
   *
   * This is the externally meaningful identifier and is safe to expose across
   * bounded contexts and application boundaries.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Timestamp at which the Identity entered the CLOSED lifecycle state.
   */
  public readonly closedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      closedAt: this.closedAt.toISOString(),
    };
  }
}

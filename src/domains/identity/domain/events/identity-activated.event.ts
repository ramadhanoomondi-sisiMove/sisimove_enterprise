// -----------------------------------------------------------------------------
// Identity Activated Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when an Identity is activated.
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
// Activation requires only the Identity public identity.
// Correlation and causation metadata are not part of the activation business
// operation.
//
// This event does NOT:
//
// - Authenticate the Identity.
// - Create a Session.
// - Assign roles.
// - Create or approve a Verification.
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
 * Emitted when an Identity transitions into the ACTIVE lifecycle state.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The Identity public identity is included in the payload because it is the
 * externally meaningful identifier that may be safely consumed across bounded
 * contexts and application boundaries.
 *
 * Activation itself does not require correlation or causation identifiers.
 */
export class IdentityActivatedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    activatedAt: Date,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Identity',
      'IdentityActivated',
      undefined,
      undefined,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.activatedAt = activatedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the activated Identity.
   *
   * This is the externally meaningful identifier and is safe to expose across
   * bounded contexts and application boundaries.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Timestamp at which the Identity entered the ACTIVE lifecycle state.
   */
  public readonly activatedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      activatedAt: this.activatedAt.toISOString(),
    };
  }
}

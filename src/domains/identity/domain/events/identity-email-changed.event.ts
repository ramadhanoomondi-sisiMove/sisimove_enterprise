// -----------------------------------------------------------------------------
// Identity Email Changed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when the email address of an Identity is changed.
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
// The Identity public identity is included in the event payload.
//
// This event does NOT:
//
// - Authenticate the Identity.
// - Verify the new email address.
// - Create or revoke a Session.
// - Change authentication credentials.
// - Send an email directly.
// - Perform external side effects.
//
// Those responsibilities belong to their respective application, authentication,
// notification, verification, or integration boundaries.
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
 * Emitted when an Identity's email address changes.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The Identity public identity is included in the payload because it is the
 * externally meaningful identifier that may be safely consumed across bounded
 * contexts and application boundaries.
 *
 * The email address is included because downstream consumers may need the new
 * contact address to perform their own bounded-context responsibilities.
 */
export class IdentityEmailChangedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    email: string,
    changedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Identity',
      'IdentityEmailChanged',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.email = email;
    this.changedAt = changedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Identity whose email changed.
   */
  public readonly publicId: PublicEntityId;

  /**
   * New email address assigned to the Identity.
   */
  public readonly email: string;

  /**
   * Timestamp at which the email address was changed.
   */
  public readonly changedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      email: this.email,

      changedAt: this.changedAt.toISOString(),
    };
  }
}

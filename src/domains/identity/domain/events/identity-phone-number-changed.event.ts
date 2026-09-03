// -----------------------------------------------------------------------------
// Identity Phone Number Changed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when the phone number of an Identity is changed.
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
// - Verify the new phone number.
// - Authenticate the Identity.
// - Create or revoke a Session.
// - Change authentication credentials.
// - Send an OTP directly.
// - Send notifications.
// - Perform external side effects.
//
// Those responsibilities belong to their respective application,
// authentication, verification, notification, or integration boundaries.
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
 * Emitted when an Identity's phone number changes.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The Identity public identity is included in the payload because it is the
 * externally meaningful identifier that may be safely consumed across bounded
 * contexts and application boundaries.
 *
 * The new phone number is included because downstream consumers may require
 * the updated contact destination for their own bounded-context responsibilities.
 */
export class IdentityPhoneNumberChangedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    phoneNumber: string,
    changedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Identity',
      'IdentityPhoneNumberChanged',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.phoneNumber = phoneNumber;
    this.changedAt = changedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Identity whose phone number changed.
   */
  public readonly publicId: PublicEntityId;

  /**
   * New phone number assigned to the Identity.
   */
  public readonly phoneNumber: string;

  /**
   * Timestamp at which the phone number was changed.
   */
  public readonly changedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      phoneNumber: this.phoneNumber,

      changedAt: this.changedAt.toISOString(),
    };
  }
}
